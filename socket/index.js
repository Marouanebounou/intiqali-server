import { Server } from "socket.io";
import jwt from "jsonwebtoken";
import Messages from "../models/Message.js";
import User from "../models/User.js";
import Conversation from "../models/Conversation.js";

export default function initSocket (server){
    const io = new Server(server, {
        cors: {
            origin: process.env.CLIENT_URL || "*",
            credentials: true,
        },
        pingInterval: 10000,
        pingTimeout: 5000,
    });
    io.use((socket, next) => {
        try {
            const token = socket.handshake.auth.token || (socket.handshake.headers?.authorization || "").split(" ")[1];

            if(!token){
                return next(new Error("Authentication error"));
            }
            const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
            socket.userId = decoded.id;
            return next();
        } catch (error) {
            console.log(error);
            next(new Error("Authentication error"));
        }
    });
    
    const onlineUsers = new Map()
    io.on("connection", async (socket) => {
        const userId = socket.userId

        socket.join(userId)
        if(!onlineUsers.has(userId)){
            onlineUsers.set(userId,socket.id)
        }
        onlineUsers.get(userId).add(socket.id)

        io.to(userId).emit('prensence:me' , {online : true})
        socket.on('message:send',async (playload , ack) => {
            try {
                const {reciverId , text , temp} = playload || {}
                if(!reciverId || !text){
                    return ack({error:"Reciver id is required and message" })
                }

                const receiver = await User.findById(reciverId).select('_id')
                if(!receiver){
                    return ack({error:"Reciver not found" })
                }

                let conversation = await Conversation.findOne({
                    members:{$all:[userId,reciverId]}
                })

                if(!conversation){
                    conversation = new Conversation({
                        members:[userId,reciverId]
                    })
                    await conversation.save()
                }

                const message = new  Messages({
                    sender:userId,
                    receiver:reciverId,
                    content:text,
                    conversationId:conversation._id,
                    isRead:false
                })
                await message.save()

                conversation.lastMessage = message._id  
                await conversation.save()

                const full = await message
                .populate('sender','name')
                .populate('receiver','name')

            } catch (error) {
                if (typeof ack === 'function') ack({ ok: false, error: err.message });
            }
        })
        socket.on('typing:start',({reciverId})=>{
            if(reciverId) io.to(reciverId).emit('typing:start', {userId})
        })
        socket.on('typing:stop',({reciverId})=>{
            if(reciverId) io.to(reciverId).emit('typing:stop', {userId})
        })

        socket.on('message:read', async ({conversationId})=>{
            if(conversationId)return ;
                await Messages.updateMany({conversationId , receiver: userId , isRead : false},
                    {$set :{isRead : true}}
                )

                io.to(userId).emit('message:read:me', {conversationId})

                const conv = await Conversation.findById(conversationId).select('members')
                    if(conv?.members?.lenght){
                        conv.members
                        .map(String)
                        .filter(id => id !== userId)
                        .forEach((memberId) => io.to(memberId).emit('message:read:peer', {conversationId}))
                    }
            
        })

        socket.on('disconnect', () => {
            const set = onlineUsers.get(userId)
            if(set){
                set.delete(socket.id)
                if(set.size === 0){
                    onlineUsers.delete(userId)
                    io.to(userId).emit('prensence:me' , {online : false})
                }
            }
        });
    })
}

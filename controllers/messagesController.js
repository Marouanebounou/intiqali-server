import User from "../models/User";
import Messages from "../models/Message";
import Conversation from "../models/Conversation";

export const sendMessage = async(req,res) => {
    try{
        const senderId = req.user._id
        const {receiverId , text} = req.body
        let conversation = await Conversation.findOne({
            members:{$all:[senderId,receiverId]}
        })

        if(!conversation){
            conversation = new Conversation({
                members:[senderId,receiverId]
            })
            await conversation.save()
        }
        const sender = await User.findById(senderId)
        const receiver = await User.findById(receiverId)
        if(!sender || !receiver){
            return res.status(400).json({message:"User not found"})
        }


        const message = new Messages({
            sender:senderId,
            receiver:receiverId,
            content:text
        })
        await message.save()

        conversation.lastMessage = message._id  
        await conversation.save()   
        res.status(200).json({message:"Message sent successfuly"})
    }catch(error){
        console.log(error);
    }
}

export const getMessages = async(req,res) => {
    try{
        
    }catch(error){
        console.log(error);
    }
}
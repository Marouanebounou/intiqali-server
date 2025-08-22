import express from 'express';
import connectDB from './config/db.js';
import authRouter from './routes/authRouter.js';
import finishProfileRouter from './routes/finishProfileRouter.js';
import postsRouter from './routes/postsRouter.js';
import commentsRouter from './routes/commentsRouter.js';
import likesRouter from './routes/likesRouter.js';
import messagesRouter from './routes/messagesRouter.js';
import { Server } from 'socket.io';
import http from 'http';
import initSocket from "./socket/index.js"




connectDB();
const app = express();
app.use(express.json());
const PORT = process.env.PORT || 5000;

app.use('/api/auth', authRouter);
app.use('/api/complete', finishProfileRouter);
app.use('/api/posts', postsRouter);
app.use('/api/post', likesRouter);
app.use('/api/comment'  ,commentsRouter)
app.use('/api/messages', messagesRouter);

const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: '*',
        methods: ['GET', 'POST', 'PUT', 'DELETE'],
    }
});


server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);   
});


export { io };

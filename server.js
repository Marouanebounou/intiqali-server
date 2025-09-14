import express from 'express';
import connectDB from './config/db.js';
import './config/cloudinary.js'; // Import cloudinary config
import authRouter from './routes/authRouter.js';
import finishProfileRouter from './routes/finishProfileRouter.js';
import postsRouter from './routes/postsRouter.js';
import commentsRouter from './routes/commentsRouter.js';
import likesRouter from './routes/likesRouter.js';
import messagesRouter from './routes/messagesRouter.js';
import friendsRouter from './routes/friendsRouter.js';
import { Server } from 'socket.io';
import http from 'http';
import cors from 'cors';

// Create the Express app
const app = express();

// Connect to database
connectDB();

app.use(express.json());

// CORS configuration - allow all origins
app.use(cors({
    origin: ['https://intiqali.netlify.app', 'http://localhost:3000', 'http://localhost:5173'],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization', 'x-requested-with'],
    credentials: true
}));

// Handle preflight requests
app.options('*', cors());

// Additional CORS middleware for serverless environment
app.use((req, res, next) => {
    const allowedOrigins = ['https://intiqali.netlify.app', 'http://localhost:3000', 'http://localhost:5173'];
    const origin = req.headers.origin;
    
    if (allowedOrigins.includes(origin)) {
        res.header('Access-Control-Allow-Origin', origin);
    }
    
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS, PATCH');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, x-requested-with');
    res.header('Access-Control-Allow-Credentials', 'true');
    
    if (req.method === 'OPTIONS') {
        res.sendStatus(200);
    } else {
        next();
    }
});

app.use('/api/auth', authRouter);
app.use('/api/profile', finishProfileRouter);
app.use('/api/posts', postsRouter);
app.use('/api/post', likesRouter);
app.use('/api/comment', commentsRouter);
app.use('/api/messages', messagesRouter);
app.use('/api/friends' , friendsRouter);

// Add route aliases for backward compatibility
app.use('/auth', authRouter);
app.use('/profile', finishProfileRouter);
app.use('/posts', postsRouter);
app.use('/post', likesRouter);
app.use('/comment', commentsRouter);
app.use('/messages', messagesRouter);

// Socket.IO setup for local development only
let io = null;

// Only start the server if we're not in Vercel (serverless)
if (process.env.VERCEL !== '1') {
    const PORT = process.env.PORT || 5000;
    const server = http.createServer(app);

    // Socket.IO configuration - allow all origins
    io = new Server(server, {
        cors: {
            origin: true, // Allow all origins
            methods: ['GET', 'POST', 'PUT', 'DELETE'],
            credentials: true 
        }
    });

    server.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
}

export default app;
export { io };
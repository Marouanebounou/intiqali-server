import express from 'express';
import connectDB from './config/db.js';
import './config/cloudinary.js'; // Import cloudinary config
import authRouter from './routes/authRouter.js';
import finishProfileRouter from './routes/finishProfileRouter.js';
import postsRouter from './routes/postsRouter.js';
import commentsRouter from './routes/commentsRouter.js';
import likesRouter from './routes/likesRouter.js';
import messagesRouter from './routes/messagesRouter.js';
import { Server } from 'socket.io';
import http from 'http';
import cors from 'cors';

// Connect to database with error handling
const initializeApp = async () => {
  try {
    await connectDB();
    
    const app = express();
    app.use(express.json());

    const PORT = process.env.PORT || 5000;

    // CORS configuration for both development and production
    const allowedOrigins = [
      'http://localhost:5173',
      'https://coruscating-florentine-742350.netlify.app',
      'https://coruscating-florentine-742350.netlify.app/',
      process.env.FRONTEND_URL // Add this environment variable in Vercel
    ].filter(Boolean);

    app.use(cors({
        origin: allowedOrigins,
        methods: ['GET', 'POST', 'PUT', 'DELETE'],
        credentials: true
    }));

    app.use('/api/auth', authRouter);
    app.use('/api/profile', finishProfileRouter);
    app.use('/api/posts', postsRouter);
    app.use('/api/post', likesRouter);
    app.use('/api/comment', commentsRouter);
    app.use('/api/messages', messagesRouter);

    let io = null;

    // Only start the server if we're not in Vercel (serverless)
    if (process.env.VERCEL !== '1') {
        const server = http.createServer(app);

        // Socket.IO configuration
        io = new Server(server, {
            cors: {
                origin: allowedOrigins,
                methods: ['GET', 'POST', 'PUT', 'DELETE'],
                credentials: true 
            }
        });

        server.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });
    }

    // Export the app for Vercel and io for local development
    return { app, io };
  } catch (error) {
    console.error('Failed to initialize application:', error);
    if (process.env.NODE_ENV === 'production') {
      process.exit(1);
    }
    throw error;
  }
};

// Initialize the app
const { app, io } = await initializeApp();

export default app;
export { io };
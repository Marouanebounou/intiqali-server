import express from 'express';
import cors from 'cors';

// Create the Express app
const app = express();

// Connect to database (commented out for now)
// connectDB().catch(err => {
//     console.error('Database connection failed:', err);
//     // Don't exit in serverless environment, let the function handle it gracefully
// });

app.use(express.json());

// Simple CORS configuration
app.use(cors());

// Routes commented out for now to isolate the issue
// app.use('/api/auth', authRouter);
// app.use('/api/profile', finishProfileRouter);
// app.use('/api/posts', postsRouter);
// app.use('/api/post', likesRouter);
// app.use('/api/comment', commentsRouter);
// app.use('/api/messages', messagesRouter);
// app.use('/api/friends' , friendsRouter);

// Health check endpoint
app.get('/health', (req, res) => {
    res.status(200).json({ 
        status: 'OK', 
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV || 'development'
    });
});

// Simple test endpoint
app.get('/test', (req, res) => {
    res.status(200).json({ 
        message: 'Server is working!',
        timestamp: new Date().toISOString()
    });
});

// Add route aliases for backward compatibility (commented out)
// app.use('/auth', authRouter);
// app.use('/profile', finishProfileRouter);
// app.use('/posts', postsRouter);
// app.use('/post', likesRouter);
// app.use('/comment', commentsRouter);
// app.use('/messages', messagesRouter);

// Global error handler
app.use((err, req, res, next) => {
    console.error('Global error handler:', err);
    res.status(500).json({ 
        error: 'Internal Server Error',
        message: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong'
    });
});

// 404 handler
app.use('*', (req, res) => {
    res.status(404).json({ error: 'Route not found' });
});

export default app;
import mongoose from "mongoose";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

const connectDb = async () => {
  try {
    // Get MongoDB URL from environment variables
    const mongoUrl = process.env.MONGO_URL || process.env.MONGODB_URI;
    
    if (!mongoUrl) {
      throw new Error("MongoDB connection string not found in environment variables");
    }

    // Validate connection string format
    if (mongoUrl.includes('@@')) {
      throw new Error("Invalid MongoDB connection string: contains '@@' instead of '@'");
    }

    console.log("Attempting to connect to MongoDB...");
    
    // Connect to MongoDB with modern options
    await mongoose.connect(mongoUrl, {
      serverSelectionTimeoutMS: 10000, // 10 seconds
      socketTimeoutMS: 45000, // 45 seconds
    });
    
    console.log("Database connected successfully");
  } catch (error) {
    console.error("Database connection error:", error.message);
    
    // In production (Vercel), we might want to exit gracefully
    if (process.env.NODE_ENV === 'production') {
      console.error("Fatal: Cannot connect to database in production");
      process.exit(1);
    }
    
    // In development, just log the error
    console.error("Database connection failed:", error);
  }
};

export default connectDb;
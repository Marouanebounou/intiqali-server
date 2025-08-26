import mongoose from "mongoose";

const PostSchema = new mongoose.Schema({
    content: {
        type: String,
    },
    img: {
        type: String,
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    likesCount: {
        type: Number,
        default: 0
    },
    likes: [
        {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true 
    }],
    commentsCount: {
        type: Number,
        default: 0
    },
    userImage:{
        type: String
    },
    postUser: {
        type: String
    }
}, {timestamps: true})

export default mongoose.model('Post', PostSchema)
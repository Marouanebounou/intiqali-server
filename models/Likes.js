import mongoose from "mongoose";
import { type } from "os";

const LikesSchema =  new mongoose.Schema({
    user:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    post:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Post',
        required: true
    },
    likesCount: {
        type: Number,
        default: 0
    }
},{timestamps: true})

// give the user right to like a post only once
LikesSchema.index({post: 1, user: 1}, {unique: true});

export default mongoose.model('Likes', LikesSchema)
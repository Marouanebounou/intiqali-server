import mongoose from "mongoose";

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
    }
},{timestamps: true})

// give the user right to like a post only once
LikesSchema.index({post: 1, user: 1}, {unique: true});

export default mongoose.model('Likes', LikesSchema)
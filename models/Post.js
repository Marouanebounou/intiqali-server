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
    }
}, {timestamps: true})

export default mongoose.model('Post', PostSchema)
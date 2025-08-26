import mongoose from "mongoose";

const CommentsSchema = new mongoose.Schema({
    content: {
        type: String,
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    postId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Post',
        required: true
    },
    parentComment: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Comments',
        default: null
    },
    replies: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Comments'
    }],
    commentUser: {
        type: String
    },
    userImage: {
        type: String
    }

}, {timestamps: true})


export default mongoose.model('Comments', CommentsSchema)
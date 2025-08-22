import User from "../models/User.js";
import Post from "../models/Post.js";
import Comment from "../models/Comments.js";
import jwt from 'jsonwebtoken'
import nodemailer from 'nodemailer'


export const createComment = async (req,res) => {
    try {
        const postId = req.params.id
        const userId = req.user._id
        const {content} = req.body
        const post = await Post.findById(postId)
        if(!post){
            return res.status(400).json({message:"Post not found"})
        }else{
            const comment = new Comment({
                content,
                createdBy:userId,
                postId:postId
            })
            await comment.save()
            res.status(200).json({message:"Comment created successfuly"})
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal server error" });
    }
}

export const editComment = async(req,res)=>{
    try {
        const userId = req.user._id
        const commentId = req.params.id
        const {content} = req.body
        const comment = await Comment.findById(commentId)
        if(comment.createdBy.toString() !== userId){
            return res.status(400).json({message:"You are not authorized"})
        }else{
            if(!comment){
                return res.status(400).json({message:"Comment not found"})
            }else{
                comment.content = content
                await comment.save()
                res.status(200).json({message:"Comment edited successfuly"})
            }
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal server error" });
    }
}

export const deleteComment = async (req, res) => {
    try {
        const userId = req.user._id
        const commentId = req.params.id

        if (!userId) {
            return res.status(401).json({ message: "User not authenticated" });
        }

        const comment = await Comment.findById(commentId);

        if (!comment) {
            return res.status(404).json({ message: "Comment not found" });
        }

        if(comment.createdBy.toString() !== userId.toString()){
            return res.status(400).json({message:"You are not authorized"})
        }

        await Comment.findByIdAndDelete(commentId);
        res.status(200).json({ message: "Comment deleted successfully" });

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal server error" });
    }
}

export const getComment = async (req , res) =>{
    try {
        const postId = req.params.id
        const post = await Post.findById(postId)
        if(!post){
            return res.status(400).json({message:"Post not found"})
        }
        const comments = await Comment.find({postId:postId})
        res.status(200).json({comments})
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal server error" });
    }
}
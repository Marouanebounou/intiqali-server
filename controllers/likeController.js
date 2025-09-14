import Post from "../models/Post.js";
import Likes from "../models/Likes.js";
import nodemailer from 'nodemailer' 
import {io}  from '../server.js'

export const likePost = async(req,res)=>{
    try {
        const postId = req.params.id
        const userId = req.params.user
        //check if post existed
        const post = await Post.findById(postId)
        if(!post){
            return res.status(400).json({message:"Post not found"})
        }

        //CHECK IF USER ALREADY LIKED

        const isLiked = await Likes.findOne({post:postId,user:userId})
        if(isLiked){
            await Likes.findByIdAndDelete(isLiked._id)
            await Post.findByIdAndUpdate(postId,{$inc:{likesCount:-1}})
            io.emit('unlike',postId)
            res.status(200).json({message:"Post unliked successfuly"})
        }else{
            const newLike = new Likes({post:postId,user:userId})
            await newLike.save()
            await Post.findByIdAndUpdate(postId,{$inc:{likesCount:1}})
            io.emit('like', postId)
            res.status(200).json({message:"Post liked successfuly"})
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Error processing like" });
    }
}

export const unlikePost = async(req,res)=>{
    try {
        const postId = req.params.id
        const userId = req.user._id

        //check if post existed
        const post = await Post.findById(postId)
        if(!post){
            return res.status(400).json({message:"Post not found"})

        }
        const isLiked = await Likes.findOne({post:postId,user:userId})
        if(!isLiked){
            return res.status(400).json({message:"You have not liked this post"})
        }else{
            //Unlike
            await Likes.findByIdAndDelete(isLiked._id)
            //dicreamnt likes on post
            await Post.findByIdAndUpdate(postId,{$inc:{likesCount:-1}})
            
            io.emit('unlike',postId)
            res.status(200).json({message:"Post unliked successfuly"})
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Error processing unlike" });
    }
}

export const getLikes = async(req,res)=>{
    try {
        const postId = req.params.id
        const post = await Post.findById(postId)
        if(!post){
            return res.status(400).json({message:"Post not found"})
        }else{
            const likes = await Likes.find({post:postId})
            const likesCount = likes.length
            res.status(200).json({likes , likesCount})
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Error fetching likes" });
    }
}

// Get all likes for a specific user
export const getUserLikes = async (req, res) => {
    try {
        const userId = req.params.userId;
        const likes = await Likes.find({ user: userId });
        res.status(200).json({ likes });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Error fetching user likes" });
    }
}


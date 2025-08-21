import Post from "../models/Post.js"
import User from "../models/User.js"

export const createPost = async (req,res) =>{
    try {
        if (!req.user || !req.user._id) {
            return res.status(401).json({ message: "User not authenticated" });
        }
        const { content, img } = req.body;
        const userId = req.user._id;
        const post = new Post({
            content,
            img,
            createdBy: userId
        });
        await post.save();
        res.status(200).json({ message: "Post created successfully" });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal server error" });
    }
}

export const editPost = async (req ,res) =>{
    try {
        if (!req.user || !req.user._id) {
            return res.status(401).json({ message: "User not authenticated" });
        }
        const {content , img} = req.body
        const post = await Post.findById(req.params.id);
        post.content = content
        post.img = img
        await post.save()
        res.status(200).json({message:"Post edited successfuly"})
    } catch (error) {
        console.log(error);
    }
}

export const deletePost = async (req , res) => {
    try {
        await Post.findByIdAndDelete(req.params.id);
        res.status(200).json({message:"Post deleted successfuly"})
    } catch (error) {
        console.log(error);
    }
}

export const userPosts = async(req,res) => {
    try {
        const createdBy = req.params.id 
        const posts = await Post.find({createdBy});
        res.status(200).json({posts})
    } catch (error) {
        console.log(error);
    }
}

export const getPost = async (req,res)=>{
    try {
        const post = await Post.findById(req.params.id);
        res.status(200).json({post})
    } catch (error) {
        console.log(error);
    }
}

export const gettAllPosts = async (req,res)=>{
    try {
        const posts = await Post.find();
        res.status(200).json({posts})
    } catch (error) {
        console.log(error);
    }
}
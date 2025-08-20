import Post from "../models/Post.js"
import User from "../models/User.js"

export const createPost = async (req,res) =>{
    try {
        const {content , img} = req.body
        const user = await User.findById(req.params.id);
        const post = new Post({
            content,
            img,
            createdBy:user._id
        })
        await post.save()
        res.status(200).json({message:"Post created successfuly"})
    } catch (error) {
        console.log(error);
        
    }
}

export const editPost = async (req ,res) =>{
    try {
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
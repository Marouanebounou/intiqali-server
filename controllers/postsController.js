import Post from "../models/Post.js"
import User from "../models/User.js"
import cloudinary from "../config/cloudinary.js"

export const createPost = async (req, res) => {
  try {
    if (!req.user || !req.user._id) {
      return res.status(401).json({ message: "User not authenticated" });
    }

    const { content } = req.body;
    const userId = req.user._id;
    const postWriter = await User.findById(userId);
    const postName = postWriter.firstName + " " + postWriter.lastName;
    const userImage = postWriter.profileImage

    let imageUrl = null;
    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: "posts",
      });
      imageUrl = result.secure_url;
    }

    const post = new Post({
      content,
      img: imageUrl,
      createdBy: userId,
      postUser: postName,
      userImage: userImage
    });

    await post.save();

    res.status(200).json({
      message: "Post created successfully",
      post,
    });
  } catch (error) {
    console.error("Error creating post:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

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
        const posts = await Post.find({createdBy}).sort({ createdAt: -1 });
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
        const posts = await Post.find().sort({ createdAt: -1 });
        Promise.all(
            posts.map(async (post) => {
                const user = await User.findById(post.createdBy).select("-password");
                post.createdBy = user;
            })
        ).then(() => {
            res.status(200).json({posts})
        }).catch((error) =>
            console.log(error)
        )
    } catch (error) {
        console.log(error);
    }
}

export const like = async (req, res) => {
    try {
        const postId = req.params.id;
        const userId = req.user._id;
        
        const post = await Post.findById(postId);
        if (!post) {
            return res.status(404).json({ message: "Post not found" });
        }
        
        const userIndex = post.likes.indexOf(userId.toString());
        
        if (userIndex > -1) {
            // Unlike the post
            post.likes.splice(userIndex, 1);
            await post.save();
            return res.status(200).json({ 
                message: "Post unliked successfully", 
                likes: post.likes.length 
            });
        } else {
            // Like the post
            post.likes.push(userId.toString());
            await post.save();
            return res.status(200).json({ 
                message: "Post liked successfully", 
                likes: post.likes.length 
            });
        }
        
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Server error" });
    }
};
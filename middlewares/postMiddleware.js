import jwt from "jsonwebtoken";
import User from "../models/User.js";
import Post from "../models/Post.js";

export const postAuth = async (req,res,next)=>{
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        return res.status(401).json({ message: "No authorization header provided" });
    }
        const token = authHeader.split(" ")[1];
    try {

            const { id } = jwt.verify(token, process.env.JWT_SECRET_KEY);
            req.user = await User.findById(id);
            if (!req.user) {
                return res.status(401).json({ message: "User not found" });
            }
            const postId = req.params.id;
            const userId = req.user._id.toString();

            const post = await Post.findById(postId);

            if (!post) {
                return res.status(400).json({ message: "Post not found" });
            }
            if (post.createdBy.toString() !== userId) {
                return res.status(400).json({ message: "You are not authorized" });
            }

            req.post = post;

            next();

    } catch (error) {
        console.log(error);
        res.status(401).json({ message: "Request is not authorized" });
    }
}
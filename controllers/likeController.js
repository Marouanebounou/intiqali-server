import Post from "../models/Post.js";
import Likes from "../models/Likes.js";
import nodemailer from 'nodemailer' 
import {io}  from '../server.js'

export const likePost = async(req,res)=>{
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: process.env.EMAIL,
          pass: process.env.PASSWORD
        }
    })
    const mailOptions = {
        from: process.env.EMAIL,
        to: req.user.email,
        subject: 'You have a new like',
        html:`
        <!doctype html>
<html lang="en" style="background:#f5f7fb;">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width,initial-scale=1" />
  <title>New like</title>
  <style>
    @media (prefers-color-scheme: dark) {
      body, .wrapper { background:#0f172a !important; }
      .card { background:#111827 !important; color:#e5e7eb !important; }
      .muted { color:#9ca3af !important; }
      .btn { background:#3b82f6 !important; color:#fff !important; }
      a { color:#93c5fd !important; }
    }
    @media only screen and (max-width:600px) {
      .card { padding: 24px !important; }
      .btn { width:100% !important; display:block !important; }
    }
  </style>
</head>
<body style="margin:0;padding:0;background:#f5f7fb;">
  <table role="presentation" class="wrapper" width="100%" cellspacing="0" cellpadding="0" border="0" style="background:#f5f7fb;padding:24px 0;">
    <tr>
      <td align="center">
        <table role="presentation" width="600" cellspacing="0" cellpadding="0" border="0" class="card" style="background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.06);font-family:Arial,Helvetica,sans-serif;color:#0f172a;">
          <tr>
            <td style="padding:24px 28px;border-bottom:1px solid #e5e7eb;">
              <h1 style="margin:0;font-size:20px;font-weight:700;line-height:1.3;">Intiqali</h1>
            </td>
          </tr>

          <tr>
            <td style="padding:28px;">
              <h2 style="margin:0 0 8px;font-size:18px;line-height:1.4;">You have a new like 👍</h2>
              <p style="margin:0 0 16px;font-size:14px;line-height:1.7;color:#334155;">
                <a href="#" style="color:#2563eb;text-decoration:none;">${req.user.firstName}</a> liked <strong>Your post</strong>.
              </p>

              <table role="presentation" cellspacing="0" cellpadding="0" border="0" style="margin:24px 0;">
                <tr>
                  <td>
                    <a class="btn" href="" 
                       style="background:#2563eb;color:#ffffff;text-decoration:none;padding:12px 18px;border-radius:10px;display:inline-block;font-size:14px;font-weight:600;">
                      View Post
                    </a>
                  </td>
                </tr>
              </table>

              <p class="muted" style="margin:0;font-size:12px;line-height:1.6;color:#64748b;">
                If the button doesn’t work, copy and paste this link into your browser:<br/>
                <a href="" style="color:#2563eb;word-break:break-all;text-decoration:none;"></a>
              </p>
            </td>
          </tr>

          <tr>
            <td style="padding:20px 28px;border-top:1px solid #e5e7eb;">
              <p class="muted" style="margin:0;font-size:12px;color:#94a3b8;">
                You’re receiving this because you have notifications enabled in Intiqali. 
                <a href="{{PREFERENCES_URL}}" style="color:#2563eb;text-decoration:none;">Manage preferences</a>.
              </p>
            </td>
          </tr>
        </table>

        <p style="margin:16px 0 0;font-size:12px;color:#94a3b8;font-family:Arial,Helvetica,sans-serif;">
          © ${new Date().getFullYear()} Intiqali. All rights reserved.
        </p>
      </td>
    </tr>
  </table>
</body>
</html>
        `
    }


    try {
        const postId = req.params.id
        const userId = req.user._id
        //check if post existed
        const post = await Post.findById(postId)
        if(!post){
            return res.status(400).json({message:"Post not found"})
        }

        //CHECK IF USER ALREADY LIKED

        const isLiked = await Likes.findOne({post:postId,user:userId})
        if(isLiked){
            return res.status(400).json({message:"You already liked this post"})
        }else{
            //Like
            const newLike = new Likes({post:postId,user:userId})
            await newLike.save()
            //increment likes on post
            await Post.findByIdAndUpdate(postId,{$inc:{likesCount:1}})
            if(post.createdBy.toString() !== userId.toString()){
                await transporter.sendMail(mailOptions)
            }
            res.status(200).json({message:"Post liked successfuly"})
        }
    } catch (error) {
        console.log(error);
            
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
    }
}


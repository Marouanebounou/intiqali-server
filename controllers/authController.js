import User from "../models/User.js"
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import nodemailer from 'nodemailer'
import crypto from 'crypto'
import Post from "../models/Post.js"
import Comment from "../models/Comments.js"
import Like from "../models/Likes.js"


export const Login = async (req,res) =>{
    try {
        const {email,password} = req.body
        const isEmailExist = await User.findOne({email});
        if(!isEmailExist){
            res.status(400).json({message:"Something went wrong"});
        }else{
            const ispasswordCorrect= await bcrypt.compare(password,isEmailExist.password);
            if(!ispasswordCorrect){
                res.status(400).json({message:"Something went wrong"});
            }else{
                const token = jwt.sign({id:isEmailExist._id , email:isEmailExist.email ,role:isEmailExist.role, firstName:isEmailExist.firstName , lastName:isEmailExist.lastName} ,process.env.JWT_SECRET_KEY,{expiresIn:"7d"})
                res.status(200).json({message:"Login successful" , token});
            }
        }
    } catch (error) {
        console.log(error);
    }
}
export const SignUp = async (req,res) =>{
    try {
        const {firstName,lastName,email,phone,password,sexe} = req.body;
        const isistenUser = await User.findOne({email});
        const isNumberExist = await User.findOne({phone});
        if(isistenUser){
            res.status(400).json({message:"Email already exist"});
        }else if(isNumberExist){
            res.status(400).json({message:"Phone number already exist"});
        }
        else{
            const hashedPassword =  await bcrypt.hash(password , 10);
            const verificationToken = crypto.randomBytes(32).toString('hex');
            const user = new User({
                firstName,
                lastName,
                email,
                phone,
                sexe,
                password:hashedPassword,
                verificationToken
            })
            const transporter = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                  user: process.env.EMAIL,
                  pass: process.env.PASSWORD
                }
            })

            const verificationUrl = `http://localhost:3000/verify/${verificationToken}`

            transporter.sendMail({
                from: process.env.EMAIL,
                to: email,
                subject: 'Welcome to intiqali',
                html: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Verify Your Email</title>
</head>
<body style="margin:0; padding:0; font-family: Arial, sans-serif; background-color: #f4f4f4;">
  <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #f4f4f4; padding: 20px 0;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" border="0" style="background-color: #ffffff; border-radius: 8px; overflow: hidden;">
          <tr>
            <td style="background-color: #1800ad; padding: 20px; text-align: center; color: #ffffff;">
              <h1 style="margin: 0; font-size: 24px;">Welcome to Intiqali!</h1>
            </td>
          </tr>
          <tr>
            <td style="padding: 30px; color: #333333; font-size: 16px; line-height: 1.5;">
              <p>Hello <strong>${firstName}</strong>,</p>
              <p>Thank you for signing up! To get started, please verify your email address by clicking the button below.</p>
              <p style="text-align: center; margin: 30px 0;">
                <a href="${verificationUrl}" 
                   style="background-color: #1800ad; color: #ffffff; text-decoration: none; padding: 12px 24px; border-radius: 5px; display: inline-block; font-weight: bold;">
                  Verify Email
                </a>
              </p>
              <p>If you did not create an account, you can safely ignore this email.</p>
              <p>Cheers,<br><strong>The Intiqali Team</strong></p>
            </td>
          </tr>
          <tr>
            <td style="background-color: #f4f4f4; padding: 20px; text-align: center; color: #999999; font-size: 12px;">
              &copy; 2025 Intiqali. All rights reserved.
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`
            })

            await user.save();
            res.status(200).json({message:"User created successfully"});
        }

    } catch (error) {
        console.log(error);  
    }

}

export const verifyEmail = async (req, res) => {
  try {
    const { token } = req.query;

    const user = await User.findOne({ verificationToken: token });
    if (!user) return res.status(400).json({ message: "Invalid token" });

    user.isVerified = true;
    user.verificationToken = null;
    await user.save();

    res.status(200).json({ message: "Email successfully verified!" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Something went wrong" });
  }
};

export const deleteUser = async(req , res)=>{
    try {
      
        const userId = req.user._id
        await Post.deleteMany({createdBy:userId})
        await Comment.deleteMany({createdBy:userId})
        await Like.deleteMany({createdBy:userId})
        const user = await User.findByIdAndDelete(userId);
        if(!user){
            return res.status(400).json({message:"User not found"})
        }
        res.status(200).json({message:"User deleted successfuly"})
    } catch (error) {
        console.log(error);
    }
}

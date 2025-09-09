import User from "../models/User.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";
import crypto from "crypto";
import Post from "../models/Post.js";
import Comment from "../models/Comments.js";
import Like from "../models/Likes.js";
import { log } from "console";

export const Login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const isEmailExist = await User.findOne({ email });
    if (!isEmailExist) {
      res.status(400).json({ message: "Something went wrong" });
    } else {
      const ispasswordCorrect = await bcrypt.compare(
        password,
        isEmailExist.password
      );
      if (!ispasswordCorrect) {
        res.status(400).json({ message: "Something went wrong" });
      } else {
        const token = jwt.sign(
          {
            id: isEmailExist._id,
            firstName: isEmailExist.firstName,
            lastName: isEmailExist.lastName,
            email: isEmailExist.email,
            phone: isEmailExist.phone,
            sexe: isEmailExist.sexe,
            adress: isEmailExist.adress,
            ministère: isEmailExist.ministère,
            département: isEmailExist.département,
            fonction: isEmailExist.fonction,
            grade: isEmailExist.grade,
            echelle: isEmailExist.echelle,
            ville: isEmailExist.ville,
            etablissement: isEmailExist.etablissement,
            role: isEmailExist.role,
            isVerified: isEmailExist.isVerified,
            verificationToken: isEmailExist.verificationToken,
            birthDate: isEmailExist.birthDate,
            birthplace: isEmailExist.birthplace,
            active: isEmailExist.active,
            profileImage: isEmailExist.profileImage,
            coverImage: isEmailExist.coverImage,
            bio: isEmailExist.bio,
          },
          process.env.JWT_SECRET_KEY,
          { expiresIn: "7d" }
        );
        res.status(200).json({ message: "Login successful", token });
      }
    }
  } catch (error) {
    console.log(error);
  }
};
export const SignUp = async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      email,
      phone,
      password,
      sexe,
      adress,
      birthDate,
      birthplace,
      ministère,
      département,
      fonction,
      grade,
      echelle,
      ville,
      etablissement,
    } = req.body;
    const isistenUser = await User.findOne({ email });
    if (isistenUser) {
      res.status(400).json({ message: "Email already exist" });
    } else {
      const hashedPassword = await bcrypt.hash(password, 10);
      const verificationTokenId = crypto.randomBytes(32).toString("hex");
      const user = new User({
        firstName,
        lastName,
        email,
        sexe,
        phone,
        adress,
        birthDate,
        birthplace,
        ministère,
        etablissement,
        département,
        fonction,
        grade,
        echelle,
        ville,
        verificationToken: verificationTokenId,
        password: hashedPassword,
      });

      await user.save();
      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: process.env.EMAIL,
          pass: process.env.PASSWORD,
        },
      });

      const verificationUrl = `${process.env.CLIENT_URL}verify/${verificationTokenId}`;

      transporter.sendMail({
        from: process.env.EMAIL,
        to: email,
        subject: "Welcome to intiqali",
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
`,
      });

      res.status(200).json({ message: "User created successfully" });
    }
  } catch (error) {
    console.log(error);
  }
};
export const getUser = async (req, res) => {
  try {
    const userId = req.params.id;
    console.log(userId);

    const user = await User.findById(userId).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json(user);
  } catch (error) {
    console.log(error);
  }
};

export const verifyEmail = async (req, res) => {
  try {
    const { token } = req.params;

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

export const deleteUser = async (req, res) => {
  try {
    const userId = req.params.id;
    await Post.deleteMany({ createdBy: userId });
    await Comment.deleteMany({ createdBy: userId });
    await Like.deleteMany({ createdBy: userId });
    const user = await User.findByIdAndDelete(userId);
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }
    res.status(200).json({ message: "User deleted successfuly" });
  } catch (error) {
    console.log(error);
  }
};


export const editUser = async(req,res)=>{
  
try {
  
  const user =  await User.findById(req.params.id)
  const userId = user._id
  const userPosts = await Post.find({createdBy : userId})
  const email = req.params.email
  const isEmailExist = await User.findOne({email})

  const {firstName,lastName} = req.body
  if(!user){
    return res.status(400).json({message:"User not found"})
  }else{
    user.firstName = firstName
    user.lastName = lastName
    userPosts.forEach(async(post)=>{
      post.postUser = `${firstName} ${lastName}`
      await post.save()
    })
    await user.save()
    const token = jwt.sign(
          {
            id: isEmailExist._id,
            firstName: isEmailExist.firstName,
            lastName: isEmailExist.lastName,
            email: isEmailExist.email,
            phone: isEmailExist.phone,
            sexe: isEmailExist.sexe,
            adress: isEmailExist.adress,
            ministère: isEmailExist.ministère,
            département: isEmailExist.département,
            fonction: isEmailExist.fonction,
            grade: isEmailExist.grade,
            echelle: isEmailExist.echelle,
            ville: isEmailExist.ville,
            etablissement: isEmailExist.etablissement,
            role: isEmailExist.role,
            isVerified: isEmailExist.isVerified,
            verificationToken: isEmailExist.verificationToken,
            birthDate: isEmailExist.birthDate,
            birthplace: isEmailExist.birthplace,
            active: isEmailExist.active,
            profileImage: isEmailExist.profileImage,
            coverImage: isEmailExist.coverImage,
            bio: isEmailExist.bio,
          },
          process.env.JWT_SECRET_KEY,
          { expiresIn: "7d" }
        );
    res.status(200).json({message:"User edited successfuly" , token});
  }

} catch (error) {
  console.log(error);
}
}

export const editPassword =async (req,res)=>{
  try {
    const userId = req.params.id
    const user = await User.findById(userId)
    const oldPassword = req.body.oldPassword
    const newPassword = req.body.newPassword
    const client = process.env.CLIENT_URL
    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: process.env.EMAIL,
          pass: process.env.PASSWORD,
        },
      });
    if(!user){
      return res.status(400).json({message:"User not found"})
    }
    const isMatched = await bcrypt.compare(oldPassword, user.password)
    if(!isMatched){
      return res.status(400).json({message:"Old password is incorrect"})
    }
    const hashedPassword = await bcrypt.hash(newPassword, 10)
    user.password = hashedPassword
    await user.save()
    transporter.sendMail({
        from: process.env.EMAIL,
        to: user.email,
        subject: "Password Changed Successfully",
        html:`
          <!-- Password Changed Email Template (use in transactional email, inline CSS for max compatibility) -->
<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <title>Password Changed — Notification Email</title>
  <style>
    /* Most email clients ignore external CSS; keep styles minimal and inline where possible. */
    body { background-color:#f3f4f6; margin:0; padding:24px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; }
    .container { max-width:600px; margin:0 auto; }
    .card { background:#ffffff; border-radius:8px; padding:28px; box-shadow:0 6px 18px rgba(16,24,40,0.06); }
    h1 { font-size:20px; margin:0 0 8px; color:#0f172a; }
    p { color:#334155; line-height:1.5; font-size:15px; margin:12px 0; }
    .muted { color:#64748b; font-size:13px; }
    .button { display:inline-block; background:#0b74ff; color:#fff; text-decoration:none; padding:10px 16px; border-radius:6px; font-weight:600; }
    .footer { text-align:center; color:#94a3b8; font-size:12px; margin-top:18px; }
    .meta { background:#f8fafc; border-radius:6px; padding:12px; margin-top:14px; font-size:13px; color:#475569; }
    @media (max-width:480px) { .card { padding:18px; } }
  </style>
</head>
<body>
  <div class="container">
    <div class="card" role="article" aria-label="Password changed notification">
      <h1>Password changed successfully</h1>
      <p class="muted">Hi ${user.firstName},</p>
      <p>We wanted to let you know that your account password was changed. If you made this change, no further action is needed.</p>
      <p>If you did not change your password, please secure your account immediately by resetting your password and reviewing recent activity.</p>
      <p class="muted">If you have any questions, reply to this email or visit our help center.</p>

      <div class="footer">&copy; 2025 Intiqali • All rights reserved</div>
    </div>
  </div>
</body>
</html>

        `
      })
    res.status(200).json({message:"Password edited successfuly"})
    
  } catch (error) {
    console.log(error);
  }
}
import User from "../models/User.js";
import cloudinary from "../config/cloudinary.js";
import fs from "fs";

export const finishprofile = async(req,res)=>{
    try {
        const {adress , birthdate , birthplace} = req.body
        const user = await User.findById(req.params.id);
        user.birthDate = birthdate
        user.birthplace = birthplace
        user.adress = adress
        await user.save()
        res.status(200).json({message:"Profile completed succesfuly"})
    } catch (error) {
        console.log(error);
    }
}

export const setProfile = async (req, res) => {
  try {
    const userId = req.params.id;
    const user = await User.findById(userId);
    if (!user) {
      console.log("User not found for ID:", userId);
      return res.status(404).json({ message: "User not found" });
    }
    let imageUrl = null;
    
    if (req.files && req.files.length > 0) {
      const file = req.files[0]; 
      console.log("Processing file upload:", file.originalname);
      
      try {
        const result = await cloudinary.uploader.upload(file.path, {
          folder: "profiles",
        });
        imageUrl = result.secure_url;
        
        fs.unlinkSync(file.path);
        console.log("File cleaned up successfully");
      } catch (uploadError) {
        console.error("Cloudinary upload error:", uploadError);
        if (file && file.path) {
          fs.unlinkSync(file.path);
        }
        return res.status(500).json({ message: "Failed to upload image", error: uploadError.message });
      }
    } else {
      console.log("No files uploaded");
    }

    // Update user profile image
    user.profileImage = imageUrl;
    await user.save();
    return res.status(200).json({
      message: "Profile image updated successfully",
      profileImage: imageUrl,
    });
  } catch (error) {
    console.error("Error in setProfile:", error);
    
    // Clean up uploaded files if they exist
    if (req.files && req.files.length > 0) {
      req.files.forEach(file => {
        try {
          if (file && file.path) {
            fs.unlinkSync(file.path);
          }
        } catch (cleanupError) {
          console.error("Error cleaning up file:", cleanupError);
        }
      });
    }
    
    return res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const finishProffetionel = async(req , res )=>{
    try {
        const {ministère , département , fonction , grade , echelle , ville , etablissement} = req.body
        const user = await User.findById(req.params.id);
        user.ministère = ministère
        user.département = département
        user.fonction = fonction
        user.grade = grade
        user.echelle = echelle
        user.ville = ville
        user.etablissement = etablissement
        await user.save()
        res.status(200).json({message:"Profetionell fileds completed succesfuly"})
    } catch (error) {
        console.log(error);         
    }
}
export const setCover = async (req, res) => {
  try {
    const userId = req.params.id;

    // Find user first
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    let imageUrl = "https://res.cloudinary.com/dx6x9d8p2/image/upload/v1756154031/default_image_ypatak.png";
    
    // Handle files from flexibleUpload (req.files array)
    if (req.files && req.files.length > 0) {
      const file = req.files[0];
      console.log("Processing cover image upload:", file.originalname);
      
      try {
        const result = await cloudinary.uploader.upload(file.path, {
          folder: "covers",
        });
        imageUrl = result.secure_url;
        console.log("Cover image uploaded successfully:", imageUrl);
        
        // Clean up uploaded file
        fs.unlinkSync(file.path);
        console.log("Cover file cleaned up successfully");
      } catch (uploadError) {
        console.error("Cloudinary upload error:", uploadError);
        // Clean up uploaded file even if upload fails
        if (file && file.path) {
          fs.unlinkSync(file.path);
        }
        return res.status(500).json({ message: "Failed to upload cover image", error: uploadError.message });
      }
    } else {
      console.log("No cover image uploaded, using default");
    }

    // Save updated cover
    user.coverImage = imageUrl;
    await user.save();

    return res.status(200).json({
      message: "Cover image updated successfully",
      coverImage: imageUrl,
    });
  } catch (error) {
    console.error("Error in setCover:", error);
    
    // Clean up uploaded files if they exist
    if (req.files && req.files.length > 0) {
      req.files.forEach(file => {
        try {
          if (file && file.path) {
            fs.unlinkSync(file.path);
          }
        } catch (cleanupError) {
          console.error("Error cleaning up cover file:", cleanupError);
        }
      });
    }
    
    return res.status(500).json({ message: "Server error", error: error.message });
  }
};



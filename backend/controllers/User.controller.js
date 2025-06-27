
import { request, response } from "express";
import User from "../models/User.models.js";
import { generateToken } from "../libs/utils.js";
import dotenv from "dotenv"
import cloudinary from "../libs/cloudinary.js";
dotenv.config();

export const authGoogle = async(req , res) => {
  const { name, email, photoURL } = req.body;
 
  try {
    // Check if the user already exists
    let user = await User.findOne({ email });
    
    if (!user) {
      // If user doesn't exist, create a new one
      user = new User({
        username: name,
        email: email,
        photoURL: photoURL,
      });
      await user.save();
    }
     //generatewebtoken
     generateToken(user._id, res);

    ;
     res.status(200).json({ msg: "User logged in", user });

  } catch (error) {
    console.error("Google Auth Error:", error.message);
    res.status(500).json({ msg: 'Error saving user', error: error.message });
}
}

export const logout = (req, res) => {
  try {
    res.cookie("jwt", "", { maxAge: 0 });
    res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    console.log("Error in logout controller", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// import cloudinary from '../utils/cloudinary.js'; // your cloudinary setup
// import User from '../models/User.js'; // your User model

export const updateProfile = async (req, res) => {
  try {
    const { position, company, bio, phone } = req.body;
    const userId = req.user._id;

    if (!req.file) {
      return res.status(400).json({ message: "Profile pic is required" });
    }

    // Upload file buffer to Cloudinary
    const uploadResponse = await cloudinary.uploader.upload_stream(
      { folder: 'profile_pics' },
      async (error, result) => {
        if (error) {
          console.error("Cloudinary upload error:", error);
          return res.status(500).json({ message: "Cloudinary error" });
        }

        const updatedUser = await User.findByIdAndUpdate(
          userId,
          {
            photoURL: result.secure_url,
            position,
            company,
            bio,
            phone
          },
          { new: true }
        );

        res.status(200).json(updatedUser);
      }
    );

    // Pipe the file buffer into the uploader
    uploadResponse.end(req.file.buffer);
  } catch (error) {
    console.log("error in update profile:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};


import { config } from "dotenv";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import fs from "fs";
import { v2 as cloudinary } from "cloudinary";
import configureCloudinary from "../config/cloudinary.js";

import User from "../models/User.js";
import Post from "../models/Post.js";

config();
configureCloudinary();
const secret = process.env.SECRET_TOKEN;

export const register = async (req, res) => {
  const { email, password, firstName, lastName } = req.body;
  try {
    const user = await User.create({
      email,
      password: bcrypt.hashSync(password, bcrypt.genSaltSync(10)),
      firstName,
      lastName,
    });
    res.json(user);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Something went wrong !" });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json("Email not found!");
    }
    const isSuccess = bcrypt.compareSync(password, user.password);
    if (!isSuccess) {
      return res.status(400).json("Password is error!");
    }
    jwt.sign(
      {
        email: user.email,
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        imageUrl: user.imageUrl,
      },
      secret,
      { expiresIn: "1d" },
      (err, token) => {
        if (err) throw err;
        res.cookie("token", token, { maxAge: 24 * 60 * 60 * 1000 }).json({
          id: user._id,
          email,
          firstName: user.firstName,
          lastName: user.lastName,
          imageUrl: user.imageUrl,
        });
      }
    );
  } catch (err) {
    console.error(err);
    res.status(500).json("Server is error!");
  }
};

export const logout = async (req, res) => {
  res.cookie("token", "").json("Logout success!");
};

export const getProfile = async (req, res) => {
  if (!req.cookies) {
    return res.status(400).send({ message: "No cookies provided" });
  }

  const { token } = req.cookies;
  if (!token) {
    return res.status(400).send({ message: "No token provided" });
  }

  jwt.verify(token, secret, {}, async (err, info) => {
    if (err) throw err;
    try {
      const user = await User.findById(info.id).select("-password");
      if (!user) {
        return res.status(404).send({ message: "User not found" });
      }
      res.send(user);
    } catch (error) {
      res.status(500).send({ message: error.message });
    }
  });
};


export const getProfileById = async (req, res) => {
  try {
    const { userId } = req.params;
    const posts = await Post.find({ author: userId });
    res.json(posts);
  } catch (error) {
    console.log(err);
    res.status(500).json({ message: "Server error !" });
  }
};

export const getMemberById = async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await User.findById(userId);
    const posts = await Post.find({ author: userId });
    res.json({
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      imageUrl: user.imageUrl,
      posts: posts,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error !" });
  }
};

export const user = async (req, res) => {
  const token = req.cookies.token;
  if (!token) {
    return res.status(401).json("No token provided");
  }

  jwt.verify(token, secret, (err, decoded) => {
    if (err) {
      return res.status(500).json("Failed to authenticate token");
    }

    res.json({
      id: decoded.id,
      email: decoded.email,
      firstName: decoded.firstName,
      lastName: decoded.lastName,
      imageUrl: decoded.imageUrl,
    });
  });
};

export const updateProfileById = async (req, res) => {
  try {
    const { userId } = req.params;
    const { email, password, firstName, lastName } = req.body;
    const { token } = req.cookies;

    jwt.verify(token, secret, async (err, decoded) => {
      if (err) {
        return res.status(403).json({ message: "Invalid token" });
      }

      if (decoded.id !== userId) {
        return res.status(403).json({ message: "Unauthorized" });
      }

      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      if (email) user.email = email;
      if (password) user.password = password;
      if (firstName) user.firstName = firstName;
      if (lastName) user.lastName = lastName;

      if (req.file) {
        let result;
        try {
          result = await cloudinary.uploader.upload(req.file.path);
          fs.unlinkSync(req.file.path);
          user.imageUrl = result.secure_url;
        } catch (error) {
          console.error("Error uploading to Cloudinary", error);
          return res.status(500).json({ message: "Error uploading to Cloudinary" });
        }
      }

      await user.save();
      const updatedToken = jwt.sign({ id: user._id }, secret);
      res.cookie("token", updatedToken, { httpOnly: true });
      res.json(user);
    });
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
};

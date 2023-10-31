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

export const createPost = async (req, res) => {
  try {
    // Upload image to Cloudinary
    let result;
    try {
      result = await cloudinary.uploader.upload(req.file.path);
    } catch (error) {
      console.error("Error uploading to Cloudinary", error);
      return res.status(500).json({ message: "Error uploading to Cloudinary" });
    }

    fs.unlinkSync(req.file.path); // Delete file after upload

    const { token } = req.cookies;

    if (!token) {
      res.status(401).json({ error: "No token provided" });
    } else {
      jwt.verify(token, secret, {}, async (err, info) => {
        if (err) throw err;
        const { title, description, content } = req.body;
        const newPost = await Post.create({
          title,
          description,
          content,
          image: result.secure_url, // Use the URL provided by Cloudinary
          author: info.id,
        });
        res.json(newPost);
      });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Something went wrong in /post route!" });
  }
};

export const getAllPosts = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const elementPage = 10;

  const totalPosts = await Post.countDocuments();
  const totalPages = Math.ceil(totalPosts / elementPage);

  const posts = await Post.find()
    .populate("author", ["email", "firstName", "lastName", "imageUrl"])
    .sort({ createdAt: -1 })
    .skip((page - 1) * elementPage)
    .limit(elementPage);

  res.json({
    totalPages: totalPages,
    currentPage: page,
    posts: posts,
  });
};

export const getPost = async (req, res) => {
  const { id } = req.params;
  try {
    const post = await Post.findById(id).populate("author", ["email", "firstName", "lastName", "imageUrl"]);
    res.json(post);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "An error occurred while retrieving the post." });
  }
};

export const updatePost = async (req, res) => {
  try {
    const { title, description, content } = req.body;
    const { id } = req.params;

    const post = await Post.findById(id);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    const { token } = req.cookies;
    if (!token) {
      return res.status(401).json({ error: "No token provided" });
    }

    jwt.verify(token, secret, {}, async (err, info) => {
      if (err) throw err;

      let imageUrl = post.image;
      if (req.file) {
        let result;
        try {
          result = await cloudinary.uploader.upload(req.file.path);
          imageUrl = result.secure_url;
        } catch (error) {
          console.error("Error uploading to Cloudinary", error);
          return res.status(500).json({ message: "Error uploading to Cloudinary" });
        }
        fs.unlinkSync(req.file.path);
      }

      const updatedPost = await Post.findByIdAndUpdate(
        id,
        {
          title: title !== "" ? title : post.title,
          description: description !== "" ? description : post.description,
          content: content !== "" ? content : post.content,
          image: imageUrl,
        },
        { new: true }
      );

      res.json(updatedPost);
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Something went wrong in /update route!" });
  }
};

export const deletePost = async (req, res) => {
  try {
    const { id } = req.params;

    const { token } = req.cookies;
    if (!token) {
      return res.status(401).json({ error: "No token provided" });
    }

    jwt.verify(token, secret, {}, async (err, info) => {
      if (err) throw err;

      const post = await Post.findById(id);
      if (!post) {
        return res.status(404).json({ message: "Post not found" });
      }

      if (post.author.toString() !== info.id) {
        return res.status(403).json({ error: "You are not authorized to delete this post" });
      }

      await Post.findByIdAndDelete(id);

      res.json({ message: "Post deleted successfully" });
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Something went wrong in /delete route!" });
  }
};

export const searchPost = async (req, res) => {
  const { query } = req.query;

  if (query) {
    const users = await User.find({
      $or: [{ firstName: new RegExp(query, "i") }, { lastName: new RegExp(query, "i") }],
    });

    const postsFromTitle = await Post.find({ title: new RegExp(query, "i") });
    const postsFromAuthor = await Post.find({ author: { $in: users.map(user => user._id) } });

    const posts = [...postsFromTitle, ...postsFromAuthor];
    return res.json(posts);
  }

  res.status(400).json({ error: "Invalid query parameters." });
};

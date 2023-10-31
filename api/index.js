import express from "express";
import { config } from "dotenv";
import cors from "cors";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import cookieParser from "cookie-parser";
import fs from "fs";

import { v2 as cloudinary } from "cloudinary";
import connect from "./config/db.js";
import configureCloudinary from './config/cloudinary.js'
import uploadMiddleware from './config/multer.js'

import User from "./models/User.js";
import Post from "./models/Post.js";

config();
const app = express();
app.use(express.json());
app.use(cookieParser());
connect();

// Set up CORS options
const corsOptions = {
  origin: `${process.env.URL_CLIENT}`,
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  credentials: true,
  allowedHeaders: ["Content-Type", "Authorization"],
};

app.use(cors(corsOptions));
configureCloudinary();

const port = process.env.PORT || 3000;
const secret = process.env.SECRET_TOKEN;

app.listen(port, () => {
  console.log(`Server listing in port ${port}`);
});

app.get("/", (request, response) => {
  response.status(200).json("Hello World");
});


app.post("/register", async (req, res) => {
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
});

app.post("/login", async (req, res) => {
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
});

app.get("/profile", async (req, res) => {
  const { token } = req.cookies;
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
});

app.post("/logout", (req, res) => {
  res.cookie("token", "").json("ok");
});

app.get("/user", (req, res) => {
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
});

//BLOG

app.post("/post", uploadMiddleware.single("image"), async (req, res) => {
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
});

app.get("/posts", async (req, res) => {
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
});

app.get("/post/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const post = await Post.findById(id).populate("author", ["email", "firstName", "lastName", "imageUrl"]);
    res.json(post);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "An error occurred while retrieving the post." });
  }
});

app.get("/profile/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    const posts = await Post.find({ author: userId });
    res.json(posts);
  } catch (error) {
    console.log(err);
    res.status(500).json({ message: "Server error !" });
  }
});

app.get("/member/:userId", async (req, res) => {
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
});

app.put("/profile/:userId", uploadMiddleware.single("image"), async (req, res) => {
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
});

app.put("/post/:id", uploadMiddleware.single("image"), async (req, res) => {
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
});

app.delete("/post/:id", async (req, res) => {
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
});

app.get("/post", async (req, res) => {
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
});

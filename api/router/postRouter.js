import express from "express";
import uploadMiddleware from "../config/multer.js";

import { createPost, getAllPosts, getPost, updatePost, deletePost, searchPost } from "../controllers/postController.js";

const router = express.Router();

router.post("/post", uploadMiddleware.single("image"), createPost);
router.get("/posts", getAllPosts);
router.get("/post/:id", getPost);
router.put("/post/:id", uploadMiddleware.single("image"), updatePost);
router.delete("/post/:id", deletePost);
router.get("/post", searchPost);

export default router;

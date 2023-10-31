import express from "express";
import uploadMiddleware from "../config/multer.js";

import {
  login,
  logout,
  register,
  getProfile,
  getProfileById,
  getMemberById,
  updateProfileById,
} from "../controllers/userController.js";

const router = express.Router();

router.post("/login", login);
router.post("/logout", logout);
router.post("/register", register);
router.get("/profile", getProfile);
router.get("/profile/:userId", getProfileById);
router.get("/member/:userId", getMemberById);
router.put("/profile/:userId", uploadMiddleware.single("image"), updateProfileById);

export default router;

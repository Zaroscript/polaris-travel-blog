import express from "express";
const router = express.Router();

import {
  getAllUsers,
  getUserById,
  updateProfile,
  toggleFollow,
  getUserPosts,
  getSavedPosts,
  } from "../controllers/user.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";


// Profile routes
router.get("/all", getAllUsers);
router.get("/:id", getUserById);
router.put("/:id", protectRoute, updateProfile);

// Follow routes
router.post("/follow/:id", protectRoute, toggleFollow);

// Posts routes
router.get("/posts", protectRoute, getUserPosts);
router.get("/posts/:id", getUserPosts);
router.get("/saved-posts", protectRoute, getSavedPosts);

export default router;

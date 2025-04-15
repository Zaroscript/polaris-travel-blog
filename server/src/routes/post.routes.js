import express from "express";
const router = express.Router();
import { protectRoute } from "../middleware/auth.middleware.js";

import {
  createPost,
  getAllPosts,
  getPostById,
  updatePost,
  deletePost,
  getAllPostsByUser,
  getPostsByDestination,
  getPostsByTags,
} from "../controllers/post.controller.js";

// Define routes with enhanced error handling and validation
router.post("/", protectRoute, createPost);
router.get("/", getAllPosts);
router.get("/:id", getPostById);
router.put("/:id", protectRoute, updatePost);
router.delete("/:id", protectRoute, deletePost);
router.get("/user/:userId", getAllPostsByUser);
router.get("/destination/:destination", getPostsByDestination);
router.get("/tags/:tags", getPostsByTags);

// Middleware to log requests
router.use((req, res, next) => {
  console.log(`Request Method: ${req.method}, Request URL: ${req.originalUrl}`);
  next();
});

// Middleware to handle 404 errors
router.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

// Middleware to handle general errors
router.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Internal Server Error" });
});

export default router;

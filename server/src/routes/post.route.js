import express from "express";
import {
  createPost,
  getPosts,
  getPost,
  updatePost,
  deletePost,
  toggleLike,
  toggleSavePost,
  addComment,
  deleteComment,
} from "../controllers/post.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";

const router = express.Router();

// Post CRUD routes
router.post("/", protectRoute, createPost);
router.get("/", getPosts);
router.get("/:id", getPost);
router.put("/:id", protectRoute, updatePost);
router.delete("/:id", protectRoute, deletePost);

// Post interaction routes
router.post("/:id/like", protectRoute, toggleLike);
router.post("/:id/save", protectRoute, toggleSavePost);

// Comment routes
router.post("/:id/comments", protectRoute, addComment);
router.delete("/:postId/comments/:commentId", protectRoute, deleteComment);

export default router;

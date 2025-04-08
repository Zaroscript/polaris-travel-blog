import express from "express";
import {
  getPosts,
  getPost,
  createPost,
  updatePost,
  deletePost,
  likePost,
  unlikePost,
  addComment,
  likeComment,
  unlikeComment,
  deleteComment,
  addReply,
  likeReply,
  unlikeReply,
  deleteReply,
  toggleSavePost,
} from "../controllers/post.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";

const router = express.Router();

// Public routes
router.get("/", getPosts);
router.get("/:id", getPost);

// Protected routes
router.post("/", protectRoute, createPost);
router.put("/:id", protectRoute, updatePost);
router.delete("/:id", protectRoute, deletePost);
router.post("/:id/toggle-save", protectRoute, toggleSavePost);

// Like/Unlike routes
router.post("/:id/like", protectRoute, likePost);
router.delete("/:id/like", protectRoute, unlikePost);

// Comment routes
router.post("/:id/comments", protectRoute, addComment);
router.post("/:id/comments/:commentId/like", protectRoute, likeComment);
router.delete("/:id/comments/:commentId/like", protectRoute, unlikeComment);
router.delete("/:id/comments/:commentId", protectRoute, deleteComment);

// Reply routes
router.post("/:id/comments/:commentId/replies", protectRoute, addReply);
router.post(
  "/:id/comments/:commentId/replies/:replyId/like",
  protectRoute,
  likeReply
);
router.delete(
  "/:id/comments/:commentId/replies/:replyId/like",
  protectRoute,
  unlikeReply
);
router.delete(
  "/:id/comments/:commentId/replies/:replyId",
  protectRoute,
  deleteReply
);

export default router;

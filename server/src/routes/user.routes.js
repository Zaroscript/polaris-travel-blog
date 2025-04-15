import express from "express";
import { getUsers, getUserById, followUser, unfollowUser } from "../controllers/user.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";

const router = express.Router();

// Route to get all users
router.get('/users', protectRoute, getUsers);

// Route to get a user by ID
router.get('/users/:id', protectRoute, getUserById);

// Route to follow a user
router.post('/users/:id/follow', protectRoute, followUser);

// Route to unfollow a user
router.post('/users/:id/unfollow', protectRoute, unfollowUser);

export default router;






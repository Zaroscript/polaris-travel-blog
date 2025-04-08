import express from "express";
const router = express.Router();
import { protectRoute } from "../middleware/auth.middleware.js";
import {
  updateProfile,
  updatePassword,
  updateEmail,
  updatePrivacy,
  updateNotifications,
  deleteAccount,
} from "../controllers/account.controller.js";

// All routes require authentication
router.use(protectRoute);

// Profile routes
router.put("/profile", updateProfile);

// Security routes
router.put("/password", updatePassword);
router.put("/email", updateEmail);

// Privacy routes
router.put("/privacy", updatePrivacy);

// Notification routes
router.put("/notifications", updateNotifications);

// Account management routes
router.delete("/delete", deleteAccount);

export default router;

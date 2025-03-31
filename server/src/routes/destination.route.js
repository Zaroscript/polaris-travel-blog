import express from "express";
import {
  createDestination,
  getDestinations,
  getNearbyDestinations,
  getDestination,
  updateDestination,
  deleteDestination,
  addReview,
  deleteReview,
} from "../controllers/destination.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";

const router = express.Router();

// Destination CRUD routes
router.post("/", protectRoute, createDestination);
router.get("/", getDestinations);
router.get("/nearby", getNearbyDestinations);
router.get("/:id", getDestination);
router.patch("/:id", protectRoute, updateDestination);
router.delete("/:id", protectRoute, deleteDestination);

// Review routes
router.post("/:id/reviews", protectRoute, addReview);
router.delete("/:destinationId/reviews/:reviewId", protectRoute, deleteReview);

export default router;

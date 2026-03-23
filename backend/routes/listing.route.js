import express from "express";
import { 
	createListing, 
	getListings, 
	getListing, 
	updateListing, 
	deleteListing, 
	getUserListings,
	toggleListingAvailability,
	getRecommendations 
} from "../controllers/listing.controller.js";
import { verifyToken } from "../middleware/verifyToken.js";

const router = express.Router();

// Public routes
router.get("/", getListings);
router.get("/recommendations", verifyToken, getRecommendations);
router.get("/:id", getListing);

// Protected routes (require authentication)
router.post("/", verifyToken, createListing);
router.put("/:id", verifyToken, updateListing);
router.delete("/:id", verifyToken, deleteListing);
router.get("/my-listings", verifyToken, getUserListings);
router.put("/:id/toggle-availability", verifyToken, toggleListingAvailability);

export default router;
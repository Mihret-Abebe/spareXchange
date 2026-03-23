import express from "express";
import { 
	createListing, 
	getListings, 
	getListing, 
	updateListing, 
	deleteListing, 
	getUserListings,
	toggleListingAvailability,
	getRecommendations,
	bulkCreateListings,
	renewListing,
	reportListing
} from "../controllers/listing.controller.js";
import { verifyToken } from "../middleware/verifyToken.js";

const router = express.Router();

// Public routes
router.get("/", getListings);
router.get("/recommendations", verifyToken, getRecommendations);
router.get("/:id", getListing);

import { authorize } from "../middleware/authorize.js";

// Protected routes (require authentication)
router.post("/", verifyToken, authorize(["create_listings"]), createListing);
router.post("/bulk", verifyToken, authorize(["create_bulk_listings"]), bulkCreateListings);
router.put("/:id/renew", verifyToken, renewListing);
router.post("/:id/report", verifyToken, reportListing);
router.put("/:id", verifyToken, updateListing); // Owner check is inside controller
router.delete("/:id", verifyToken, deleteListing); // Owner check is inside controller
router.get("/my-listings", verifyToken, getUserListings);
router.put("/:id/toggle-availability", verifyToken, toggleListingAvailability);

export default router;
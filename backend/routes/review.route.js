import express from "express";
import { createReview, getUserReviews } from "../controllers/review.controller.js";
import { verifyToken } from "../middleware/verifyToken.js";

const router = express.Router();

router.post("/", verifyToken, createReview);
router.get("/user/:userId", getUserReviews); 

export default router;

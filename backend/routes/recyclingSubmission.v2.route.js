// Forced update to resolve nodemon caching issues
import express from "express";
import {
	createRecyclingSubmission,
	getUserRecyclingSubmissions,
	getAllRecyclingSubmissions,
	getRecyclingSubmission,
	approveRecyclingSubmission,
	rejectRecyclingSubmission,
	completeRecyclingSubmission,
	verifyRecyclingByToken,
} from "../controllers/recyclingSubmission.controller.js";
import { verifyToken } from "../middleware/verifyToken.js";

const router = express.Router();

// Protected routes (require authentication)
router.get("/", verifyToken, getAllRecyclingSubmissions); // for admin
router.get("/user", verifyToken, getUserRecyclingSubmissions);
router.get("/:id", verifyToken, getRecyclingSubmission);

router.post("/", verifyToken, createRecyclingSubmission);
router.post("/verify-token", verifyToken, verifyRecyclingByToken);
router.post("/:id/approve", verifyToken, approveRecyclingSubmission); // for admin
router.put("/:id/reject", verifyToken, rejectRecyclingSubmission); // for admin
router.put("/:id/complete", verifyToken, completeRecyclingSubmission); // for admin

export default router;
import express from "express";
import { 
	createRecyclingSubmission, 
	getUserRecyclingSubmissions, 
	getAllRecyclingSubmissions,
	getRecyclingSubmission,
	approveRecyclingSubmission,
	rejectRecyclingSubmission,
	completeRecyclingSubmission
} from "../controllers/recyclingSubmission.controller.js";
import { verifyToken } from "../middleware/verifyToken.js";

const router = express.Router();

// Protected routes (require authentication)
router.post("/", verifyToken, createRecyclingSubmission);
router.get("/my-submissions", verifyToken, getUserRecyclingSubmissions);
router.get("/", verifyToken, getAllRecyclingSubmissions); // for admin
router.get("/:id", verifyToken, getRecyclingSubmission);
router.put("/:id/approve", verifyToken, approveRecyclingSubmission); // for admin
router.put("/:id/reject", verifyToken, rejectRecyclingSubmission); // for admin
router.put("/:id/complete", verifyToken, completeRecyclingSubmission); // for admin

export default router;
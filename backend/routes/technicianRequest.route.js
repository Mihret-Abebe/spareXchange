import express from "express";
import { 
	createTechnicianRequest, 
	getUserTechnicianRequests, 
	getAllTechnicianRequests,
	getTechnicianRequest,
	updateTechnicianRequest,
	assignTechnician,
	completeTechnicianRequest,
	cancelTechnicianRequest
} from "../controllers/technicianRequest.controller.js";
import { verifyToken } from "../middleware/verifyToken.js";

const router = express.Router();

// Protected routes (require authentication)
router.post("/", verifyToken, createTechnicianRequest);
router.get("/my-requests", verifyToken, getUserTechnicianRequests);
router.get("/", verifyToken, getAllTechnicianRequests); // for admin/technicians
router.get("/:id", verifyToken, getTechnicianRequest);
router.put("/:id", verifyToken, updateTechnicianRequest);
router.put("/:id/assign", verifyToken, assignTechnician); // for admin/technicians
router.put("/:id/complete", verifyToken, completeTechnicianRequest);
router.put("/:id/cancel", verifyToken, cancelTechnicianRequest);

export default router;
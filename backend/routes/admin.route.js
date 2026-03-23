import express from "express";
import { verifyToken } from "../middleware/verifyToken.js";
import { 
	getAllUsers, 
	toggleUserBan, 
	verifyRoleStatus, 
	getPlatformStats,
	getPendingVerifications
} from "../controllers/admin.controller.js";
import { User } from "../models/user.model.js";

const router = express.Router();

import { isAdmin } from "../middleware/isAdmin.js";

router.get("/stats", verifyToken, isAdmin, getPlatformStats);
router.get("/users", verifyToken, isAdmin, getAllUsers);
router.get("/verifications/pending", verifyToken, isAdmin, getPendingVerifications);
router.post("/users/:id/ban", verifyToken, isAdmin, toggleUserBan);
router.post("/users/:id/verify", verifyToken, isAdmin, verifyRoleStatus);

export default router;

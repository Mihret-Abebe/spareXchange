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

import { authorize } from "../middleware/authorize.js";

router.get("/stats", verifyToken, authorize(["view_stats"]), getPlatformStats);
router.get("/users", verifyToken, authorize(["view_users"]), getAllUsers);
router.get("/verifications/pending", verifyToken, authorize(["verify_roles"]), getPendingVerifications);
router.post("/users/:id/ban", verifyToken, authorize(["ban_users"]), toggleUserBan);
router.post("/users/:id/verify", verifyToken, authorize(["verify_roles"]), verifyRoleStatus);

export default router;

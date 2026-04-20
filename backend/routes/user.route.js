import express from "express";
import { getTechnicians, getTechnicianById, redeemPoints, requestRoleVerification, updateProfile, getLeaderboard } from "../controllers/user.controller.js";
import { verifyToken } from "../middleware/verifyToken.js";
import { upload } from "../middleware/upload.middleware.js";

const router = express.Router();

router.get("/technicians", getTechnicians);
router.get("/technicians/:id", getTechnicianById);
router.post("/redeem-points", verifyToken, redeemPoints);
router.post("/verify-role", verifyToken, upload.array("documents", 5), requestRoleVerification);
router.put("/profile", verifyToken, updateProfile);
router.get("/leaderboard", verifyToken, getLeaderboard);

export default router;

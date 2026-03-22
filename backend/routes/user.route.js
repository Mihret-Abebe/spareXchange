import express from "express";
import { getTechnicians, getTechnicianById, redeemPoints } from "../controllers/user.controller.js";
import { verifyToken } from "../middleware/verifyToken.js";

const router = express.Router();

router.get("/technicians", getTechnicians);
router.get("/technicians/:id", getTechnicianById);
router.post("/redeem-points", verifyToken, redeemPoints);

export default router;

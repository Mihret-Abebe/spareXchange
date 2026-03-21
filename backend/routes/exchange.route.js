import express from "express";
import { proposeExchange, updateExchangeStatus, completeExchange, getUserExchanges } from "../controllers/exchange.controller.js";
import { verifyToken } from "../middleware/verifyToken.js";

const router = express.Router();

router.get("/my-exchanges", verifyToken, getUserExchanges);
router.post("/", verifyToken, proposeExchange);
router.put("/:id/status", verifyToken, updateExchangeStatus);
router.put("/:id/complete", verifyToken, completeExchange);

export default router;

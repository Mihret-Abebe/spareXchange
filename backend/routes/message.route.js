import express from "express";
import { sendMessage, getConversation, getConversationsList, markAsRead } from "../controllers/message.controller.js";
import { verifyToken } from "../middleware/verifyToken.js";

const router = express.Router();

router.get("/conversations", verifyToken, getConversationsList);
router.get("/:userId", verifyToken, getConversation);
router.post("/", verifyToken, sendMessage);
router.put("/read/:senderId", verifyToken, markAsRead);

export default router;

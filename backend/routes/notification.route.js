import express from "express";
import { 
	createNotification,
	getUserNotifications,
	markNotificationAsRead,
	markAllNotificationsAsRead,
	deleteNotification,
	getUnreadNotificationsCount
} from "../controllers/notification.controller.js";
import { verifyToken } from "../middleware/verifyToken.js";

const router = express.Router();

// Protected routes (require authentication)
router.get("/", verifyToken, getUserNotifications);
router.get("/unread-count", verifyToken, getUnreadNotificationsCount);
router.put("/:id/read", verifyToken, markNotificationAsRead);
router.put("/mark-all-read", verifyToken, markAllNotificationsAsRead);
router.delete("/:id", verifyToken, deleteNotification);

// Only admin can create notifications
router.post("/", verifyToken, createNotification); // In a real app, you'd add admin verification middleware

export default router;
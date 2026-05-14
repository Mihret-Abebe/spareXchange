import { create } from "zustand";
import axios from "axios";

const API_URL = import.meta.env.MODE === "development" ? "http://localhost:5000/api/notifications" : "/api/notifications";

axios.defaults.withCredentials = true;

export const useNotificationStore = create((set, get) => ({
	notifications: [],
	unreadCount: 0,
	loading: false,
	error: null,

	getNotifications: async () => {
		set({ loading: true, error: null });
		try {
			const res = await axios.get(`${API_URL}`);
			set({ notifications: res.data.notifications, loading: false });
			return res.data.notifications;
		} catch (error) {
			set({ error: error.response?.data?.message || "Failed to fetch notifications", loading: false });
			throw error;
		}
	},

	getUnreadCount: async () => {
		try {
			const res = await axios.get(`${API_URL}/unread-count`);
			set({ unreadCount: res.data.count });
			return res.data.count;
		} catch (error) {
			console.error("Failed to get unread count:", error);
			throw error;
		}
	},

	markAsRead: async (notificationId) => {
		try {
			await axios.put(`${API_URL}/${notificationId}/read`);
			
			// Update local state
			set(state => ({
				notifications: state.notifications.map(n => 
					n._id === notificationId ? { ...n, isRead: true } : n
				),
				unreadCount: Math.max(0, state.unreadCount - 1)
			}));
		} catch (error) {
			console.error("Failed to mark notification as read:", error);
			throw error;
		}
	},

	markAllAsRead: async () => {
		try {
			await axios.put(`${API_URL}/mark-all-read`);
			
			set(state => ({
				notifications: state.notifications.map(n => ({ ...n, isRead: true })),
				unreadCount: 0
			}));
		} catch (error) {
			console.error("Failed to mark all as read:", error);
			throw error;
		}
	},

	deleteNotification: async (notificationId) => {
		try {
			const currentState = get();
			const notification = currentState.notifications.find(n => n._id === notificationId);
			
			await axios.delete(`${API_URL}/${notificationId}`);
			
			set(state => ({
				notifications: state.notifications.filter(n => n._id !== notificationId),
				unreadCount: notification && !notification.isRead ? state.unreadCount - 1 : state.unreadCount
			}));
		} catch (error) {
			console.error("Failed to delete notification:", error);
			throw error;
		}
	},

	clearError: () => {
		set({ error: null });
	}
}));

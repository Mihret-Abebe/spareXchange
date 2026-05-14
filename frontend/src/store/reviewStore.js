import { create } from "zustand";
import axios from "axios";

const API_URL = import.meta.env.MODE === "development" ? "http://localhost:5000/api/reviews" : "/api/reviews";

axios.defaults.withCredentials = true;

export const useReviewStore = create((set) => ({
	reviews: [],
	loading: false,
	error: null,

	getUserReviews: async (userId) => {
		set({ loading: true, error: null });
		try {
			const res = await axios.get(`${API_URL}/user/${userId}`);
			set({ reviews: res.data.data, loading: false });
			return res.data.data;
		} catch (error) {
			set({ error: error.response?.data?.message || "Failed to fetch reviews", loading: false });
			throw error;
		}
	},

	createReview: async (revieweeId, exchangeId, rating, comment) => {
		set({ loading: true, error: null });
		try {
			const res = await axios.post(`${API_URL}`, { revieweeId, exchangeId, rating, comment });
			set({ loading: false });
			return res.data;
		} catch (error) {
			set({ error: error.response?.data?.message || "Failed to create review", loading: false });
			throw error;
		}
	},

	clearError: () => {
		set({ error: null });
	}
}));

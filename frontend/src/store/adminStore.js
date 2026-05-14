import { create } from "zustand";
import axios from "axios";

const API_URL = import.meta.env.MODE === "development" ? "http://localhost:5000/api/admin" : "/api/admin";

axios.defaults.withCredentials = true;

export const useAdminStore = create((set) => ({
	// State
	comprehensiveStats: null,
	trends: null,
	engagement: null,
	exchangePerformance: null,
	categoryPerformance: null,
	sustainabilityMetrics: null,
	searchAnalytics: null,
	reviewAnalytics: null,
	reports: [],
	reportStats: null,
	selectedReport: null,
	isLoading: false,
	error: null,

	// Comprehensive Stats
	getComprehensiveStats: async () => {
		set({ isLoading: true, error: null });
		try {
			const response = await axios.get(`${API_URL}/analytics/comprehensive`);
			set({ comprehensiveStats: response.data.stats, isLoading: false });
			return response.data;
		} catch (error) {
			set({ error: error.response?.data?.message || "Error fetching comprehensive stats", isLoading: false });
			throw error;
		}
	},

	// Time-Series Analytics
	getTimeSeriesTrends: async (period = "daily", days = 30) => {
		set({ isLoading: true, error: null });
		try {
			const response = await axios.get(`${API_URL}/analytics/trends`, {
				params: { period, days }
			});
			set({ trends: response.data.trends, isLoading: false });
			return response.data;
		} catch (error) {
			set({ error: error.response?.data?.message || "Error fetching trends", isLoading: false });
			throw error;
		}
	},

	// User Engagement Metrics
	getUserEngagement: async () => {
		set({ isLoading: true, error: null });
		try {
			const response = await axios.get(`${API_URL}/analytics/engagement`);
			set({ engagement: response.data.engagement, isLoading: false });
			return response.data;
		} catch (error) {
			set({ error: error.response?.data?.message || "Error fetching engagement metrics", isLoading: false });
			throw error;
		}
	},

	// Exchange Performance
	getExchangePerformance: async () => {
		set({ isLoading: true, error: null });
		try {
			const response = await axios.get(`${API_URL}/analytics/exchanges`);
			set({ exchangePerformance: response.data.performance, isLoading: false });
			return response.data;
		} catch (error) {
			set({ error: error.response?.data?.message || "Error fetching exchange performance", isLoading: false });
			throw error;
		}
	},

	// Category Performance
	getCategoryPerformance: async () => {
		set({ isLoading: true, error: null });
		try {
			const response = await axios.get(`${API_URL}/analytics/categories`);
			set({ categoryPerformance: response.data.categoryPerformance, isLoading: false });
			return response.data;
		} catch (error) {
			set({ error: error.response?.data?.message || "Error fetching category performance", isLoading: false });
			throw error;
		}
	},

	// Sustainability Metrics
	getSustainabilityMetrics: async () => {
		set({ isLoading: true, error: null });
		try {
			const response = await axios.get(`${API_URL}/analytics/sustainability`);
			set({ sustainabilityMetrics: response.data.sustainability, isLoading: false });
			return response.data;
		} catch (error) {
			set({ error: error.response?.data?.message || "Error fetching sustainability metrics", isLoading: false });
			throw error;
		}
	},

	// Search Analytics
	getSearchAnalytics: async (days = 30) => {
		set({ isLoading: true, error: null });
		try {
			const response = await axios.get(`${API_URL}/analytics/searches`, {
				params: { days }
			});
			set({ searchAnalytics: response.data.searchAnalytics, isLoading: false });
			return response.data;
		} catch (error) {
			set({ error: error.response?.data?.message || "Error fetching search analytics", isLoading: false });
			throw error;
		}
	},

	// Review Analytics
	getReviewAnalytics: async () => {
		set({ isLoading: true, error: null });
		try {
			const response = await axios.get(`${API_URL}/analytics/reviews`);
			set({ reviewAnalytics: response.data.reviewAnalytics, isLoading: false });
			return response.data;
		} catch (error) {
			set({ error: error.response?.data?.message || "Error fetching review analytics", isLoading: false });
			throw error;
		}
	},

	// Reports Management
	getReports: async (filters = {}) => {
		set({ isLoading: true, error: null });
		try {
			const response = await axios.get(`${API_URL}/reports`, { params: filters });
			set({ 
				reports: response.data.reports,
				reportsPagination: {
					count: response.data.count,
					totalReports: response.data.totalReports,
					page: response.data.page,
					totalPages: response.data.totalPages
				},
				isLoading: false 
			});
			return response.data;
		} catch (error) {
			set({ error: error.response?.data?.message || "Error fetching reports", isLoading: false });
			throw error;
		}
	},

	getReportById: async (reportId) => {
		set({ isLoading: true, error: null });
		try {
			const response = await axios.get(`${API_URL}/reports/${reportId}`);
			set({ selectedReport: response.data.report, isLoading: false });
			return response.data;
		} catch (error) {
			set({ error: error.response?.data?.message || "Error fetching report", isLoading: false });
			throw error;
		}
	},

	getReportStats: async () => {
		set({ isLoading: true, error: null });
		try {
			const response = await axios.get(`${API_URL}/reports/stats`);
			set({ reportStats: response.data.stats, isLoading: false });
			return response.data;
		} catch (error) {
			set({ error: error.response?.data?.message || "Error fetching report stats", isLoading: false });
			throw error;
		}
	},

	updateReportStatus: async (reportId, updateData) => {
		set({ isLoading: true, error: null });
		try {
			const response = await axios.put(`${API_URL}/reports/${reportId}`, updateData);
			set({ isLoading: false });
			return response.data;
		} catch (error) {
			set({ error: error.response?.data?.message || "Error updating report", isLoading: false });
			throw error;
		}
	},

	deleteReport: async (reportId) => {
		set({ isLoading: true, error: null });
		try {
			const response = await axios.delete(`${API_URL}/reports/${reportId}`);
			set({ isLoading: false });
			return response.data;
		} catch (error) {
			set({ error: error.response?.data?.message || "Error deleting report", isLoading: false });
			throw error;
		}
	},

	// Admin Jobs
	runSavedSearchAlertsJob: async (options = {}) => {
		set({ isLoading: true, error: null });
		try {
			const response = await axios.post(`${API_URL}/jobs/saved-search-alerts`, options);
			set({ isLoading: false });
			return response.data;
		} catch (error) {
			set({ error: error.response?.data?.message || "Error running job", isLoading: false });
			throw error;
		}
	},

	// Clear state
	clearSelectedReport: () => {
		set({ selectedReport: null });
	},

	clearError: () => {
		set({ error: null });
	}
}));

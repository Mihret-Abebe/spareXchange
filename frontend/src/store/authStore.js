import { create } from "zustand";
import axios from "axios";

const API_URL = import.meta.env.MODE === "development" ? "http://localhost:5000/api/auth" : "/api/auth";

axios.defaults.withCredentials = true;

// Axios interceptor for automatic token refresh
axios.interceptors.response.use(
	(response) => response,
	async (error) => {
		if (error.response?.status === 401 && !error.config._retry) {
			error.config._retry = true;
			try {
				await useAuthStore.getState().refreshToken();
				return axios(error.config);
			} catch (refreshError) {
				return Promise.reject(refreshError);
			}
		}
		return Promise.reject(error);
	}
);

export const useAuthStore = create((set) => ({
	user: null,
	isAuthenticated: false,
	error: null,
	isLoading: false,
	isCheckingAuth: true,
	message: null,
	mfaRequired: false,
	mfaEmail: null,

	signup: async (email, password, name, accountType = "user") => {
		set({ isLoading: true, error: null });
		try {
			const response = await axios.post(`${API_URL}/signup`, { email, password, name, userType: accountType });
			set({ user: response.data.user, isAuthenticated: true, isLoading: false });
		} catch (error) {
			set({ error: error.response?.data?.message || "Error signing up", isLoading: false });
			throw error;
		}
	},
	login: async (email, password) => {
		set({ isLoading: true, error: null });
		try {
			const response = await axios.post(`${API_URL}/login`, { email, password });
			if (response.data.mfaRequired) {
				set({
					mfaRequired: true,
					mfaEmail: response.data.email,
					isLoading: false,
				});
			} else {
				set({
					isAuthenticated: true,
					user: response.data.user,
					error: null,
					isLoading: false,
				});
			}
		} catch (error) {
			set({ error: error.response?.data?.message || "Error logging in", isLoading: false });
			throw error;
		}
	},

	logout: async () => {
		set({ isLoading: true, error: null });
		try {
			await axios.post(`${API_URL}/logout`);
			set({ user: null, isAuthenticated: false, error: null, isLoading: false });
		} catch (error) {
			set({ error: "Error logging out", isLoading: false });
			throw error;
		}
	},
	verifyEmail: async (code) => {
		set({ isLoading: true, error: null });
		try {
			const response = await axios.post(`${API_URL}/verify-email`, { code });
			set({ user: response.data.user, isAuthenticated: true, isLoading: false });
			return response.data;
		} catch (error) {
			set({ error: error.response.data.message || "Error verifying email", isLoading: false });
			throw error;
		}
	},
	checkAuth: async () => {
		set({ isCheckingAuth: true, error: null });
		try {
			const response = await axios.get(`${API_URL}/check-auth`);
			set({ user: response.data.user, isAuthenticated: true, isCheckingAuth: false });
		} catch (error) {
			set({ error: null, isCheckingAuth: false, isAuthenticated: false });
		}
	},
	forgotPassword: async (email) => {
		set({ isLoading: true, error: null });
		try {
			const response = await axios.post(`${API_URL}/forgot-password`, { email });
			set({ message: response.data.message, isLoading: false });
		} catch (error) {
			set({
				isLoading: false,
				error: error.response.data.message || "Error sending reset password email",
			});
			throw error;
		}
	},
	resetPassword: async (token, password) => {
		set({ isLoading: true, error: null });
		try {
			const response = await axios.post(`${API_URL}/reset-password/${token}`, { password });
			set({ message: response.data.message, isLoading: false });
		} catch (error) {
			set({
				isLoading: false,
				error: error.response.data.message || "Error resetting password",
			});
			throw error;
		}
	},
	requestVerification: async (userType, expertise, documents) => {
		set({ isLoading: true, error: null });
		try {
			const response = await axios.post(`${API_URL}/request-verification`, { userType, expertise, documents });
			set({ user: response.data.user, isLoading: false, message: response.data.message });
		} catch (error) {
			set({ error: error.response?.data?.message || "Error requesting verification", isLoading: false });
			throw error;
		}
	},

	resendVerificationEmail: async () => {
		set({ isLoading: true, error: null });
		try {
			await axios.post(`${API_URL}/resend-verification`);
			set({ isLoading: false });
		} catch (error) {
			set({ error: error.response?.data?.message || "Error resending verification email", isLoading: false });
			throw error;
		}
	},
	redeemPoints: async (points, rewardDescription) => {
		set({ isLoading: true, error: null });
		try {
			const response = await axios.post(`${import.meta.env.MODE === "development" ? "http://localhost:5000/api/users" : "/api/users"}/redeem-points`, { points, rewardDescription });
			set({
				user: { ...useAuthStore.getState().user, ecoPoints: response.data.currentPoints },
				isLoading: false,
				message: response.data.message
			});
		} catch (error) {
			set({ error: error.response?.data?.message || "Error redeeming points", isLoading: false });
			throw error;
		}
	},

	setupMFA: async () => {
		set({ isLoading: true, error: null });
		try {
			const response = await axios.post(`${API_URL}/mfa/setup`);
			set({ isLoading: false });
			return response.data;
		} catch (error) {
			set({ error: error.response?.data?.message || "Error setting up MFA", isLoading: false });
			throw error;
		}
	},

	verifyMFA: async (code) => {
		set({ isLoading: true, error: null });
		try {
			const response = await axios.post(`${API_URL}/mfa/verify`, { code });
			set({ user: { ...useAuthStore.getState().user, isMfaEnabled: true }, isLoading: false });
			return response.data;
		} catch (error) {
			set({ error: error.response?.data?.message || "Error verifying MFA", isLoading: false });
			throw error;
		}
	},

	validateMFALogin: async (email, code) => {
		set({ isLoading: true, error: null });
		try {
			const response = await axios.post(`${API_URL}/mfa/validate`, { email, code });
			set({
				isAuthenticated: true,
				user: response.data.user,
				mfaRequired: false,
				mfaEmail: null,
				isLoading: false,
			});
		} catch (error) {
			set({ error: error.response?.data?.message || "Error validating MFA", isLoading: false });
			throw error;
		}
	},

	refreshToken: async () => {
		try {
			const response = await axios.get(`${API_URL}/refresh-token`);
			set({ user: response.data.user, isAuthenticated: true, error: null });
			return response.data;
		} catch (error) {
			set({ isAuthenticated: false, user: null });
			throw error;
		}
	},

	googleLogin: async (credential) => {
		set({ isLoading: true, error: null });
		try {
			const response = await axios.post(`${API_URL}/oauth/google`, { credential });
			set({
				isAuthenticated: true,
				user: response.data.user,
				isLoading: false,
			});
		} catch (error) {
			set({ error: error.response?.data?.message || "Error logging in with Google", isLoading: false });
			throw error;
		}
	},

	updateProfile: async (profileData) => {
		set({ isLoading: true, error: null });
		try {
			const API_URL_USERS = import.meta.env.MODE === "development" ? "http://localhost:5000/api/users" : "/api/users";
			
			// Check if profileData is FormData (for file uploads) or regular object
			const isFormData = profileData instanceof FormData;
			
			const response = await axios.put(
				`${API_URL_USERS}/profile`, 
				profileData,
				{
					headers: isFormData ? {
						'Content-Type': 'multipart/form-data',
					} : {
						'Content-Type': 'application/json',
					}
				}
			);
			set({ 
				user: response.data.user, 
				isLoading: false,
				message: response.data.message 
			});
			return response.data;
		} catch (error) {
			set({ error: error.response?.data?.message || "Error updating profile", isLoading: false });
			throw error;
		}
	},

	requestVerificationWithFiles: async (userType, files) => {
		set({ isLoading: true, error: null });
		try {
			const API_URL_USERS = import.meta.env.MODE === "development" ? "http://localhost:5000/api/users" : "/api/users";
			const formData = new FormData();
			formData.append('requestedType', userType);
			
			// Append all files
			if (files && files.length > 0) {
				Array.from(files).forEach(file => {
					formData.append('documents', file);
				});
			}

			const response = await axios.post(`${API_URL_USERS}/verify-role`, formData, {
				headers: {
					'Content-Type': 'multipart/form-data',
				},
			});
			
			set({ 
				user: { 
					...useAuthStore.getState().user, 
					userType: userType,
					roleStatus: 'pending' 
				}, 
				isLoading: false, 
				message: response.data.message 
			});
			return response.data;
		} catch (error) {
			set({ error: error.response?.data?.message || "Error requesting verification", isLoading: false });
			throw error;
		}
	},

	// Module 4: Recycling Submission Functions
	createRecyclingSubmission: async (submissionData) => {
		set({ isLoading: true, error: null });
		try {
			const API_URL_RECYCLING = import.meta.env.MODE === "development" 
				? "http://localhost:5000/api/recycling-submissions" 
				: "/api/recycling-submissions";
			
			const response = await axios.post(API_URL_RECYCLING, submissionData);
			set({ isLoading: false, message: response.data.message });
			return response.data;
		} catch (error) {
			set({ error: error.response?.data?.message || "Error creating recycling submission", isLoading: false });
			throw error;
		}
	},

	getUserRecyclingSubmissions: async () => {
		set({ isLoading: true, error: null });
		try {
			const API_URL_RECYCLING = import.meta.env.MODE === "development" 
				? "http://localhost:5000/api/recycling-submissions" 
				: "/api/recycling-submissions";
			
			const response = await axios.get(`${API_URL_RECYCLING}/user`);
			set({ isLoading: false });
			return response.data;
		} catch (error) {
			set({ error: error.response?.data?.message || "Error fetching submissions", isLoading: false });
			throw error;
		}
	},

	verifyRecyclingByToken: async (token) => {
		set({ isLoading: true, error: null });
		try {
			const API_URL_RECYCLING = import.meta.env.MODE === "development" 
				? "http://localhost:5000/api/recycling-submissions" 
				: "/api/recycling-submissions";
			
			const response = await axios.post(`${API_URL_RECYCLING}/verify-token`, { token });
			set({ isLoading: false, message: response.data.message });
			return response.data;
		} catch (error) {
			set({ error: error.response?.data?.message || "Error verifying recycling", isLoading: false });
			throw error;
		}
	},

	getNearbyRecyclers: async (latitude, longitude, radius = 50) => {
		set({ isLoading: true, error: null });
		try {
			const API_URL_RECYCLING = import.meta.env.MODE === "development" 
				? "http://localhost:5000/api/recycling-submissions" 
				: "/api/recycling-submissions";
			
			const response = await axios.get(`${API_URL_RECYCLING}/discovery`, {
				params: { latitude, longitude, radius }
			});
			set({ isLoading: false });
			return response.data;
		} catch (error) {
			set({ error: error.response?.data?.message || "Error fetching nearby recyclers", isLoading: false });
			throw error;
		}
	},
}));

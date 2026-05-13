import { Navigate, Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar";

import SignUpPage from "./pages/SignUpPage";
import LoginPage from "./pages/LoginPage";
import EmailVerificationPage from "./pages/EmailVerificationPage";
import MFASetupPage from "./pages/MFASetupPage";
import MFAVerificationPage from "./pages/MFAVerificationPage";
import DashboardPage from "./pages/DashboardPage";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import ResetPasswordPage from "./pages/ResetPasswordPage";
import LandingPage from "./pages/LandingPage";
import MarketplacePage from "./pages/MarketplacePage";
import ListingDetailPage from "./pages/ListingDetailPage";
import ProfilePage from "./pages/ProfilePage";
import EditProfilePage from "./pages/EditProfilePage";
import AboutPage from "./pages/AboutPage";
import FaqPage from "./pages/FaqPage";
import ContactPage from "./pages/ContactPage";
import Leaderboard from "./pages/LeaderboardPage";
import CreateListingPage from "./pages/CreateListingPage";
import MyListingsPage from "./pages/MyListingsPage";
import EditListingPage from "./pages/EditListingPage";
import BulkUploadPage from "./pages/BulkUploadPage";
import AnalyticsPage from "./pages/AnalyticsPage";
import MyExchangesPage from "./pages/MyExchangesPage";
import ExchangeDetailPage from "./pages/ExchangeDetailPage";

import LoadingSpinner from "./components/LoadingSpinner";

import { Toaster } from "react-hot-toast";
import { useAuthStore } from "./store/authStore";
import { useEffect } from "react";

// protect routes that require authentication
const ProtectedRoute = ({ children }) => {
	const { isAuthenticated, user } = useAuthStore();

	if (!isAuthenticated) {
		return <Navigate to='/login' replace />;
	}

	if (!user.isVerified) {
		return <Navigate to='/verify-email' replace />;
	}

	return children;
};

// redirect authenticated users to the marketplace
const RedirectAuthenticatedUser = ({ children }) => {
	const { isAuthenticated, user } = useAuthStore();

	if (isAuthenticated && user.isVerified) {
		return <Navigate to='/marketplace' replace />;
	}

	return children;
};

// protect routes that require admin privileges
const AdminRoute = ({ children }) => {
	const { isAuthenticated, user } = useAuthStore();

	if (!isAuthenticated) return <Navigate to='/login' replace />;
	if (user.userType !== "admin") return <Navigate to='/dashboard' replace />;

	return children;
};

function App() {
	const { isCheckingAuth, checkAuth } = useAuthStore();

	useEffect(() => {
		checkAuth();
	}, [checkAuth]);

	if (isCheckingAuth) return <LoadingSpinner />;

	return (
		<div className='min-h-screen flex flex-col bg-background text-foreground transition-colors duration-300 dark:bg-gradient-to-r from-gray-900 via-green-900 to-emerald-900'>
			<Navbar />
			<Toaster />
			<Routes>
				<Route path='/' element={<LandingPage />} />
				<Route
					path='/marketplace'
					element={
						<ProtectedRoute>
							<>
								<MarketplacePage />
							</>
						</ProtectedRoute>
					}
				/>
				<Route
					path='/listing/:id'
					element={
						<ProtectedRoute>
							<>
								<ListingDetailPage />
							</>
						</ProtectedRoute>
					}
				/>
				<Route
					path='/profile'
					element={
						<ProtectedRoute>
							<>
								<ProfilePage />
							</>
						</ProtectedRoute>
					}
				/>
				<Route
					path='/edit-profile'
					element={
						<ProtectedRoute>
							<EditProfilePage />
						</ProtectedRoute>
					}
				/>
				<Route
					path='/dashboard'
					element={
						<ProtectedRoute>
							<DashboardPage />
						</ProtectedRoute>
					}
				/>
				<Route
					path='/leaderboard'
					element={
						<ProtectedRoute>
							<Leaderboard />
						</ProtectedRoute>
					}
				/>
				<Route
					path='/create-listing'
					element={
						<ProtectedRoute>
							<CreateListingPage />
						</ProtectedRoute>
					}
				/>
				<Route
					path='/my-listings'
					element={
						<ProtectedRoute>
							<MyListingsPage />
						</ProtectedRoute>
					}
				/>
				<Route
					path='/edit-listing/:id'
					element={
						<ProtectedRoute>
							<EditListingPage />
						</ProtectedRoute>
					}
				/>
				<Route
					path='/bulk-upload'
					element={
						<ProtectedRoute>
							<BulkUploadPage />
						</ProtectedRoute>
					}
				/>
				<Route
					path='/analytics'
					element={
						<ProtectedRoute>
							<AnalyticsPage />
						</ProtectedRoute>
					}
				/>
				<Route
					path='/my-exchanges'
					element={
						<ProtectedRoute>
							<MyExchangesPage />
						</ProtectedRoute>
					}
				/>
				<Route
					path='/exchange/:id'
					element={
						<ProtectedRoute>
							<ExchangeDetailPage />
						</ProtectedRoute>
					}
				/>
				<Route
					path='/signup'
					element={
						<RedirectAuthenticatedUser>
							<SignUpPage />
						</RedirectAuthenticatedUser>
					}
				/>
				<Route
					path='/login'
					element={
						<RedirectAuthenticatedUser>
							<LoginPage />
						</RedirectAuthenticatedUser>
					}
				/>
				<Route path='/verify-email' element={<EmailVerificationPage />} />
				<Route
					path='/mfa/setup'
					element={
						<ProtectedRoute>
							<MFASetupPage />
						</ProtectedRoute>
					}
				/>
				<Route path='/mfa/verify' element={<MFAVerificationPage />} />
				<Route
					path='/forgot-password'
					element={
						<RedirectAuthenticatedUser>
							<ForgotPasswordPage />
						</RedirectAuthenticatedUser>
					}
				/>

				<Route
					path='/reset-password/:token'
					element={
						<RedirectAuthenticatedUser>
							<ResetPasswordPage />
						</RedirectAuthenticatedUser>
					}
				/>
				<Route path='/about' element={<><AboutPage /></>} />
				<Route path='/faq' element={<><FaqPage /></>} />
				<Route path='/contact' element={<><ContactPage /></>} />
				<Route
					path='/admin/disputes'
					element={
						<AdminRoute>
							<DashboardPage /> {/* Using Dashboard as placeholder or create specialized components */}
						</AdminRoute>
					}
				/>
				<Route
					path='/admin/users'
					element={
						<AdminRoute>
							<DashboardPage />
						</AdminRoute>
					}
				/>
				{/* catch all routes */}
				<Route path='*' element={<Navigate to='/' replace />} />
			</Routes>
		</div>
	);
}

export default App;

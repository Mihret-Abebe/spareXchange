import { motion } from "framer-motion";
import { useAuthStore } from "../store/authStore";
import { formatDate } from "../utils/date";
import { useNavigate, Link } from "react-router-dom";
import TierBadge from "../components/TierBadge";
import { Trophy } from "lucide-react";

const DashboardPage = () => {
	const { user, logout } = useAuthStore();
	const navigate = useNavigate();

	const handleLogout = async () => {
		await logout();
		navigate("/");
	};
	return (
		<motion.div
			initial={{ opacity: 0, scale: 0.9 }}
			animate={{ opacity: 1, scale: 1 }}
			exit={{ opacity: 0, scale: 0.9 }}
			transition={{ duration: 0.5 }}
			className='max-w-md w-full mx-auto mt-10 p-8 bg-gray-900 bg-opacity-80 backdrop-filter backdrop-blur-lg rounded-xl shadow-2xl border border-gray-800'
		>
			<h2 className='text-3xl font-bold mb-6 text-center bg-gradient-to-r from-green-400 to-emerald-600 text-transparent bg-clip-text'>
				Dashboard
			</h2>

			<div className='space-y-6'>
				<motion.div
					className='p-4 bg-gray-800 bg-opacity-50 rounded-lg border border-gray-700'
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ delay: 0.2 }}
				>
					<h3 className='text-xl font-semibold text-green-400 mb-3'>Profile Information</h3>
					<p className='text-gray-300'>Name: {user.name}</p>
					<p className='text-gray-300'>Email: {user.email}</p>
				</motion.div>
				<motion.div
					className='p-4 bg-gray-800 bg-opacity-50 rounded-lg border border-gray-700'
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ delay: 0.4 }}
				>
					<h3 className='text-xl font-semibold text-green-400 mb-3'>Account Activity</h3>
					<p className='text-gray-300'>
						<span className='font-bold'>Joined: </span>
						{new Date(user.createdAt).toLocaleDateString("en-US", {
							year: "numeric",
							month: "long",
							day: "numeric",
						})}
					</p>
					<p className='text-gray-300'>
						<span className='font-bold'>Last Login: </span>

						{formatDate(user.lastLogin)}
					</p>
				</motion.div>

				<motion.div
					className='p-4 bg-gray-800 bg-opacity-50 rounded-lg border border-gray-700'
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ delay: 0.5 }}
				>
					<div className='flex items-center justify-between mb-4'>
						<h3 className='text-xl font-semibold text-green-400'>Eco Status</h3>
						<TierBadge tier={user.ecoTier} />
					</div>
					
					<div className='space-y-4'>
						<div className='flex justify-between items-end'>
							<span className='text-gray-400 text-sm'>Total Eco Points</span>
							<span className='text-2xl font-bold text-white'>{user.ecoPoints || 0}</span>
						</div>

						{/* Progress Bar */}
						<div className='space-y-1'>
							<div className='h-2 w-full bg-gray-700 rounded-full overflow-hidden'>
								<motion.div 
									initial={{ width: 0 }}
									animate={{ 
										width: `${Math.min(100, ((user.ecoPoints || 0) / (
											user.ecoTier === "Seed" ? 100 :
											user.ecoTier === "Sprout" ? 500 :
											user.ecoTier === "Sapling" ? 1500 :
											user.ecoTier === "Oak" ? 5000 : 10000
										)) * 100)}%` 
									}}
									className='h-full bg-gradient-to-r from-green-400 to-emerald-600'
								/>
							</div>
							<div className='flex justify-between text-[10px] uppercase tracking-tighter text-gray-500 font-bold'>
								<span>Current: {user.ecoTier}</span>
								<span>Next Tier: {
									user.ecoTier === "Seed" ? "Sprout" :
									user.ecoTier === "Sprout" ? "Sapling" :
									user.ecoTier === "Sapling" ? "Oak" :
									user.ecoTier === "Oak" ? "Gaia" : "Maxed Out"
								}</span>
							</div>
						</div>

						<Link 
							to='/leaderboard' 
							className='flex items-center justify-center gap-2 w-full py-2 bg-gray-700 bg-opacity-50 hover:bg-opacity-80 rounded-lg text-sm text-gray-300 transition duration-200'
						>
							<Trophy className='size-4 text-yellow-500' />
							View Global Leaderboard
						</Link>
					</div>
				</motion.div>

				{user.userType === "admin" && (
					<motion.div
						className='p-4 bg-gray-800 bg-opacity-50 rounded-lg border border-gray-700'
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ delay: 0.5 }}
					>
						<h3 className='text-xl font-semibold text-red-400 mb-3'>Admin Control Panel</h3>
						<div className='space-y-3'>
							<Link to="/admin/disputes" className='block w-full text-center py-2 bg-gray-700 rounded hover:bg-gray-600 transition'>
								Manage Disputes
							</Link>
							<Link to="/admin/users" className='block w-full text-center py-2 bg-gray-700 rounded hover:bg-gray-600 transition'>
								Verify Users & Technicians
							</Link>
						</div>
					</motion.div>
				)}
			</div>

			<motion.div
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ delay: 0.6 }}
				className='mt-4'
			>
				<motion.button
					whileHover={{ scale: 1.05 }}
					whileTap={{ scale: 0.95 }}
					onClick={handleLogout}
					className='w-full py-3 px-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white 
				font-bold rounded-lg shadow-lg hover:from-green-600 hover:to-emerald-700
				 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:ring-offset-gray-900'
				>
					Logout
				</motion.button>
			</motion.div>
		</motion.div>
	);
};
export default DashboardPage;

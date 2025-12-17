import { useState } from "react";
import { motion } from "framer-motion";
import { User, Mail, MapPin, Phone, Edit3, Star, Package, CreditCard, Settings, LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";

const ProfilePage = () => {
	const navigate = useNavigate();
	const [activeTab, setActiveTab] = useState("profile");

	// Mock user data
	const user = {
		name: "Abeselom Tsegazeab",
		email: "abeselom@example.com",
		location: "Adama, Ethiopia",
		phone: "+251 912 345 678",
		memberSince: "January 2024",
		ecoPoints: 1250,
		listings: 24,
		rating: 4.8,
		reviews: 42,
	};

	// Mock listings data
	const listings = [
		{
			id: 1,
			title: "Car Engine Block - Toyota Camry 2015",
			price: 450,
			status: "Active",
			views: 124,
			interested: 8,
		},
		{
			id: 2,
			title: "Laptop Battery - Dell Inspiron 15",
			price: 85,
			status: "Sold",
			views: 89,
			interested: 5,
		},
		{
			id: 3,
			title: "Motorcycle Carburetor - Honda CB125",
			price: 120,
			status: "Active",
			views: 67,
			interested: 3,
		},
	];

	const handleLogout = () => {
		// Logout functionality would go here
		navigate("/login");
	};

	const tabs = [
		{ id: "profile", name: "Profile", icon: User },
		{ id: "listings", name: "My Listings", icon: Package },
		{ id: "payments", name: "Payments", icon: CreditCard },
		{ id: "settings", name: "Settings", icon: Settings },
	];

	return (
		<div className='min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white'>
			<div className='container mx-auto px-4 py-8'>
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.5 }}
				>
					{/* Profile Header */}
					<div className='bg-gray-800 rounded-xl p-6 mb-8 border border-gray-700'>
						<div className='flex flex-col md:flex-row items-center md:items-start'>
							<div className='w-24 h-24 rounded-full bg-gradient-to-r from-green-500 to-emerald-600 flex items-center justify-center mb-4 md:mb-0 md:mr-6'>
								<span className='text-3xl font-bold text-white'>{user.name.charAt(0)}</span>
							</div>
							<div className='flex-1 text-center md:text-left'>
								<h1 className='text-3xl font-bold mb-2'>{user.name}</h1>
								<div className='flex flex-wrap justify-center md:justify-start gap-4 mb-4'>
									<div className='flex items-center text-gray-300'>
										<Mail size={16} className='mr-2' />
										<span>{user.email}</span>
									</div>
									<div className='flex items-center text-gray-300'>
										<MapPin size={16} className='mr-2' />
										<span>{user.location}</span>
									</div>
								</div>
								<div className='flex flex-wrap justify-center md:justify-start gap-6 mb-4'>
									<div className='text-center'>
										<div className='text-2xl font-bold text-green-400'>{user.ecoPoints}</div>
										<div className='text-sm text-gray-400'>Eco Points</div>
									</div>
									<div className='text-center'>
										<div className='text-2xl font-bold'>{user.listings}</div>
										<div className='text-sm text-gray-400'>Listings</div>
									</div>
									<div className='text-center'>
										<div className='flex items-center justify-center'>
											<Star size={16} className='text-yellow-400 fill-current mr-1' />
											<span className='text-2xl font-bold'>{user.rating}</span>
										</div>
										<div className='text-sm text-gray-400'>{user.reviews} Reviews</div>
									</div>
								</div>
								<div className='text-sm text-gray-400'>
									Member since {user.memberSince}
								</div>
							</div>
							<div className='mt-4 md:mt-0'>
								<button className='flex items-center px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition duration-300'>
									<Edit3 size={16} className='mr-2' />
									Edit Profile
								</button>
							</div>
						</div>
					</div>

					{/* Tabs */}
					<div className='flex flex-wrap gap-2 mb-8 border-b border-gray-700'>
						{tabs.map((tab) => (
							<button
								key={tab.id}
								onClick={() => setActiveTab(tab.id)}
								className={`flex items-center px-4 py-2 rounded-t-lg transition duration-300 ${
									activeTab === tab.id
										? "bg-gray-800 text-green-400 border-b-2 border-green-400"
										: "text-gray-400 hover:text-white"
								}`}
							>
								<tab.icon size={16} className='mr-2' />
								{tab.name}
							</button>
						))}
						<button
							onClick={handleLogout}
							className='flex items-center px-4 py-2 rounded-t-lg text-gray-400 hover:text-red-400 transition duration-300 ml-auto'
						>
							<LogOut size={16} className='mr-2' />
							Logout
						</button>
					</div>

					{/* Tab Content */}
					{activeTab === "profile" && (
						<motion.div
							initial={{ opacity: 0 }}
							animate={{ opacity: 1 }}
							className='bg-gray-800 rounded-xl p-6 border border-gray-700'
						>
							<h2 className='text-2xl font-bold mb-6'>Personal Information</h2>
							<div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
								<div>
									<h3 className='text-lg font-bold mb-4'>Contact Details</h3>
									<div className='space-y-4'>
										<div>
											<label className='block text-sm text-gray-400 mb-1'>Full Name</label>
											<div className='px-4 py-2 bg-gray-700 rounded-lg'>{user.name}</div>
										</div>
										<div>
											<label className='block text-sm text-gray-400 mb-1'>Email Address</label>
											<div className='px-4 py-2 bg-gray-700 rounded-lg'>{user.email}</div>
										</div>
										<div>
											<label className='block text-sm text-gray-400 mb-1'>Phone Number</label>
											<div className='px-4 py-2 bg-gray-700 rounded-lg'>{user.phone}</div>
										</div>
										<div>
											<label className='block text-sm text-gray-400 mb-1'>Location</label>
											<div className='px-4 py-2 bg-gray-700 rounded-lg'>{user.location}</div>
										</div>
									</div>
								</div>
								<div>
									<h3 className='text-lg font-bold mb-4'>Eco Achievements</h3>
									<div className='bg-gray-700 rounded-lg p-4 mb-4'>
										<div className='flex justify-between items-center mb-2'>
											<span className='text-gray-300'>Total Eco Points</span>
											<span className='text-2xl font-bold text-green-400'>{user.ecoPoints}</span>
										</div>
										<div className='w-full bg-gray-600 rounded-full h-2'>
											<div 
												className='bg-green-500 h-2 rounded-full' 
												style={{ width: `${Math.min(100, (user.ecoPoints / 2000) * 100)}%` }}
											></div>
										</div>
										<div className='text-sm text-gray-400 mt-2'>
											{2000 - user.ecoPoints} points to reach next level
										</div>
									</div>
									<div className='grid grid-cols-2 gap-4'>
										<div className='bg-gray-700 rounded-lg p-4 text-center'>
											<div className='text-2xl font-bold text-green-400'>{user.listings}</div>
											<div className='text-sm text-gray-400'>Items Listed</div>
										</div>
										<div className='bg-gray-700 rounded-lg p-4 text-center'>
											<div className='text-2xl font-bold text-green-400'>12</div>
											<div className='text-sm text-gray-400'>Items Recycled</div>
										</div>
									</div>
								</div>
							</div>
						</motion.div>
					)}

					{activeTab === "listings" && (
						<motion.div
							initial={{ opacity: 0 }}
							animate={{ opacity: 1 }}
						>
							<div className='flex justify-between items-center mb-6'>
								<h2 className='text-2xl font-bold'>My Listings</h2>
								<button className='px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold rounded-lg hover:from-green-600 hover:to-emerald-700 transition duration-300'>
									+ Add New Listing
								</button>
							</div>
							<div className='bg-gray-800 rounded-xl border border-gray-700 overflow-hidden'>
								<table className='w-full'>
									<thead className='bg-gray-700'>
										<tr>
											<th className='text-left p-4'>Item</th>
											<th className='text-left p-4'>Price</th>
											<th className='text-left p-4'>Status</th>
											<th className='text-left p-4'>Views</th>
											<th className='text-left p-4'>Interested</th>
											<th className='text-left p-4'>Actions</th>
										</tr>
									</thead>
									<tbody>
										{listings.map((listing) => (
											<tr key={listing.id} className='border-b border-gray-700 hover:bg-gray-750'>
												<td className='p-4'>
													<div className='font-medium'>{listing.title}</div>
												</td>
												<td className='p-4'>${listing.price}</td>
												<td className='p-4'>
													<span className={`px-2 py-1 rounded-full text-xs font-bold ${
														listing.status === "Active" 
															? "bg-green-900 text-green-300" 
															: "bg-gray-700 text-gray-300"
													}`}>
														{listing.status}
													</span>
												</td>
												<td className='p-4'>{listing.views}</td>
												<td className='p-4'>{listing.interested}</td>
												<td className='p-4'>
													<button className='text-green-400 hover:text-green-300 mr-3'>
														Edit
													</button>
													<button className='text-red-400 hover:text-red-300'>
														Delete
													</button>
												</td>
											</tr>
										))}
									</tbody>
								</table>
							</div>
						</motion.div>
					)}

					{activeTab === "payments" && (
						<motion.div
							initial={{ opacity: 0 }}
							animate={{ opacity: 1 }}
							className='bg-gray-800 rounded-xl p-6 border border-gray-700'
						>
							<h2 className='text-2xl font-bold mb-6'>Payment History</h2>
							<div className='text-center py-12'>
								<CreditCard size={48} className='mx-auto text-gray-500 mb-4' />
								<h3 className='text-xl font-bold mb-2'>No payment history yet</h3>
								<p className='text-gray-400 mb-4'>Your transactions will appear here once you start buying or selling</p>
								<Link 
									to='/marketplace' 
									className='px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold rounded-lg hover:from-green-600 hover:to-emerald-700 transition duration-300'
								>
									Start Shopping
								</Link>
							</div>
						</motion.div>
					)}

					{activeTab === "settings" && (
						<motion.div
							initial={{ opacity: 0 }}
							animate={{ opacity: 1 }}
							className='bg-gray-800 rounded-xl p-6 border border-gray-700'
						>
							<h2 className='text-2xl font-bold mb-6'>Account Settings</h2>
							<div className='space-y-6'>
								<div>
									<h3 className='text-lg font-bold mb-4'>Notification Preferences</h3>
									<div className='space-y-3'>
										{[
											"Messages from buyers",
											"Messages from sellers",
											"New listings in my categories",
											"Eco points updates",
											"Platform announcements"
										].map((item, index) => (
											<div key={index} className='flex items-center justify-between p-3 bg-gray-700 rounded-lg'>
												<span>{item}</span>
												<label className='switch'>
													<input type='checkbox' defaultChecked />
													<span className='slider round'></span>
												</label>
											</div>
										))}
									</div>
								</div>
								<div>
									<h3 className='text-lg font-bold mb-4'>Privacy Settings</h3>
									<div className='space-y-3'>
										{[
											"Show my profile to other users",
											"Allow messaging from anyone",
											"Display my Eco Points publicly"
										].map((item, index) => (
											<div key={index} className='flex items-center justify-between p-3 bg-gray-700 rounded-lg'>
												<span>{item}</span>
												<label className='switch'>
													<input type='checkbox' defaultChecked={index !== 2} />
													<span className='slider round'></span>
												</label>
											</div>
										))}
									</div>
								</div>
							</div>
						</motion.div>
					)}
				</motion.div>
			</div>
		</div>
	);
};

export default ProfilePage;
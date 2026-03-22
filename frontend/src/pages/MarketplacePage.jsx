import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Search, Filter, MapPin, Star, Heart, ShoppingCart, AlertTriangle } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuthStore } from "../store/authStore";
import { useDisputeStore } from "../store/disputeStore";
import LoadingSpinner from "../components/LoadingSpinner";

const MarketplacePage = () => {
	const { user } = useAuthStore();
	const { createDispute } = useDisputeStore();
	const [searchTerm, setSearchTerm] = useState("");
	
	const handleReport = async (listing) => {
		if (!user) {
			alert("Please login to report a listing.");
			return;
		}
		const reason = prompt("Reason for reporting?");
		if (!reason) return;
		const description = prompt("Please provide a description:");
		if (!description) return;

		try {
			await createDispute({
				targetId: listing.seller?._id,
				exchangeId: null,
				reason,
				description
			});
			alert("Report submitted successfully.");
		} catch (error) {
			alert("Failed to submit report.");
		}
	};
	const [selectedCategory, setSelectedCategory] = useState("all");
	const [listings, setListings] = useState([]);
	const [isLoading, setIsLoading] = useState(true);

	const fetchListings = async () => {
		setIsLoading(true);
		try {
			const params = new URLSearchParams();
			if (searchTerm) params.append("search", searchTerm);
			if (selectedCategory !== "all") params.append("category", selectedCategory);
			
			const response = await fetch(`http://localhost:5000/api/listings?${params.toString()}`);
			const data = await response.json();
			if (data.success) {
				setListings(data.listings);
			}
		} catch (error) {
			console.error("Error fetching listings:", error);
		} finally {
			setIsLoading(false);
		}
	};

	useEffect(() => {
		fetchListings();
	}, [selectedCategory]);

	const handleSearch = (e) => {
		e.preventDefault();
		fetchListings();
	};

	const filteredListings = listings; // Backend already filters

	const categories = [
		{ id: "all", name: "All Categories" },
		{ id: "vehicle", name: "Vehicle Parts" },
		{ id: "electronics", name: "Electronics" },
		{ id: "appliances", name: "Home Appliances" },
		{ id: "machinery", name: "Industrial Machinery" },
	];

	return (
		<div className='min-h-screen bg-background text-foreground'>
			<div className='container mx-auto px-4 py-8'>
				{/* Header */}
				<motion.div
					initial={{ opacity: 0, y: -20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.5 }}
					className='mb-10 text-center'
				>
					<h1 className='text-4xl font-bold mb-4 bg-gradient-to-r from-green-400 to-emerald-500 text-transparent bg-clip-text'>
						Spare Parts Marketplace
					</h1>
					<p className='text-gray-300 max-w-2xl mx-auto'>
						Find affordable and compatible spare parts for vehicles, machinery, and electronics from trusted sellers in our community.
					</p>
				</motion.div>

				{/* Search and Filters */}
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.5, delay: 0.1 }}
					className='mb-10'
				>
					<form onSubmit={handleSearch} className='flex flex-col md:flex-row gap-4 mb-6'>
						<div className='relative flex-grow'>
							<div className='absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none'>
								<Search className='text-muted-foreground' size={20} />
							</div>
							<input
								type='text'
								placeholder='Search for spare parts...'
								className='w-full pl-10 pr-4 py-3 bg-card rounded-lg border border-border focus:border-primary focus:ring-2 focus:ring-primary text-white placeholder-muted-foreground'
								value={searchTerm}
								onChange={(e) => setSearchTerm(e.target.value)}
							/>
						</div>
						<button 
							type='submit'
							className='px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold rounded-lg hover:from-green-600 hover:to-emerald-700 transition duration-300'
						>
							Search
						</button>
					</form>

					{/* Category Filters */}
					<div className='flex flex-wrap gap-2'>
						{categories.map((category) => (
							<button
								key={category.id}
								className={`px-4 py-2 rounded-full text-sm font-medium transition duration-300 ${
									selectedCategory === category.id
										? "bg-primary text-primary-foreground"
										: "bg-card text-muted-foreground hover:bg-accent"
								}`}
								onClick={() => setSelectedCategory(category.id)}
							>
								{category.name}
							</button>
						))}
					</div>
				</motion.div>

				{/* Listings Grid */}
				<motion.div
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					transition={{ duration: 0.5, delay: 0.2 }}
					className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'
				>
					{isLoading ? (
						<div className='col-span-full flex justify-center py-12'>
							<LoadingSpinner />
						</div>
					) : listings.map((listing, index) => (
						<motion.div
							key={listing._id}
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ duration: 0.3, delay: index * 0.1 }}
							className='bg-gray-800 rounded-xl overflow-hidden border border-gray-700 hover:border-green-500 transition duration-300'
						>
							<div className='relative'>
								<img
									src={listing.images?.[0] || "/placeholder-image.jpg"}
									alt={listing.title}
									className='w-full h-48 object-cover'
								/>
								<div className='absolute top-2 right-2 flex gap-2'>
									<button className='p-2 bg-gray-900 bg-opacity-50 rounded-full hover:bg-opacity-75 transition duration-300'>
										<Heart size={16} className='text-white' />
									</button>
									<button 
										onClick={() => handleReport(listing)}
										className='p-2 bg-red-900 bg-opacity-50 rounded-full hover:bg-opacity-75 transition duration-300'
										title='Report Listing'
									>
										<AlertTriangle size={16} className='text-red-400' />
									</button>
								</div>
								<div className='absolute bottom-2 left-2 bg-green-600 text-white text-xs font-bold px-2 py-1 rounded'>
									+{listing.ecoPoints || 10} EcoPts
								</div>
							</div>
							<div className='p-4'>
								<div className='flex justify-between items-start mb-2'>
									<h3 className='font-bold text-lg truncate' title={listing.title}>{listing.title}</h3>
									<span className='text-green-400 font-bold'>${listing.price}</span>
								</div>
								<div className='flex items-center text-sm text-gray-400 mb-2'>
									<MapPin size={16} className='mr-1' />
									<span>{listing.location || "Addis Ababa"}</span>
								</div>
								<div className='flex items-center justify-between mb-3'>
									<div className='flex items-center'>
										<Star size={16} className='text-yellow-400 fill-current' />
										<span className='ml-1 text-sm'>{listing.seller?.rating || 4.5}</span>
									</div>
									<span className='text-xs bg-gray-700 px-2 py-1 rounded'>{listing.condition}</span>
								</div>
								<div className='flex justify-between items-center'>
									<span className='text-sm text-gray-400'>by {listing.seller?.name || "Seller"}</span>
									<Link
										to={`/listing/${listing._id}`}
										className='px-3 py-1 bg-gradient-to-r from-green-500 to-emerald-600 text-white text-sm font-bold rounded-lg hover:from-green-600 hover:to-emerald-700 transition duration-300'
									>
										View
									</Link>
								</div>
							</div>
						</motion.div>
					))}
				</motion.div>

				{/* Empty State */}
				{filteredListings.length === 0 && (
					<motion.div
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						className='text-center py-12'
					>
						<h3 className='text-xl font-bold mb-2'>No listings found</h3>
						<p className='text-gray-400 mb-4'>Try adjusting your search or filter criteria</p>
						<button
							onClick={() => {
								setSearchTerm("");
								setSelectedCategory("all");
							}}
							className='px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition duration-300'
						>
							Clear Filters
						</button>
					</motion.div>
				)}
			</div>
		</div>
	);
};

export default MarketplacePage;
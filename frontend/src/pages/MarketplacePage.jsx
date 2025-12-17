import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Search, Filter, MapPin, Star, Heart, ShoppingCart } from "lucide-react";
import { Link } from "react-router-dom";

const MarketplacePage = () => {
	const [searchTerm, setSearchTerm] = useState("");
	const [selectedCategory, setSelectedCategory] = useState("all");
	const [listings, setListings] = useState([]);

	// Mock data for spare part listings
	const mockListings = [
		{
			id: 1,
			title: "Car Engine Block - Toyota Camry 2015",
			price: 450,
			location: "Addis Ababa",
			category: "vehicle",
			image: "/placeholder-car-engine.jpg",
			seller: "AutoParts Shop",
			rating: 4.8,
			condition: "Used - Good",
			ecoPoints: 25,
		},
		{
			id: 2,
			title: "Laptop Battery - Dell Inspiron 15",
			price: 85,
			location: "Adama",
			category: "electronics",
			image: "/placeholder-laptop-battery.jpg",
			seller: "TechSavers",
			rating: 4.5,
			condition: "Refurbished",
			ecoPoints: 10,
		},
		{
			id: 3,
			title: "Motorcycle Carburetor - Honda CB125",
			price: 120,
			location: "Dire Dawa",
			category: "vehicle",
			image: "/placeholder-motorcycle-carburetor.jpg",
			seller: "BikeFix Garage",
			rating: 4.9,
			condition: "New",
			ecoPoints: 15,
		},
		{
			id: 4,
			title: "Washing Machine Motor - LG 8kg",
			price: 220,
			location: "Hawassa",
			category: "appliances",
			image: "/placeholder-washing-machine.jpg",
			seller: "HomeAppliance Masters",
			rating: 4.7,
			condition: "Used - Excellent",
			ecoPoints: 20,
		},
	];

	useEffect(() => {
		// Simulate fetching listings from API
		setListings(mockListings);
	}, []);

	const filteredListings = listings.filter(listing => {
		const matchesSearch = listing.title.toLowerCase().includes(searchTerm.toLowerCase());
		const matchesCategory = selectedCategory === "all" || listing.category === selectedCategory;
		return matchesSearch && matchesCategory;
	});

	const categories = [
		{ id: "all", name: "All Categories" },
		{ id: "vehicle", name: "Vehicle Parts" },
		{ id: "electronics", name: "Electronics" },
		{ id: "appliances", name: "Home Appliances" },
		{ id: "machinery", name: "Industrial Machinery" },
	];

	return (
		<div className='min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white'>
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
					<div className='flex flex-col md:flex-row gap-4 mb-6'>
						<div className='relative flex-grow'>
							<div className='absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none'>
								<Search className='text-gray-400' size={20} />
							</div>
							<input
								type='text'
								placeholder='Search for spare parts...'
								className='w-full pl-10 pr-4 py-3 bg-gray-800 rounded-lg border border-gray-700 focus:border-green-500 focus:ring-2 focus:ring-green-500 text-white placeholder-gray-400'
								value={searchTerm}
								onChange={(e) => setSearchTerm(e.target.value)}
							/>
						</div>
						<button className='px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold rounded-lg hover:from-green-600 hover:to-emerald-700 transition duration-300'>
							Search
						</button>
					</div>

					{/* Category Filters */}
					<div className='flex flex-wrap gap-2'>
						{categories.map((category) => (
							<button
								key={category.id}
								className={`px-4 py-2 rounded-full text-sm font-medium transition duration-300 ${
									selectedCategory === category.id
										? "bg-green-500 text-white"
										: "bg-gray-800 text-gray-300 hover:bg-gray-700"
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
					{filteredListings.map((listing, index) => (
						<motion.div
							key={listing.id}
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ duration: 0.3, delay: index * 0.1 }}
							className='bg-gray-800 rounded-xl overflow-hidden border border-gray-700 hover:border-green-500 transition duration-300'
						>
							<div className='relative'>
								<img
									src={listing.image || "/placeholder-image.jpg"}
									alt={listing.title}
									className='w-full h-48 object-cover'
								/>
								<div className='absolute top-2 right-2'>
									<button className='p-2 bg-gray-900 bg-opacity-50 rounded-full hover:bg-opacity-75 transition duration-300'>
										<Heart size={20} className='text-white' />
									</button>
								</div>
								<div className='absolute bottom-2 left-2 bg-green-500 text-white text-xs font-bold px-2 py-1 rounded'>
									{listing.ecoPoints} EcoPts
								</div>
							</div>
							<div className='p-4'>
								<div className='flex justify-between items-start mb-2'>
									<h3 className='font-bold text-lg truncate'>{listing.title}</h3>
									<span className='text-green-400 font-bold'>${listing.price}</span>
								</div>
								<div className='flex items-center text-sm text-gray-400 mb-2'>
									<MapPin size={16} className='mr-1' />
									<span>{listing.location}</span>
								</div>
								<div className='flex items-center justify-between mb-3'>
									<div className='flex items-center'>
										<Star size={16} className='text-yellow-400 fill-current' />
										<span className='ml-1 text-sm'>{listing.rating}</span>
									</div>
									<span className='text-xs bg-gray-700 px-2 py-1 rounded'>{listing.condition}</span>
								</div>
								<div className='flex justify-between items-center'>
									<span className='text-sm text-gray-400'>by {listing.seller}</span>
									<Link
										to={`/listing/${listing.id}`}
										className='px-3 py-1 bg-gradient-to-r from-green-500 to-emerald-600 text-white text-sm font-bold rounded-lg hover:from-green-600 hover:to-emerald-700 transition duration-300'
									>
										<ShoppingCart size={16} />
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
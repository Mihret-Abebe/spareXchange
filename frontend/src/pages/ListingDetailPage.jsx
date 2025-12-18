import { useState } from "react";
import { motion } from "framer-motion";
import { Star, MapPin, Heart, Share2, Truck, Shield, RotateCcw } from "lucide-react";
import { Link, useParams } from "react-router-dom";

const ListingDetailPage = () => {
	const { id } = useParams();
	const [quantity, setQuantity] = useState(1);
	const [selectedImage, setSelectedImage] = useState(0);

	// Mock data for a specific listing
	const listing = {
		id: id || 1,
		title: "Car Engine Block - Toyota Camry 2015",
		price: 450,
		originalPrice: 600,
		discount: 25,
		location: "Addis Ababa, Ethiopia",
		category: "Vehicle Parts",
		images: [
			"/placeholder-car-engine.jpg",
			"/placeholder-car-engine-2.jpg",
			"/placeholder-car-engine-3.jpg",
		],
		seller: {
			name: "AutoParts Shop",
			rating: 4.8,
			reviews: 124,
			verified: true,
		},
		description: `High-quality engine block for Toyota Camry 2015 model. This is a genuine used part that has been thoroughly inspected and tested to ensure optimal performance. The engine block is in excellent condition with no cracks or damage.

Features:
- Compatible with Toyota Camry 2015
- 4-cylinder engine
- Excellent performance
- Comes with 3-month warranty

Condition: Used - Good
Warranty: 3 months
Eco Points: 25`,
		specifications: [
			{ label: "Brand", value: "Toyota" },
			{ label: "Model", value: "Camry" },
			{ label: "Year", value: "2015" },
			{ label: "Engine Type", value: "4-Cylinder" },
			{ label: "Condition", value: "Used - Good" },
			{ label: "Warranty", value: "3 Months" },
		],
		ecoPoints: 25,
	};

	const handleAddToCart = () => {
		// Add to cart functionality would go here
		console.log(`Added ${quantity} of ${listing.title} to cart`);
	};

	const handleBuyNow = () => {
		// Buy now functionality would go here
		console.log(`Buying ${quantity} of ${listing.title} now`);
	};

	return (
		<div className='min-h-screen bg-background text-foreground'>
			<div className='container mx-auto px-4 py-8'>
				{/* Breadcrumb */}
				<nav className='mb-6 text-sm text-muted-foreground'>
					<Link to='/' className='hover:text-primary'>Home</Link>
					<span className='mx-2'>/</span>
					<Link to='/marketplace' className='hover:text-primary'>Marketplace</Link>
					<span className='mx-2'>/</span>
					<span className='text-foreground'>{listing.title}</span>
				</nav>

				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.5 }}
					className='grid grid-cols-1 lg:grid-cols-2 gap-8'
				>
					{/* Image Gallery */}
					<div>
						<div className='mb-4'>
							<img
								src={listing.images[selectedImage]}
								alt={listing.title}
								className='w-full h-96 object-cover rounded-xl border border-border'
							/>
						</div>
						<div className='flex gap-2'>
							{listing.images.map((image, index) => (
								<button
									key={index}
									onClick={() => setSelectedImage(index)}
									className={`w-20 h-20 rounded-lg overflow-hidden border-2 ${
										selectedImage === index ? "border-primary" : "border-border"
									}`}
								>
									<img src={image} alt={`Preview ${index + 1}`} className='w-full h-full object-cover' />
								</button>
							))}
						</div>
					</div>

					{/* Product Info */}
					<div>
						<div className='mb-4'>
							<h1 className='text-3xl font-bold mb-2'>{listing.title}</h1>
							<div className='flex items-center mb-4'>
								<div className='flex items-center mr-4'>
									<Star size={20} className='text-yellow-400 fill-current' />
									<span className='ml-1 font-bold'>{listing.seller.rating}</span>
									<span className='text-muted-foreground ml-1'>({listing.seller.reviews} reviews)</span>
								</div>
								<div className='flex items-center text-sm text-primary'>
									<Shield size={16} className='mr-1' />
									<span>Verified Seller</span>
								</div>
							</div>
							<div className='flex items-center text-muted-foreground mb-4'>
								<MapPin size={16} className='mr-1' />
								<span>{listing.location}</span>
							</div>
						</div>

						{/* Price */}
						<div className='mb-6'>
							<div className='flex items-baseline'>
								<span className='text-3xl font-bold text-primary'>${listing.price}</span>
								{listing.originalPrice && (
									<>
										<span className='ml-3 text-xl text-muted-foreground line-through'>${listing.originalPrice}</span>
										<span className='ml-3 px-2 py-1 bg-destructive text-destructive-foreground text-sm font-bold rounded'>
											{listing.discount}% OFF
										</span>
									</>
								)}
							</div>
							<div className='flex items-center mt-2'>
								<span className='text-sm bg-green-900 text-green-300 px-2 py-1 rounded mr-2'>
									{listing.ecoPoints} Eco Points
								</span>
								<span className='text-sm text-gray-400'>Earn points for sustainable shopping</span>
							</div>
						</div>

						{/* Description */}
						<div className='mb-6'>
							<h2 className='text-xl font-bold mb-3'>Description</h2>
							<p className='text-muted-foreground whitespace-pre-line'>{listing.description}</p>
						</div>

						{/* Specifications */}
						<div className='mb-6'>
							<h2 className='text-xl font-bold mb-3'>Specifications</h2>
							<div className='grid grid-cols-2 gap-2'>
								{listing.specifications.map((spec, index) => (
									<div key={index} className='flex justify-between py-2 border-b border-border'>
										<span className='text-muted-foreground'>{spec.label}:</span>
										<span className='font-medium'>{spec.value}</span>
									</div>
								))}
							</div>
						</div>

						{/* Actions */}
						<div className='mb-6'>
							<div className='flex items-center mb-4'>
								<span className='mr-3'>Quantity:</span>
								<div className='flex items-center border border-gray-700 rounded-lg'>
									<button
										onClick={() => setQuantity(Math.max(1, quantity - 1))}
										className='px-3 py-1 text-gray-300 hover:bg-gray-700'
									>
										-
									</button>
									<span className='px-3 py-1'>{quantity}</span>
									<button
										onClick={() => setQuantity(quantity + 1)}
										className='px-3 py-1 text-gray-300 hover:bg-gray-700'
									>
										+
									</button>
								</div>
							</div>
							<div className='flex flex-wrap gap-3'>
								<button
									onClick={handleAddToCart}
									className='flex-1 min-w-[150px] px-6 py-3 bg-gray-800 text-white font-bold rounded-lg hover:bg-gray-700 transition duration-300 flex items-center justify-center'
								>
									<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
										<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17M17 13v4a2 2 0 01-2 2H9a2 2 0 01-2-2v-4m8 0V9a2 2 0 00-2-2H9a2 2 0 00-2 2v4.01" />
									</svg>
									Add to Cart
								</button>
								<button
									onClick={handleBuyNow}
									className='flex-1 min-w-[150px] px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold rounded-lg hover:from-green-600 hover:to-emerald-700 transition duration-300'
								>
									Buy Now
								</button>
							</div>
						</div>

						{/* Additional Info */}
						<div className='grid grid-cols-3 gap-4 pt-6 border-t border-gray-700'>
							<div className='text-center'>
								<Truck className='mx-auto mb-2 text-green-400' size={24} />
								<span className='text-sm'>Fast Delivery</span>
							</div>
							<div className='text-center'>
								<Shield className='mx-auto mb-2 text-green-400' size={24} />
								<span className='text-sm'>Secure Payment</span>
							</div>
							<div className='text-center'>
								<RotateCcw className='mx-auto mb-2 text-green-400' size={24} />
								<span className='text-sm'>30-Day Return</span>
							</div>
						</div>
					</div>
				</motion.div>

				{/* Seller Info */}
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.5, delay: 0.2 }}
					className='mt-12 p-6 bg-gray-800 rounded-xl border border-gray-700'
				>
					<h2 className='text-2xl font-bold mb-4'>Seller Information</h2>
					<div className='flex items-center'>
						<div className='w-16 h-16 rounded-full bg-gray-700 flex items-center justify-center mr-4'>
							<span className='text-2xl font-bold'>{listing.seller.name.charAt(0)}</span>
						</div>
						<div>
							<div className='flex items-center'>
								<h3 className='text-xl font-bold mr-2'>{listing.seller.name}</h3>
								{listing.seller.verified && (
									<Shield size={20} className='text-green-400' />
								)}
							</div>
							<div className='flex items-center text-gray-400'>
								<Star size={16} className='text-yellow-400 fill-current mr-1' />
								<span>{listing.seller.rating} ({listing.seller.reviews} reviews)</span>
							</div>
						</div>
						<div className='ml-auto flex gap-2'>
							<button className='px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition duration-300 flex items-center'>
								<Heart size={16} className='mr-2' />
								Follow
							</button>
							<button className='px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition duration-300 flex items-center'>
								<Share2 size={16} className='mr-2' />
								Contact
							</button>
						</div>
					</div>
				</motion.div>
			</div>
		</div>
	);
};

export default ListingDetailPage;
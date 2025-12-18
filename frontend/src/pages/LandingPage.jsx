import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Recycle, Shuffle, Users, Wrench, Leaf, Truck } from "lucide-react";

const LandingPage = () => {
	return (
		<div className='min-h-screen bg-gradient-to-br from-gray-900 via-green-900 to-emerald-900 text-white overflow-hidden'>
			{/* Floating Shapes */}
			<div className='absolute inset-0 overflow-hidden'>
				<motion.div
					className='absolute w-64 h-64 bg-green-500 rounded-full opacity-10 blur-3xl'
					animate={{
						y: ["0%", "100%", "0%"],
						x: ["0%", "100%", "0%"],
						scale: [1, 1.2, 1],
					}}
					transition={{
						duration: 20,
						ease: "linear",
						repeat: Infinity,
					}}
					style={{ top: "-10%", left: "10%" }}
				/>
				<motion.div
					className='absolute w-48 h-48 bg-emerald-500 rounded-full opacity-10 blur-3xl'
					animate={{
						y: ["100%", "0%", "100%"],
						x: ["0%", "100%", "0%"],
						scale: [1, 1.3, 1],
					}}
					transition={{
						duration: 25,
						ease: "linear",
						repeat: Infinity,
					}}
					style={{ bottom: "-10%", right: "10%" }}
				/>
			</div>

			{/* Header */}
			<header className='container mx-auto px-6 py-8 flex justify-between items-center relative z-10'>
				<motion.h1
					className='text-3xl font-bold bg-gradient-to-r from-green-400 to-emerald-500 text-transparent bg-clip-text'
					initial={{ opacity: 0, x: -20 }}
					animate={{ opacity: 1, x: 0 }}
					transition={{ duration: 0.5 }}
				>
					SpareXChange
				</motion.h1>
				<motion.div
					initial={{ opacity: 0, x: 20 }}
					animate={{ opacity: 1, x: 0 }}
					transition={{ duration: 0.5 }}
					className='space-x-4'
				>
					<Link
						to='/login'
						className='px-4 py-2 rounded-lg border border-green-500 text-green-400 hover:bg-green-500 hover:text-white transition duration-300'
					>
						Login
					</Link>
					<Link
						to='/signup'
						className='px-4 py-2 rounded-lg bg-gradient-to-r from-green-500 to-emerald-600 text-white hover:from-green-600 hover:to-emerald-700 transition duration-300'
					>
						Get Started
					</Link>
				</motion.div>
			</header>

			{/* Hero Section */}
			<section className='container mx-auto px-6 py-16 md:py-24 flex flex-col items-center text-center relative z-10'>
				<motion.h1
					className='text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-white via-green-200 to-emerald-300 text-transparent bg-clip-text'
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.8 }}
				>
					Find, Buy & Sell Spare Parts
				</motion.h1>
				<motion.p
					className='text-xl text-gray-300 mb-10 max-w-3xl'
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.8, delay: 0.2 }}
				>
					A cross-platform marketplace connecting users, garages, repair shops, recyclers, and electronics enthusiasts to buy, sell, and exchange affordable and compatible spare parts for vehicles, machinery, and electronics. Trade directly with peers or purchase from verified sellers.
				</motion.p>
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.8, delay: 0.4 }}
					className='flex flex-wrap justify-center gap-4'
				>
					<Link
						to='/marketplace'
						className='px-8 py-4 rounded-lg bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold text-lg hover:from-green-600 hover:to-emerald-700 transition duration-300 shadow-lg hover:shadow-green-500/20'
					>
						Explore Marketplace
					</Link>
					<Link
						to='/signup'
						className='px-8 py-4 rounded-lg border-2 border-green-500 text-green-400 font-bold text-lg hover:bg-green-500 hover:text-white transition duration-300'
					>
						Join the Community
					</Link>
				</motion.div>
			</section>

			{/* Features Section */}
			<section className='container mx-auto px-6 py-16 relative z-10'>
				<motion.h2
					className='text-4xl font-bold text-center mb-16 bg-gradient-to-r from-green-400 to-emerald-500 text-transparent bg-clip-text'
					initial={{ opacity: 0, y: 20 }}
					whileInView={{ opacity: 1, y: 0 }}
					viewport={{ once: true }}
					transition={{ duration: 0.6 }}
				>
					Platform Features
				</motion.h2>
				<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8'>
					{[
						{
							icon: Recycle,
							title: "Buy & Sell Spare Parts",
							description: "Find affordable spare parts for vehicles, machinery, and electronics from verified sellers in our secure marketplace.",
						},
						{
							icon: Shuffle,
							title: "Exchange Program",
							description: "Trade your spare parts directly with other users through our peer-to-peer exchange system.",
						},
						{
							icon: Users,
							title: "Community Network",
							description: "Connect with garages, repair shops, recyclers, and electronics enthusiasts in a collaborative ecosystem.",
						},
						{
							icon: Leaf,
							title: "Eco Points System",
							description: "Earn rewards for recycling spare parts and contributing to sustainable practices.",
						},
						{
							icon: Wrench,
							title: "Technician Support",
							description: "Request professional technician assistance for complex repairs and installations.",
						},
						{
							icon: Truck,
							title: "Real-Time Matching",
							description: "Instantly find compatible spare parts with our advanced search and matching algorithms.",
						},
					].map((feature, index) => (
						<motion.div
							key={index}
							className='bg-gray-800 bg-opacity-50 backdrop-filter backdrop-blur-lg rounded-2xl p-6 border border-gray-700 hover:border-green-500 transition duration-300'
							initial={{ opacity: 0, y: 20 }}
							whileInView={{ opacity: 1, y: 0 }}
							viewport={{ once: true }}
							transition={{ duration: 0.5, delay: index * 0.1 }}
						>
							<feature.icon className='w-12 h-12 text-green-500 mb-4' />
							<h3 className='text-2xl font-bold mb-2'>{feature.title}</h3>
							<p className='text-gray-300'>{feature.description}</p>
						</motion.div>
					))}
				</div>
			</section>

			{/* How It Works Section */}
			<section className='container mx-auto px-6 py-16 relative z-10'>
				<motion.h2
					className='text-4xl font-bold text-center mb-16 bg-gradient-to-r from-green-400 to-emerald-500 text-transparent bg-clip-text'
					initial={{ opacity: 0, y: 20 }}
					whileInView={{ opacity: 1, y: 0 }}
					viewport={{ once: true }}
					transition={{ duration: 0.6 }}
				>
					How It Works
				</motion.h2>
				<div className='grid grid-cols-1 md:grid-cols-3 gap-8'>
					{[
						{
							number: "01",
							title: "List or Find Parts",
							description: "Post your spare parts for sale or exchange, or browse our extensive catalog of available components."
						},
						{
							number: "02",
							title: "Connect & Transact",
							description: "Communicate with sellers/buyers and securely complete purchases or exchanges through our platform."
						},
						{
							number: "03",
							title: "Trade or Recycle",
							description: "Trade parts directly with peers or recycle unused components to earn Eco Points."
						}
					].map((step, index) => (
						<motion.div
							key={index}
							className='bg-gray-800 bg-opacity-50 backdrop-filter backdrop-blur-lg rounded-2xl p-6 border border-gray-700 text-center'
							initial={{ opacity: 0, y: 20 }}
							whileInView={{ opacity: 1, y: 0 }}
							viewport={{ once: true }}
							transition={{ duration: 0.5, delay: index * 0.1 }}
						>
							<div className='text-5xl font-bold text-green-500 mb-4'>{step.number}</div>
							<h3 className='text-2xl font-bold mb-4'>{step.title}</h3>
							<p className='text-gray-300'>{step.description}</p>
						</motion.div>
					))}
				</div>
			</section>

			{/* CTA Section */}
			<section className='container mx-auto px-6 py-24 text-center relative z-10'>
				<motion.h2
					className='text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-white to-green-300 text-transparent bg-clip-text'
					initial={{ opacity: 0, y: 20 }}
					whileInView={{ opacity: 1, y: 0 }}
					viewport={{ once: true }}
					transition={{ duration: 0.6 }}
				>
					Join the Circular Economy Revolution
				</motion.h2>
				<motion.p
					className='text-xl text-gray-300 mb-10 max-w-2xl mx-auto'
					initial={{ opacity: 0, y: 20 }}
					whileInView={{ opacity: 1, y: 0 }}
					viewport={{ once: true }}
					transition={{ duration: 0.6, delay: 0.2 }}
				>
					Reduce e-waste, save money, and contribute to a sustainable future by joining our community of spare part enthusiasts.
				</motion.p>
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					whileInView={{ opacity: 1, y: 0 }}
					viewport={{ once: true }}
					transition={{ duration: 0.6, delay: 0.4 }}
				>
					<Link
						to='/signup'
						className='inline-block px-10 py-4 rounded-lg bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold text-xl hover:from-green-600 hover:to-emerald-700 transition duration-300 shadow-lg hover:shadow-green-500/30'
					>
						Get Started Today
					</Link>
				</motion.div>
			</section>

			{/* Footer */}
			<footer className='border-t border-gray-800 py-10 relative z-10'>
				<div className='container mx-auto px-6 text-center'>
					<p className='text-gray-400'>
						&copy; {new Date().getFullYear()} SpareXChange. Building a sustainable future through spare part exchange.
					</p>
				</div>
			</footer>
		</div>
	);
};

export default LandingPage;
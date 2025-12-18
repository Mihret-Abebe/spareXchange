import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, Search, ShoppingCart, User, Package, Leaf, Home, Info, HelpCircle, Phone } from "lucide-react";

const Navbar = () => {
	const [isMenuOpen, setIsMenuOpen] = useState(false);
	const location = useLocation();

	const navLinks = [
		{ name: "Home", path: "/", icon: Home },
		{ name: "Marketplace", path: "/marketplace", icon: Package },
		{ name: "About", path: "/about", icon: Info },
		{ name: "FAQ", path: "/faq", icon: HelpCircle },
		{ name: "Contact", path: "/contact", icon: Phone },
	];

	const isActive = (path) => {
		if (path === "/" && location.pathname === "/") return true;
		if (path !== "/" && location.pathname.startsWith(path)) return true;
		return false;
	};

	return (
		<nav className='bg-gray-900 border-b border-gray-800 sticky top-0 z-50'>
			<div className='container mx-auto px-4'>
				<div className='flex items-center justify-between h-16'>
					{/* Logo */}
					<Link to='/' className='flex items-center'>
						<span className='text-2xl font-bold bg-gradient-to-r from-green-400 to-emerald-500 text-transparent bg-clip-text'>
							SpareXChange
						</span>
					</Link>

					{/* Desktop Navigation */}
					<div className='hidden md:flex items-center space-x-8'>
						{navLinks.map((link) => (
							<Link
								key={link.path}
								to={link.path}
								className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition duration-300 ${
									isActive(link.path)
										? "text-green-400 bg-gray-800"
										: "text-gray-300 hover:text-white hover:bg-gray-800"
								}`}
							>
								<link.icon size={16} className='mr-2' />
								{link.name}
							</Link>
						))}
					</div>

					{/* Search and Actions */}
					<div className='hidden md:flex items-center space-x-4'>
						<div className='relative'>
							<div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
								<Search className='h-4 w-4 text-gray-400' />
							</div>
							<input
								type='text'
								placeholder='Search...'
								className='pl-10 pr-4 py-2 bg-gray-800 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500 w-40'
							/>
						</div>
						<button className='p-2 rounded-full hover:bg-gray-800 transition duration-300'>
							<ShoppingCart size={20} className='text-gray-300' />
						</button>
						<Link to='/profile' className='p-2 rounded-full hover:bg-gray-800 transition duration-300'>
							<User size={20} className='text-gray-300' />
						</Link>
					</div>

					{/* Mobile menu button */}
					<div className='md:hidden flex items-center'>
						<button
							onClick={() => setIsMenuOpen(!isMenuOpen)}
							className='p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none'
						>
							{isMenuOpen ? <X size={24} /> : <Menu size={24} />}
						</button>
					</div>
				</div>

				{/* Mobile Menu */}
				{isMenuOpen && (
					<div className='md:hidden'>
						<div className='px-2 pt-2 pb-3 space-y-1 sm:px-3'>
							{navLinks.map((link) => (
								<Link
									key={link.path}
									to={link.path}
									className={`flex items-center px-3 py-2 rounded-md text-base font-medium transition duration-300 ${
										isActive(link.path)
											? "text-green-400 bg-gray-800"
											: "text-gray-300 hover:text-white hover:bg-gray-800"
									}`}
									onClick={() => setIsMenuOpen(false)}
								>
									<link.icon size={16} className='mr-3' />
									{link.name}
								</Link>
							))}
							<div className='pt-4 pb-3 border-t border-gray-700'>
								<div className='flex items-center px-3'>
									<div className='relative flex-grow'>
										<div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
											<Search className='h-4 w-4 text-gray-400' />
										</div>
										<input
											type='text'
											placeholder='Search...'
											className='pl-10 pr-4 py-2 bg-gray-800 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500 w-full'
										/>
									</div>
								</div>
								<div className='mt-3 flex items-center px-3 space-x-3'>
									<button className='p-2 rounded-full hover:bg-gray-800 transition duration-300'>
										<ShoppingCart size={20} className='text-gray-300' />
									</button>
									<Link 
										to='/profile' 
										className='p-2 rounded-full hover:bg-gray-800 transition duration-300'
										onClick={() => setIsMenuOpen(false)}
									>
										<User size={20} className='text-gray-300' />
									</Link>
								</div>
							</div>
						</div>
					</div>
				)}
			</div>
		</nav>
	);
};

export default Navbar;
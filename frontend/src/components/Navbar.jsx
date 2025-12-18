import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Menu, X, ShoppingCart, User, Package, Leaf, Home, Info, HelpCircle, Phone, LogOut, LogIn, Moon, Sun } from "lucide-react";
import { useAuthStore } from "../store/authStore";

const Navbar = () => {
	const [isMenuOpen, setIsMenuOpen] = useState(false);
	const [darkMode, setDarkMode] = useState(false);
	const location = useLocation();
	const navigate = useNavigate();
	const { isAuthenticated, user, logout, isLoading } = useAuthStore();

	useEffect(() => {
		// Check system preference for dark mode
		const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
		setDarkMode(prefersDark);
	}, []);

	useEffect(() => {
		// Apply dark mode class to document
		if (darkMode) {
			document.documentElement.classList.add('dark');
		} else {
			document.documentElement.classList.remove('dark');
		}
	}, [darkMode]);

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

					{/* Actions */}
					<div className='hidden md:flex items-center space-x-4'>
						<button 
							className='p-2 rounded-full hover:bg-gray-800 transition duration-300'
							onClick={() => setDarkMode(!darkMode)}
						>
							{darkMode ? <Sun size={20} className='text-yellow-400' /> : <Moon size={20} className='text-gray-300' />}
						</button>
						<button className='p-2 rounded-full hover:bg-gray-800 transition duration-300'>
							<ShoppingCart size={20} className='text-gray-300' />
						</button>

						{isAuthenticated ? (
							<div className='flex items-center space-x-2'>
								{user?.ecoPoints !== undefined && (
									<span className='text-xs px-2 py-1 rounded-full bg-emerald-700/30 text-green-300 border border-emerald-600/50'>
										<Leaf className='inline mr-1 h-3 w-3' />
										{user.ecoPoints}
									</span>
								)}
								<Link to='/profile' className='p-2 rounded-full hover:bg-gray-800 transition duration-300'>
									<User size={20} className='text-gray-300' />
								</Link>
								<button
									disabled={isLoading}
									onClick={async () => {
										await logout();
										navigate("/");
									}}
									className='p-2 rounded-full hover:bg-gray-800 transition duration-300 text-gray-300 disabled:opacity-50'
								>
									<LogOut size={20} />
								</button>
							</div>
						) : (
							<div className='flex items-center space-x-2'>
								<Link to='/login' className='flex items-center px-3 py-2 rounded-md text-sm font-medium text-gray-300 hover:text-white hover:bg-gray-800'>
									<LogIn size={16} className='mr-2' /> Login
								</Link>
								<Link to='/signup' className='px-3 py-2 rounded-md text-sm font-medium bg-emerald-600 text-white hover:bg-emerald-500'>
									Sign Up
								</Link>
							</div>
						)}
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
							<div className='flex items-center justify-between px-3'>
								<button 
									className='p-2 rounded-full hover:bg-gray-800 transition duration-300'
									onClick={() => setDarkMode(!darkMode)}
								>
									{darkMode ? <Sun size={20} className='text-yellow-400' /> : <Moon size={20} className='text-gray-300' />}
								</button>

								{isAuthenticated ? (
									<div className='flex items-center space-x-3'>
										{user?.ecoPoints !== undefined && (
											<span className='text-xs px-2 py-1 rounded-full bg-emerald-700/30 text-green-300 border border-emerald-600/50'>
												<Leaf className='inline mr-1 h-3 w-3' />
												{user.ecoPoints}
											</span>
										)}
										<Link 
											to='/profile' 
											className='p-2 rounded-full hover:bg-gray-800 transition duration-300'
											onClick={() => setIsMenuOpen(false)}
										>
											<User size={20} className='text-gray-300' />
										</Link>
										<button
											disabled={isLoading}
											onClick={async () => {
												await logout();
												navigate("/");
												setIsMenuOpen(false);
											}}
											className='p-2 rounded-full hover:bg-gray-800 transition duration-300 text-gray-300 disabled:opacity-50'
										>
											<LogOut size={20} />
										</button>
									</div>
								) : (
									<div className='flex items-center space-x-3'>
										<Link to='/login' className='flex items-center px-3 py-2 rounded-md text-sm font-medium text-gray-300 hover:text-white hover:bg-gray-800' onClick={() => setIsMenuOpen(false)}>
											<LogIn size={16} className='mr-2' /> Login
										</Link>
										<Link to='/signup' className='px-3 py-2 rounded-md text-sm font-medium bg-emerald-600 text-white hover:bg-emerald-500' onClick={() => setIsMenuOpen(false)}>
											Sign Up
										</Link>
									</div>
								)}
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
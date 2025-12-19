import { useState, useEffect, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Menu, X, ShoppingCart, User, Package, Leaf, Home, Info, HelpCircle, Phone, LogOut, LogIn, Sun, Moon } from "lucide-react";
import { useAuthStore } from "../store/authStore";

const Navbar = () => {
	const [isMenuOpen, setIsMenuOpen] = useState(false);
	const [isMobile, setIsMobile] = useState(window.innerWidth < 820);
	const location = useLocation();
	const navigate = useNavigate();
	const { isAuthenticated, user, logout, isLoading } = useAuthStore();
	const mobileMenuRef = useRef(null);

	// Handle window resize to toggle mobile view
	useEffect(() => {
		const handleResize = () => {
			setIsMobile(window.innerWidth < 820);
		};

		window.addEventListener('resize', handleResize);
		return () => window.removeEventListener('resize', handleResize);
	}, []);

	// Close mobile menu when clicking outside
	useEffect(() => {
		const handleClickOutside = (event) => {
			if (mobileMenuRef.current && !mobileMenuRef.current.contains(event.target)) {
				setIsMenuOpen(false);
			}
		};

		if (isMenuOpen) {
			document.addEventListener('mousedown', handleClickOutside);
		}

		return () => {
			document.removeEventListener('mousedown', handleClickOutside);
		};
	}, [isMenuOpen]);

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
			<div className=' mx-auto px-4'>
				<div className='flex items-center justify-between h-16  flex-wrap'>
					{/* Logo */}
					<Link to='/' className='flex items-center'>
						<span className='text-xl md:text-2xl font-bold bg-gradient-to-r from-green-400 to-emerald-500 text-transparent bg-clip-text'>
							SpareXChange
						</span>
					</Link>

					{/* Desktop Navigation */}
					<div className={`${isMobile || isMenuOpen ? 'hidden' : 'flex'} items-center space-x-2 lg:space-x-4`}>
						{navLinks.map((link) => (
							<Link
								key={link.path}
								to={link.path}
								className={`flex items-center px-1.5 py-2 rounded-md text-xs md:text-sm font-medium transition duration-300 ${
									isActive(link.path)
										? "text-green-400 bg-gray-800"
										: "text-gray-300 hover:text-white hover:bg-gray-800"
								}`}
							>
								<link.icon size={14} className='mr-1.5' />
								<span className='hidden md:inline'>{link.name}</span>
							</Link>
						))}
					</div>

					{/* Search and Actions */}
					<div className={`${isMobile ? 'hidden' : 'flex'} items-center space-x-1 lg:space-x-2 min-w-max`}>

						<button className='p-2 rounded-full hover:bg-gray-800 transition duration-300'>
							<ShoppingCart size={20} className='text-gray-300' />
						</button>

						{isAuthenticated ? (
							<div className='flex items-center space-x-2 min-w-max'>
								{user?.ecoPoints !== undefined && (
									<span className='text-xs px-2 py-1 rounded-full bg-secondary text-secondary-foreground border border-border hidden sm:inline-flex items-center'>
										<Leaf className='inline mr-1 h-3 w-3' />
										{user.ecoPoints}
									</span>
								)}
								<Link to='/profile' className='p-2 rounded-full hover:bg-accent transition duration-300'>
									<User size={20} className='text-muted-foreground' />
								</Link>
								<button
									disabled={isLoading}
									onClick={async () => {
										await logout();
										navigate("/");
									}}
									className='p-2 rounded-full hover:bg-accent transition duration-300 text-muted-foreground disabled:opacity-50'
								>
									<LogOut size={20} />
								</button>
							</div>
						) : (
							<div className='flex items-center space-x-2 min-w-max'>
								<Link to='/login' className='flex items-center px-3 py-2 rounded-md text-sm font-medium text-gray-300 hover:text-white hover:bg-gray-800 transition duration-300'>
									<LogIn size={16} className='mr-2' /> <span className='hidden lg:inline'>Login</span>
								</Link>
								<Link to='/signup' className='flex items-center px-3 py-2 rounded-md text-sm font-medium bg-green-500 text-white hover:bg-green-600 transition duration-300'>
									<User size={16} className='mr-2' /> <span className='hidden md:inline'>Sign Up</span>
								</Link>
							</div>
						)}
					</div>

					{/* Mobile menu button */}
					<div className={`${isMobile ? 'flex' : 'hidden'} items-center space-x-2 z-50`}>
						<button className='p-2 rounded-full hover:bg-gray-800 transition duration-300'>
							<ShoppingCart size={20} className='text-gray-300' />
						</button>
						{isAuthenticated && (
							<Link to='/profile' className='p-2 rounded-full hover:bg-gray-700 transition duration-300'>
								<User size={20} className='text-white' />
							</Link>
						)}
						<button
							onClick={() => setIsMenuOpen(!isMenuOpen)}
							className='p-2 rounded-md text-muted-foreground text-gray-300 hover:text-primary hover:bg-accent focus:outline-none'
						>
							{isMenuOpen ? <X size={24} /> : <Menu size={24} />}
						</button>
					</div>
				</div>

				{/* Mobile Menu */}
				{isMobile && isMenuOpen && (
					<div 
						ref={mobileMenuRef}
						className='absolute top-16 left-0 right-0 bg-gray-900 border-b border-gray-800 shadow-xl z-50 animate-fadeInDown'
					>
						<div className='px-4 py-3 space-y-1'>
							{navLinks.map((link) => (
								<Link
									key={link.path}
									to={link.path}
									className={`flex items-center px-4 py-3 rounded-lg text-base font-medium transition-all duration-300 transform hover:translate-x-2 ${
										isActive(link.path)
											? "text-green-400 bg-gray-800"
											: "text-gray-300 hover:text-white hover:bg-gray-800"
									}`}
									onClick={() => setIsMenuOpen(false)}
								>
									<link.icon size={20} className='mr-3' />
									{link.name}
								</Link>
							))}
							<div className='pt-4 pb-3 border-t border-gray-800 mt-2'>
								<div className='flex items-center justify-between px-3 mb-4'>
									<button className='p-3 rounded-full bg-gray-800 hover:bg-gray-700 transition duration-300'>
										<ShoppingCart size={20} className='text-gray-300' />
									</button>
								</div>
																		
								{isAuthenticated ? (
									<div className='mt-3 px-3 space-y-3'>
										{user?.ecoPoints !== undefined && (
											<div className='flex items-center justify-between'>
												<span className='text-sm font-medium text-gray-300'>EcoPoints</span>
												<span className='text-xs px-3 py-1.5 rounded-full bg-gray-800 text-gray-300 font-semibold flex items-center border border-gray-700'>
													<Leaf className='inline mr-1.5 h-3.5 w-3.5' />
													{user.ecoPoints}
												</span>
											</div>
										)}
										<div className='flex space-x-3'>
											<Link 
												to='/profile' 
												className='flex-1 flex items-center justify-center px-4 py-2.5 rounded-lg bg-gray-800 text-gray-300 hover:bg-gray-700 transition duration-300'
												onClick={() => setIsMenuOpen(false)}
											>
												<User size={18} className='mr-2' />
												Profile
											</Link>
											<button
												disabled={isLoading}
												onClick={async () => {
													await logout();
													navigate("/");
													setIsMenuOpen(false);
												}}
												className='flex-1 flex items-center justify-center px-4 py-2.5 rounded-lg bg-green-500 text-white hover:bg-green-600 transition duration-300 disabled:opacity-50'
											>
												<LogOut size={18} className='mr-2' />
												Logout
											</button>
										</div>
									</div>
								) : (
									<div className='mt-3 px-3 space-y-3'>
										<Link to='/login' className='flex items-center justify-center px-4 py-2.5 rounded-lg bg-gray-800 text-gray-300 hover:bg-gray-700 transition duration-300' onClick={() => setIsMenuOpen(false)}>
											<LogIn size={18} className='mr-2' /> Login
										</Link>
										<Link to='/signup' className='flex items-center justify-center px-4 py-2.5 rounded-lg bg-green-500 text-white hover:bg-green-600 transition duration-300' onClick={() => setIsMenuOpen(false)}>
											<User size={18} className='mr-2' /> Sign Up
										</Link>
									</div>
								)}
							</div>
						</div>
					</div>
				)}
			</div>
		</nav>
	);
};

export default Navbar;
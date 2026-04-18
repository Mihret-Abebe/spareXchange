import { useState } from "react";
// import { motion } from "framer-motion";
// import { Mail, Lock, Loader } from "lucide-react";
// import { Link } from 'react-router';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Checkbox } from '../components/ui/checkbox';
import { Recycle, Eye, EyeOff, Loader } from 'lucide-react';
import { Link, useNavigate } from "react-router-dom";
// import Input from "../components/ui/input";
import { useAuthStore } from "../store/authStore";
const LoginPage = () => {

	const [showPassword, setShowPassword] = useState(false);
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [rememberMe, setRememberMe] = useState(false);
	const [errorOccurred, setErrorOccurred] = useState(false);
	const navigate = useNavigate();


	const { login, isLoading, error } = useAuthStore();
	useState(() => {
		setErrorOccurred(false);
	}, []);
	const handleLogin = async (e) => {
		e.preventDefault();
		try {
			setErrorOccurred(false);
			await login(email, password);
			navigate("/dashboard");
		} catch (error) {
			console.log(error);
			setErrorOccurred(true);
		}
	};

	return (
		<div className="min-h-screen flex">
			{/* Left side - Image */}
			<div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
				<div className="absolute inset-0 bg-gradient-to-br from-green-600/90 to-green-900/90 z-10" />
				<img
					src="https://images.unsplash.com/photo-1766650189458-bb0e7969ba5d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhdXRvJTIwcGFydHMlMjBtZWNoYW5pY2FsJTIwd29ya3Nob3B8ZW58MXx8fHwxNzc0MDI1NDUyfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
					alt="Auto Parts Workshop"
					className="absolute inset-0 w-full h-full object-cover"
				/>
				<div className="relative z-20 flex flex-col justify-center items-start p-16 text-white">
					<div className="flex items-center gap-3 mb-12">
						<div className="bg-white p-3 rounded-xl">
							<Recycle className="w-8 h-8 text-green-600" />
						</div>
						<h1 className="text-4xl text-white">SpareXchange</h1>
					</div>
					<h2 className="text-5xl mb-6 leading-tight text-white">
						Your Marketplace for<br />Auto Parts
					</h2>
					<p className="text-xl text-green-50 max-w-md">
						Connect with sellers, find the parts you need, and keep your vehicles running smoothly.
					</p>
				</div>
			</div>

			{/* Right side - Form */}
			<div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-background">
				<div className="w-full max-w-md space-y-8">
					{/* Mobile Logo */}
					<div className="lg:hidden flex items-center gap-3 justify-center">
						<div className="bg-green-600 p-2 rounded-lg">
							<Recycle className="w-6 h-6 text-white" />
						</div>
						<h1 className="text-2xl">SpareXchange</h1>
					</div>

					{/* Header */}
					<div className="text-center lg:text-left">
						<h2 className="text-3xl mb-2">Welcome Back</h2>
						<p className="text-muted-foreground">
							Sign in to your account to continue
						</p>
					</div>
					<div className={`${errorOccurred ? 'bg-red-200' : 'bg-white'} p-1 rounded-md flex justify-center items-baseline`}>
						{errorOccurred && <p className="text-red-500 text-md mb-4">{error}</p>}
					</div>


					{/* Form */}
					<form onSubmit={handleLogin} className="space-y-6">
						<div className="space-y-2">
							<Label htmlFor="email">Email Address</Label>
							<Input
								id="email"
								type="email"
								placeholder="you@example.com"
								value={email}
								onChange={(e) => setEmail(e.target.value)}
								required
								className="bg-input-background border border-border"
							/>
						</div>

						<div className="space-y-2">
							<Label htmlFor="password">Password</Label>
							<div className="relative">
								<Input
									id="password"
									type={showPassword ? 'text' : 'password'}
									placeholder="••••••••"
									value={password}
									onChange={(e) => setPassword(e.target.value)}
									required
									className="bg-input-background border border-border pr-10"
								/>
								<button
									type="button"
									onClick={() => setShowPassword(!showPassword)}
									className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
								>
									{showPassword ? (
										<EyeOff className="w-5 h-5" />
									) : (
										<Eye className="w-5 h-5" />
									)}
								</button>
							</div>
						</div>

						<div className="flex items-center justify-between">
							<div className="flex items-center space-x-2">
								<Checkbox
									id="remember"
									checked={rememberMe}
									onCheckedChange={(checked) => setRememberMe(!checked)}
								/>
								<label
									htmlFor="remember"
									className="text-sm text-muted-foreground cursor-pointer"
								>
									Remember me
								</label>
							</div>
							<Link
								to="/forgot-password"
								className="text-sm text-primary hover:underline"
							>
								Forgot password?
							</Link>
						</div>

						<Button type="submit" className="w-full bg-primary hover:bg-primary/90">
							{isLoading ? (
								<Loader className='w-6 h-6 animate-spin mx-auto' />
							) : (
								"Sign In"
							)}
						</Button>
					</form>

					{/* Divider */}
					<div className="relative">
						<div className="absolute inset-0 flex items-center">
							<div className="w-full border-t border-border" />
						</div>
						<div className="relative flex justify-center text-sm">
							<span className="bg-background px-4 text-muted-foreground">
								Or continue with
							</span>
						</div>
					</div>

					{/* Social Login */}
					<div className="grid grid-cols-1 gap-4">
						<Button variant="outline" type="button" className="w-full">
							<svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
								<path
									fill="currentColor"
									d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
								/>
								<path
									fill="currentColor"
									d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
								/>
								<path
									fill="currentColor"
									d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
								/>
								<path
									fill="currentColor"
									d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
								/>
							</svg>
							Google
						</Button>
					</div>

					{/* Sign Up Link */}
					<p className="text-center text-sm text-muted-foreground">
						Don't have an account?{' '}
						<Link to="/signup" className="text-primary hover:underline">
							Sign up for free
						</Link>
					</p>
				</div>
			</div>
		</div>
	);
};
export default LoginPage;

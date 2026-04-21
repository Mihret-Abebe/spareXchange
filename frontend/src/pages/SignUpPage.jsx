// import { motion } from "framer-motion";
// import Input from "../components/Input";
import { Checkbox } from "../components/ui/checkbox";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Recycle, Eye, EyeOff } from "lucide-react";

// import { Loader, Lock, Mail, User } from "lucide-react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import PasswordStrengthMeter from "../components/PasswordStrengthMeter";
import { useAuthStore } from "../store/authStore";

const SignUpPage = () => {
	const [showPassword, setShowPassword] = useState(false);
	const [showConfirmPassword, setShowConfirmPassword] = useState(false);
	const [formData, setFormData] = useState({
		fullName: "",
		email: "",
		password: "",
		confirmPassword: "",
		accountType: "user" | "recycler" | "business",
		agreeToTerms: false,
	});
	const navigate = useNavigate();

	const { signup, error, isLoading } = useAuthStore();

	const handleSignUp = async (e) => {
		e.preventDefault();

		try {
			await signup(formData.email, formData.password, formData.fullName);
			navigate("/verify-email");
		} catch (error) {
			console.log(error);
		}
	};
	const updateFormData = (field, value) => {
		setFormData((prev) => ({ ...prev, [field]: value }));
	};
	return (
		<section className="min-h-screen flex">
			{/* Left side - Image */}
			<section className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
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
						<h1 className="text-4xl text-white">
							SpareXchange
						</h1>
					</div>

					<h2 className="text-5xl mb-6 leading-tight text-white">
						Join Our Community
					</h2>

					<p className="text-xl text-green-50 max-w-md mb-8">
						"Whether you're an individual, repair shop, garage,
						or recycling center - find and exchange auto parts
						with ease."
					</p>

					<div className="space-y-4">
						<div className="flex items-start gap-3">
							<div className="bg-green-500 rounded-full p-1 mt-1">
								<svg
									className="w-4 h-4 text-white"
									fill="none"
									stroke="currentColor"
									viewBox="0 0 24 24"
								>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth={2}
										d="M5 13l4 4L19 7"
									/>
								</svg>
							</div>
							<div>
								<h3 className="text-white mb-1">
									Search & Exchange Parts
								</h3>
								<p className="text-green-100 text-sm">
									Find exactly what you need from verified
									sellers
								</p>
							</div>
						</div>

						<div className="flex items-start gap-3">
							<div className="bg-green-500 rounded-full p-1 mt-1">
								<svg
									className="w-4 h-4 text-white"
									fill="none"
									stroke="currentColor"
									viewBox="0 0 24 24"
								>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth={2}
										d="M5 13l4 4L19 7"
									/>
								</svg>
							</div>
							<div>
								<h3 className="text-white mb-1">
									Secure Transactions
								</h3>
								<p className="text-green-100 text-sm">
									Safe and reliable platform for all users
								</p>
							</div>
						</div>
						<div className="flex items-start gap-3">
							<div className="bg-green-500 rounded-full p-1 mt-1">
								<svg
									className="w-4 h-4 text-white"
									fill="none"
									stroke="currentColor"
									viewBox="0 0 24 24"
								>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth={2}
										d="M5 13l4 4L19 7"
									/>
								</svg>
							</div>
							<div>
								<h3 className="text-white mb-1">
									Cross-Platform Access
								</h3>
								<p className="text-green-100 text-sm">
									Available on web and mobile devices
								</p>
							</div>
						</div>
					</div>
				</div>
			</section>


			{/* Right side - Form */}

			<section className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-background">
				<div className="w-full max-w-md space-y-6">
					{/* Mobile Logo */}
					<article className="lg:hidden flex items-center gap-3 justify-center">
						<div className="bg-green-600 p-2 rounded-lg">
							<Recycle className="w-6 h-6 text-white" />
						</div>
						<h1 className="text-2xl">SpareXchange</h1>
					</article>

					{/* Header */}
					<header className="text-center lg:text-left">
						<h2 className="text-3xl mb-2">Create Account</h2>
						<p className="text-muted-foreground">
							Get started with SpareXchange today
						</p>
					</header>

					{/* Form */}
					<form onSubmit={handleSignUp} className="space-y-5">
						<div className="space-y-2">
							<Label htmlFor="fullName">Full Name</Label>
							<Input
								id="fullName"
								type="text"
								placeholder="John Doe"
								value={formData.fullName}
								onChange={(e) =>
									updateFormData("fullName", e.target.value)
								}
								required
								className="bg-input-background border border-border"
							/>
						</div>

						<div className="space-y-2">
							<Label htmlFor="email">Email Address</Label>
							<Input
								id="email"
								type="email"
								placeholder="you@example.com"
								value={formData.email}
								onChange={(e) =>
									updateFormData("email", e.target.value)
								}
								required
								className="bg-input-background border border-border"
							/>
						</div>

						<div className="space-y-2">
							<Label htmlFor="password">Password</Label>
							<div className="relative">
								<Input
									id="password"
									type={showPassword ? "text" : "password"}
									placeholder="••••••••"
									value={formData.password}
									onChange={(e) =>
										updateFormData("password", e.target.value)
									}
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

						<div className="space-y-2">
							<Label htmlFor="confirmPassword">
								Confirm Password
							</Label>
							<div className="relative">
								<Input
									id="confirmPassword"
									type={
										showConfirmPassword ? "text" : "password"
									}
									placeholder="••••••••"
									value={formData.confirmPassword}
									onChange={(e) =>
										updateFormData(
											"confirmPassword",
											e.target.value,
										)
									}
									required
									className="bg-input-background border border-border pr-10"
								/>
								<button
									type="button"
									onClick={() =>
										setShowConfirmPassword(!showConfirmPassword)
									}
									className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
								>
									{showConfirmPassword ? (
										<EyeOff className="w-5 h-5" />
									) : (
										<Eye className="w-5 h-5" />
									)}
								</button>
							</div>
						</div>
						<PasswordStrengthMeter password={formData.password} />

						<div className="space-y-2">
							<Label>Account Type</Label>
							<div className="grid grid-cols-2 gap-3">
								<button
									type="button"
									onClick={() =>
										updateFormData("accountType", "user")
									}
									className={`p-4 border rounded-lg transition-all ${formData.accountType === "user"
										? "border-[var(--primary)] bg-[var(--secondary)] text-[var(--secondary-foreground)]"
										: "border-[var(--border)] hover:[var(--border-primary)]/50"
										}`}
								>
									<div className="text-sm">User</div>
								</button>
								<button
									type="button"
									onClick={() =>
										updateFormData("accountType", "business")
									}
									className={`p-4 border rounded-lg transition-all ${formData.accountType === "business"
										? "border-[var(--primary)] bg-[var(--secondary)] text-[var(--secondary-foreground)]"
										: "border-[var(--border)] hover:[var(--border-primary)]/50"
										}`}
								>
									<div className="text-sm">Business</div>
								</button>
								<button
									type="button"
									onClick={() => {
										updateFormData("accountType", "recycler")
										console.log('recycler')
									}
									}
									className={`p-4 border rounded-lg transition-all ${formData.accountType === "recycler"
										? "border-[var(--primary)] bg-[var(--secondary)] text-[var(--secondary-foreground)]"
										: "border-[var(--border)] hover:[var(--border-primary)]/50"
										}`}
								>
									<div className="text-sm">Recycler</div>
								</button>
							</div>
						</div>

						<div className="flex items-start space-x-2">
							<Checkbox
								id="terms"
								checked={formData.agreeToTerms}
								onCheckedChange={(checked) =>
									updateFormData(
										"agreeToTerms",
										checked,
									)
								}
								required
								className="color-[var(--primary)] text-[var(--primary)] bg-[var(--primary)]/10 border-[var(--primary)] focus:ring-[var(--primary)]"
							/>
							<label
								htmlFor="terms"
								className="text-sm text-muted-foreground cursor-pointer leading-relaxed"
							>
								I agree to the{" "}
								<Link
									to="/terms"
									className="text-primary hover:underline"
								>
									Terms of Service
								</Link>{" "}
								and{" "}
								<Link
									to="/privacy"
									className="text-primary hover:underline"
								>
									Privacy Policy
								</Link>
							</label>
						</div>

						<Button
							type="submit"
							className="w-full bg-[var(--primary)] hover:bg-[#16a34a]/90"
						>
							Create Account
						</Button>
					</form>

				</div>
			</section>
		</section>



	);
};
export default SignUpPage;

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuthStore } from "../store/authStore";
import toast from "react-hot-toast";
import { User, Mail, Phone, MapPin, Camera, Save, ArrowLeft, Loader } from "lucide-react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";

const EditProfilePage = () => {
	const navigate = useNavigate();
	const { user, isLoading } = useAuthStore();
	
	const [formData, setFormData] = useState({
		name: "",
		email: "",
		phone: "",
		location: "",
		profilePicture: "",
	});

	const [isUpdating, setIsUpdating] = useState(false);

	useEffect(() => {
		if (user) {
			setFormData({
				name: user.name || "",
				email: user.email || "",
				phone: user.phone || "",
				location: user.location || "",
				profilePicture: user.profilePicture || "",
			});
		}
	}, [user]);

	const handleChange = (e) => {
		const { name, value } = e.target;
		setFormData((prev) => ({ ...prev, [name]: value }));
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		
		if (!formData.name.trim()) {
			toast.error("Name is required");
			return;
		}

		setIsUpdating(true);
		try {
			const updateData = {
				name: formData.name.trim(),
				phone: formData.phone.trim(),
				location: formData.location.trim(),
				profilePicture: formData.profilePicture.trim(),
			};

			await useAuthStore.getState().updateProfile(updateData);
			toast.success("Profile updated successfully!");
			navigate("/profile");
		} catch (error) {
			console.error("Error updating profile:", error);
			toast.error(error.response?.data?.message || "Failed to update profile");
		} finally {
			setIsUpdating(false);
		}
	};

	if (!user) return null;

	return (
		<div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white py-8 px-4">
			<div className="max-w-2xl mx-auto">
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.5 }}
				>
					{/* Header */}
					<div className="flex items-center mb-8">
						<button
							onClick={() => navigate("/profile")}
							className="flex items-center text-gray-300 hover:text-white transition-colors mr-4"
						>
							<ArrowLeft className="w-5 h-5 mr-2" />
							Back to Profile
						</button>
						<h1 className="text-3xl font-bold">Edit Profile</h1>
					</div>

					{/* Form Card */}
					<div className="bg-gray-800 rounded-xl p-8 border border-gray-700">
						<form onSubmit={handleSubmit} className="space-y-6">
							{/* Profile Picture */}
							<div className="flex flex-col items-center mb-8">
								<div className="relative">
									{formData.profilePicture ? (
										<img
											src={formData.profilePicture}
											alt="Profile"
											className="w-32 h-32 rounded-full object-cover border-4 border-green-500"
										/>
									) : (
										<div className="w-32 h-32 rounded-full bg-gradient-to-r from-green-500 to-emerald-600 flex items-center justify-center border-4 border-green-500">
											<span className="text-5xl font-bold text-white">
												{formData.name.charAt(0).toUpperCase()}
											</span>
										</div>
									)}
									<button
										type="button"
										className="absolute bottom-0 right-0 bg-green-600 p-2 rounded-full hover:bg-green-700 transition-colors"
										title="Update profile picture URL"
									>
										<Camera className="w-5 h-5" />
									</button>
								</div>
								<p className="text-sm text-gray-400 mt-2">
									Profile picture URL (optional)
								</p>
							</div>

							{/* Name */}
							<div className="space-y-2">
								<Label htmlFor="name" className="flex items-center text-gray-300">
									<User className="w-4 h-4 mr-2" />
									Full Name
								</Label>
								<Input
									id="name"
									name="name"
									type="text"
									value={formData.name}
									onChange={handleChange}
									placeholder="John Doe"
									required
									className="bg-gray-700 border-gray-600 text-white focus:border-green-500 focus:ring-green-500"
								/>
							</div>

							{/* Email (Read-only) */}
							<div className="space-y-2">
								<Label htmlFor="email" className="flex items-center text-gray-300">
									<Mail className="w-4 h-4 mr-2" />
									Email Address
								</Label>
								<Input
									id="email"
									type="email"
									value={formData.email}
									disabled
									className="bg-gray-700 border-gray-600 text-gray-400 cursor-not-allowed"
								/>
								<p className="text-xs text-gray-500">Email cannot be changed</p>
							</div>

							{/* Phone */}
							<div className="space-y-2">
								<Label htmlFor="phone" className="flex items-center text-gray-300">
									<Phone className="w-4 h-4 mr-2" />
									Phone Number
								</Label>
								<Input
									id="phone"
									name="phone"
									type="tel"
									value={formData.phone}
									onChange={handleChange}
									placeholder="+251 911 223 344"
									className="bg-gray-700 border-gray-600 text-white focus:border-green-500 focus:ring-green-500"
								/>
							</div>

							{/* Location */}
							<div className="space-y-2">
								<Label htmlFor="location" className="flex items-center text-gray-300">
									<MapPin className="w-4 h-4 mr-2" />
									Location
								</Label>
								<Input
									id="location"
									name="location"
									type="text"
									value={formData.location}
									onChange={handleChange}
									placeholder="Addis Ababa, Ethiopia"
									className="bg-gray-700 border-gray-600 text-white focus:border-green-500 focus:ring-green-500"
								/>
							</div>

							{/* Profile Picture URL */}
							<div className="space-y-2">
								<Label htmlFor="profilePicture" className="flex items-center text-gray-300">
									<Camera className="w-4 h-4 mr-2" />
									Profile Picture URL
								</Label>
								<Input
									id="profilePicture"
									name="profilePicture"
									type="url"
									value={formData.profilePicture}
									onChange={handleChange}
									placeholder="https://example.com/photo.jpg"
									className="bg-gray-700 border-gray-600 text-white focus:border-green-500 focus:ring-green-500"
								/>
							</div>

							{/* Submit Button */}
							<div className="flex gap-4 pt-4">
								<Button
									type="button"
									variant="outline"
									onClick={() => navigate("/profile")}
									className="flex-1 bg-gray-700 border-gray-600 text-white hover:bg-gray-600"
									disabled={isUpdating}
								>
									Cancel
								</Button>
								<Button
									type="submit"
									className="flex-1 bg-green-600 hover:bg-green-700 text-white"
									disabled={isUpdating}
								>
									{isUpdating ? (
										<>
											<Loader className="w-4 h-4 mr-2 animate-spin" />
											Saving...
										</>
									) : (
										<>
											<Save className="w-4 h-4 mr-2" />
											Save Changes
										</>
									)}
								</Button>
							</div>
						</form>
					</div>
				</motion.div>
			</div>
		</div>
	);
};

export default EditProfilePage;

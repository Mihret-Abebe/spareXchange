import { User } from "../models/user.model.js";
import { Listing } from "../models/listing.model.js";
import { Exchange } from "../models/exchange.model.js";

// Get all users (Admin only)
export const getAllUsers = async (req, res) => {
	try {
		const { userType, isBanned, isActive, search } = req.query;
		const query = { isActive: isActive !== "false" };
		
		if (userType) query.userType = userType;
		if (isBanned) query.isBanned = isBanned === "true";
		if (search) {
			query.$or = [
				{ name: { $regex: search, $options: "i" } },
				{ email: { $regex: search, $options: "i" } }
			];
		}

		const users = await User.find(query).select("-password");
		res.status(200).json({ success: true, count: users.length, users });
	} catch (error) {
		console.error("Error in getAllUsers:", error);
		res.status(500).json({ success: false, message: "Server error" });
	}
};

// Toggle Ban Status
export const toggleUserBan = async (req, res) => {
	try {
		const { id } = req.params;
		const user = await User.findById(id);
		
		if (!user) return res.status(404).json({ success: false, message: "User not found" });
		if (user.userType === "admin") return res.status(403).json({ success: false, message: "Cannot ban an admin" });

		user.isBanned = !user.isBanned;
		await user.save();

		res.status(200).json({ success: true, message: `User ${user.isBanned ? "banned" : "unbanned"}`, isBanned: user.isBanned });
	} catch (error) {
		console.error("Error in toggleUserBan:", error);
		res.status(500).json({ success: false, message: "Server error" });
	}
};

// Verify User/Technician Role
export const verifyRoleStatus = async (req, res) => {
	try {
		const { id } = req.params;
		const { status, note } = req.body; // verified, rejected

		const user = await User.findById(id);
		if (!user) return res.status(404).json({ success: false, message: "User not found" });

		user.roleStatus = status;
		if (status === "verified") {
			user.verifiedSeller = true; // Automatically make them a verified seller too
		}
		
		await user.save();
		// In a real app, send a notification here too
		
		res.status(200).json({ success: true, message: `Role status updated to ${status}`, user });
	} catch (error) {
		console.error("Error in verifyRoleStatus:", error);
		res.status(500).json({ success: false, message: "Server error" });
	}
};

// Get Platform Statistics
export const getPlatformStats = async (req, res) => {
	try {
		const totalUsers = await User.countDocuments();
		const totalListings = await Listing.countDocuments();
		const totalExchanges = await Exchange.countDocuments({ status: "fully_completed" });
		
		const usersByType = await User.aggregate([
			{ $group: { _id: "$userType", count: { $sum: 1 } } }
		]);

		res.status(200).json({
			success: true,
			stats: {
				totalUsers,
				totalListings,
				totalExchanges,
				usersByType
			}
		});
	} catch (error) {
		console.error("Error in getPlatformStats:", error);
		res.status(500).json({ success: false, message: "Server error" });
	}
};

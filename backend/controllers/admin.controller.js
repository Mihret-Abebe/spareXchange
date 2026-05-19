import { User } from "../models/user.model.js";
import { Listing } from "../models/listing.model.js";
import { Exchange } from "../models/exchange.model.js";
import { emitToUser } from "../utils/socket.js";
import { processSavedSearchAlerts } from "../services/savedSearchAlerts.service.js";

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
		
		// Save admin note for feedback
		if (note) {
			user.verificationNote = note;
		}
		
		if (status === "verified") {
			user.verifiedSeller = true; // Automatically make them a verified seller too
			
			// Grant permissions based on userType
			const permsToAdd = [];
			if (user.userType === "technician") permsToAdd.push("receive_service_requests");
			if (user.userType === "recycler") permsToAdd.push("receive_pickup_requests");
			if (user.userType === "garage") permsToAdd.push("create_bulk_listings");
			
			// Grant send_notifications permission to all verified users
			if (!user.permissions.includes("send_notifications")) {
				permsToAdd.push("send_notifications");
			}

			permsToAdd.forEach(p => {
				if (!user.permissions.includes(p)) user.permissions.push(p);
			});
		}
		
		await user.save();
		
		// Real-time Notification with note
		emitToUser(id, "role_verified", {
			status,
			userType: user.userType,
			note: note || "",
			message: `Your request for ${user.userType} status has been ${status}.${note ? ` Note: ${note}` : ''}`
		});
		
		res.status(200).json({ 
			success: true, 
			message: `Role status updated to ${status}`, 
			user,
			note: note || ""
		});
	} catch (error) {
		console.error("Error in verifyRoleStatus:", error);
		res.status(500).json({ success: false, message: "Server error" });
	}
};

// Verify User Email (Admin can verify users directly)
export const verifyUserEmail = async (req, res) => {
	try {
		const { id } = req.params;
		const user = await User.findById(id);
		
		if (!user) return res.status(404).json({ success: false, message: "User not found" });
		
		user.isVerified = true;
		user.verificationToken = undefined;
		user.verificationTokenExpiresAt = undefined;
		
		// Grant send_notifications permission to verified users
		if (!user.permissions.includes("send_notifications")) {
			user.permissions.push("send_notifications");
		}
		
		await user.save();
		
		res.status(200).json({ 
			success: true, 
			message: "User email verified successfully",
			user: { ...user._doc, password: undefined }
		});
	} catch (error) {
		console.error("Error in verifyUserEmail:", error);
		res.status(500).json({ success: false, message: "Server error" });
	}
};

// Get Pending Verifications
export const getPendingVerifications = async (req, res) => {
	try {
		const pendingUsers = await User.find({ roleStatus: "pending" }).select("name email userType verificationDocs createdAt");
		res.status(200).json({ success: true, count: pendingUsers.length, users: pendingUsers });
	} catch (error) {
		console.error("Error in getPendingVerifications:", error);
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

// Run saved-search alert processing on demand (Admin)
export const runSavedSearchAlertsJob = async (req, res) => {
	try {
		const { limitSearches, limitListingsPerSearch } = req.body || {};
		const result = await processSavedSearchAlerts({
			limitSearches: Number.isFinite(Number(limitSearches)) ? Number(limitSearches) : 200,
			limitListingsPerSearch: Number.isFinite(Number(limitListingsPerSearch)) ? Number(limitListingsPerSearch) : 5,
		});

		res.status(200).json({
			success: true,
			message: "Saved-search alerts job executed.",
			result,
		});
	} catch (error) {
		console.error("Error in runSavedSearchAlertsJob:", error);
		res.status(500).json({ success: false, message: "Server error" });
	}
};

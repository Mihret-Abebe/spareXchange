import { User } from "../models/user.model.js";
import { EcoPointTransaction } from "../models/ecoPointTransaction.model.js";

// Get all verified technicians
export const getTechnicians = async (req, res) => {
	try {
		const { expertise, search } = req.query;
		const query = { 
			userType: "technician", 
			roleStatus: "verified",
			isBanned: false
		};

		if (expertise) {
			query.expertise = { $regex: expertise, $options: "i" };
		}

		if (search) {
			query.$or = [
				{ name: { $regex: search, $options: "i" } },
				{ expertise: { $regex: search, $options: "i" } }
			];
		}

		const technicians = await User.find(query).select("name email expertise totalReviews trustScore locationCoords");
		
		res.status(200).json({ success: true, count: technicians.length, technicians });
	} catch (error) {
		console.error("Error in getTechnicians:", error);
		res.status(500).json({ success: false, message: "Server error" });
	}
};

// Get single technician profile
export const getTechnicianById = async (req, res) => {
	try {
		const { id } = req.params;
		const technician = await User.findOne({ _id: id, userType: "technician" }).select("-password -verificationDocs");
		
		if (!technician) {
			return res.status(404).json({ success: false, message: "Technician not found" });
		}

		res.status(200).json({ success: true, technician });
	} catch (error) {
		console.error("Error in getTechnicianById:", error);
		res.status(500).json({ success: false, message: "Server error" });
	}
};

// Redeem Eco Points
export const redeemPoints = async (req, res) => {
	try {
		const { points, rewardDescription } = req.body;
		const userId = req.userId;

		if (!points || points <= 0) {
			return res.status(400).json({ success: false, message: "Valid points amount is required" });
		}

		const user = await User.findById(userId);
		if (!user) return res.status(404).json({ success: false, message: "User not found" });

		// Role Check: Only verified users or technicians can redeem
		if (user.roleStatus !== "verified") {
			return res.status(403).json({ success: false, message: "Only verified users or technicians can redeem points" });
		}

		if (user.ecoPoints < points) {
			return res.status(400).json({ success: false, message: "Insufficient eco points" });
		}

		// Deduct points
		user.ecoPoints -= points;
		await user.save();

		// Log transaction
		const transaction = new EcoPointTransaction({
			userId,
			points: -points, // Negative for redemption
			reason: "redemption",
			description: rewardDescription || "Redeemed points for reward",
		});
		await transaction.save();

		res.status(200).json({
			success: true,
			message: `${points} points redeemed successfully`,
			currentPoints: user.ecoPoints,
			transaction
		});
	} catch (error) {
		console.error("Error in redeemPoints:", error);
		res.status(500).json({ success: false, message: "Server error" });
	}
};

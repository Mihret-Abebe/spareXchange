import { RecyclingSubmission } from "../models/recyclingSubmission.model.js";
import { User } from "../models/user.model.js";

// Calculate eco points based on item type and weight/value
const calculateEcoPoints = (itemType, estimatedWeight, estimatedValue) => {
	// Base points per item type
	const basePoints = {
		electronics: 20,
		"vehicle-parts": 25,
		"mobile-devices": 15,
		computers: 30,
		batteries: 10,
		appliances: 20,
		plastic: 5,
		metal: 8,
		other: 10,
	};

	let points = basePoints[itemType] || 10; // default to 10 if type not found

	// Adjust points based on weight (if provided)
	if (estimatedWeight) {
		points = Math.round(points * estimatedWeight);
	} else if (estimatedValue) {
		// Adjust points based on value if weight not provided
		points = Math.round(points * (estimatedValue / 100));
	}

	// Ensure points are reasonable
	return Math.max(5, Math.min(500, points)); // between 5 and 500 points
};

// Create a new recycling submission
export const createRecyclingSubmission = async (req, res) => {
	try {
		const { itemType, itemDescription, estimatedWeight, estimatedValue, location, verificationImages, notes } = req.body;

		// Validate required fields
		if (!itemType || !itemDescription || !location) {
			return res.status(400).json({ success: false, message: "Item type, description, and location are required" });
		}

		// Calculate eco points
		const ecoPointsEarned = calculateEcoPoints(itemType, estimatedWeight, estimatedValue);

		const newSubmission = new RecyclingSubmission({
			userId: req.userId, // from middleware
			itemType,
			itemDescription,
			estimatedWeight,
			estimatedValue,
			ecoPointsEarned,
			location,
			verificationImages: verificationImages || [],
			notes,
		});

		const savedSubmission = await newSubmission.save();

		res.status(201).json({
			success: true,
			message: "Recycling submission created successfully",
			submission: savedSubmission,
		});
	} catch (error) {
		console.error("Error in createRecyclingSubmission:", error);
		res.status(500).json({ success: false, message: "Server error" });
	}
};

// Get all recycling submissions for a user
export const getUserRecyclingSubmissions = async (req, res) => {
	try {
		const submissions = await RecyclingSubmission.find({ userId: req.userId })
			.sort({ createdAt: -1 }); // newest first

		res.status(200).json({
			success: true,
			count: submissions.length,
			submissions,
		});
	} catch (error) {
		console.error("Error in getUserRecyclingSubmissions:", error);
		res.status(500).json({ success: false, message: "Server error" });
	}
};

// Get all recycling submissions (for admin)
export const getAllRecyclingSubmissions = async (req, res) => {
	try {
		const { status, itemType } = req.query;

		// Build query object
		const query = {};
		if (status) query.status = status;
		if (itemType) query.itemType = itemType;

		const submissions = await RecyclingSubmission.find(query)
			.populate("userId", "name profilePicture")
			.sort({ createdAt: -1 });

		res.status(200).json({
			success: true,
			count: submissions.length,
			submissions,
		});
	} catch (error) {
		console.error("Error in getAllRecyclingSubmissions:", error);
		res.status(500).json({ success: false, message: "Server error" });
	}
};

// Get a single recycling submission
export const getRecyclingSubmission = async (req, res) => {
	try {
		const { id } = req.params;

		const submission = await RecyclingSubmission.findById(id)
			.populate("userId", "name profilePicture");

		if (!submission) {
			return res.status(404).json({ success: false, message: "Submission not found" });
		}

		// Check if the user is the owner of the submission or is an admin
		if (submission.userId.toString() !== req.userId) {
			// Additional checks for admin access could go here
		}

		res.status(200).json({
			success: true,
			submission,
		});
	} catch (error) {
		console.error("Error in getRecyclingSubmission:", error);
		res.status(500).json({ success: false, message: "Server error" });
	}
};

// Approve a recycling submission (for admin)
export const approveRecyclingSubmission = async (req, res) => {
	try {
		const { id } = req.params;

		const submission = await RecyclingSubmission.findById(id);

		if (!submission) {
			return res.status(404).json({ success: false, message: "Submission not found" });
		}

		if (submission.status !== "pending") {
			return res.status(400).json({ success: false, message: "Submission is not pending" });
		}

		// Update status and mark as verified
		submission.status = "approved";
		submission.verifiedBy = req.userId;
		submission.verifiedAt = new Date();
		await submission.save();

		// Update user's eco points
		const user = await User.findById(submission.userId);
		if (user) {
			user.ecoPoints += submission.ecoPointsEarned;
			await user.save();
		}

		res.status(200).json({
			success: true,
			message: "Submission approved successfully and eco points added",
			submission,
		});
	} catch (error) {
		console.error("Error in approveRecyclingSubmission:", error);
		res.status(500).json({ success: false, message: "Server error" });
	}
};

// Reject a recycling submission (for admin)
export const rejectRecyclingSubmission = async (req, res) => {
	try {
		const { id } = req.params;
		const { notes } = req.body;

		const submission = await RecyclingSubmission.findById(id);

		if (!submission) {
			return res.status(404).json({ success: false, message: "Submission not found" });
		}

		if (submission.status !== "pending") {
			return res.status(400).json({ success: false, message: "Submission is not pending" });
		}

		// Update status and add rejection notes
		submission.status = "rejected";
		submission.notes = notes || submission.notes;
		submission.verifiedBy = req.userId;
		submission.verifiedAt = new Date();
		await submission.save();

		res.status(200).json({
			success: true,
			message: "Submission rejected",
			submission,
		});
	} catch (error) {
		console.error("Error in rejectRecyclingSubmission:", error);
		res.status(500).json({ success: false, message: "Server error" });
	}
};

// Complete a recycling submission (for admin)
export const completeRecyclingSubmission = async (req, res) => {
	try {
		const { id } = req.params;

		const submission = await RecyclingSubmission.findById(id);

		if (!submission) {
			return res.status(404).json({ success: false, message: "Submission not found" });
		}

		if (submission.status !== "approved") {
			return res.status(400).json({ success: false, message: "Submission must be approved first" });
		}

		submission.status = "completed";
		await submission.save();

		res.status(200).json({
			success: true,
			message: "Submission marked as completed",
			submission,
		});
	} catch (error) {
		console.error("Error in completeRecyclingSubmission:", error);
		res.status(500).json({ success: false, message: "Server error" });
	}
};
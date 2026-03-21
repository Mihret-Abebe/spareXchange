import { Review } from "../models/review.model.js";
import { User } from "../models/user.model.js";
import { Exchange } from "../models/exchange.model.js";

export const createReview = async (req, res) => {
	try {
		const { revieweeId, exchangeId, rating, comment } = req.body;
		const reviewerId = req.userId;

		if (!rating || rating < 1 || rating > 5) {
			return res.status(400).json({ success: false, message: "Valid rating (1-5) is required" });
		}

		// Ensure exchange exists and is fully completed
		const exchange = await Exchange.findById(exchangeId);
		if (!exchange) {
			return res.status(404).json({ success: false, message: "Exchange not found" });
		}

		if (exchange.status !== "fully_completed") {
			return res.status(400).json({ success: false, message: "Exchange must be fully completed to leave a review" });
		}

		// Check if user is part of exchange
		if (exchange.buyerId.toString() !== reviewerId && exchange.sellerId.toString() !== reviewerId) {
			return res.status(403).json({ success: false, message: "Not authorized to review this exchange" });
		}

		// Create the review
		const newReview = new Review({
			reviewerId,
			revieweeId,
			exchangeId,
			rating,
			comment,
		});

		await newReview.save();

		// Update the reviewee's average rating in the User model
		const reviews = await Review.find({ revieweeId });
		const totalReviews = reviews.length;
		const sumRatings = reviews.reduce((sum, rev) => sum + rev.rating, 0);
		const trustScore = sumRatings / totalReviews;

		await User.findByIdAndUpdate(revieweeId, {
			trustScore: trustScore,
			totalReviews: totalReviews,
		});

		res.status(201).json({ success: true, message: "Review created successfully", data: newReview });
	} catch (error) {
		console.error("Error in createReview: ", error);
		// Check for duplicate key error (user already reviewed)
		if (error.code === 11000) {
			return res.status(400).json({ success: false, message: "You have already reviewed this exchange" });
		}
		res.status(500).json({ success: false, message: "Server error" });
	}
};

export const getUserReviews = async (req, res) => {
	try {
		const { userId } = req.params;

		const reviews = await Review.find({ revieweeId: userId })
			.sort({ createdAt: -1 })
			.populate("reviewerId", "name profilePicture");

		res.status(200).json({ success: true, count: reviews.length, data: reviews });
	} catch (error) {
		console.error("Error in getUserReviews: ", error);
		res.status(500).json({ success: false, message: "Server error" });
	}
};

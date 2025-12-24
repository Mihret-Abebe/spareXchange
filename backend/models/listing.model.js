import mongoose from "mongoose";

const listingSchema = new mongoose.Schema(
	{
		title: {
			type: String,
			required: true,
			trim: true,
		},
		description: {
			type: String,
			required: true,
		},
		price: {
			type: Number,
			required: true,
			min: 0,
		},
		category: {
			type: String,
			required: true,
			enum: [
				"vehicle",
				"electronics", 
				"appliances",
				"machinery",
				"mobile",
				"computer",
				"other"
			],
		},
		condition: {
			type: String,
			required: true,
			enum: [
				"new",
				"like-new",
				"used-good",
				"used-fair",
				"refurbished"
			],
		},
		location: {
			type: String,
			required: true,
		},
		images: [{
			type: String, // URLs to images
		}],
		seller: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
			required: true,
		},
		available: {
			type: Boolean,
			default: true,
		},
		views: {
			type: Number,
			default: 0,
		},
		isVerified: {
			type: Boolean,
			default: false, // Admin verification
		},
		ecoPoints: {
			type: Number,
			default: 0,
		},
		contactInfo: {
			phone: String,
			email: String,
		},
		specifications: {
			type: Map,
			of: String, // Allows for flexible key-value pairs
		},
	},
	{ timestamps: true }
);

export const Listing = mongoose.model("Listing", listingSchema);
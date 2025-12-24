import mongoose from "mongoose";

const recyclingSubmissionSchema = new mongoose.Schema(
	{
		userId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
			required: true,
		},
		itemType: {
			type: String,
			required: true,
			enum: [
				"electronics",
				"vehicle-parts",
				"appliances",
				"mobile-devices",
				"computers",
				"batteries",
				"plastic",
				"metal",
				"other"
			],
		},
		itemDescription: {
			type: String,
			required: true,
		},
		estimatedWeight: {
			type: Number, // in kg
		},
		estimatedValue: {
			type: Number, // estimated monetary value
		},
		ecoPointsEarned: {
			type: Number,
			required: true,
			default: 0,
		},
		location: {
			type: String,
			required: true,
		},
		status: {
			type: String,
			enum: ["pending", "approved", "rejected", "completed"],
			default: "pending",
		},
		verificationImages: [{
			type: String, // URLs to images for verification
		}],
		notes: {
			type: String,
		},
		verifiedBy: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User", // admin or staff who verified
		},
		verifiedAt: {
			type: Date,
		},
	},
	{ timestamps: true }
);

export const RecyclingSubmission = mongoose.model("RecyclingSubmission", recyclingSubmissionSchema);
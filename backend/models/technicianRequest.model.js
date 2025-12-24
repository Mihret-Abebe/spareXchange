import mongoose from "mongoose";

const technicianRequestSchema = new mongoose.Schema(
	{
		userId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
			required: true,
		},
		serviceType: {
			type: String,
			required: true,
			enum: [
				"repair",
				"installation", 
				"maintenance",
				"diagnosis",
				"other"
			],
		},
		description: {
			type: String,
			required: true,
		},
		location: {
			type: String,
			required: true,
		},
		contactInfo: {
			phone: String,
			email: String,
		},
		priority: {
			type: String,
			enum: ["low", "medium", "high", "urgent"],
			default: "medium",
		},
		status: {
			type: String,
			enum: ["pending", "in-progress", "completed", "cancelled"],
			default: "pending",
		},
		assignedTechnician: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User", // technician user
		},
		estimatedCost: {
			type: Number,
		},
		images: [{
			type: String, // URLs to images
		}],
	},
	{ timestamps: true }
);

export const TechnicianRequest = mongoose.model("TechnicianRequest", technicianRequestSchema);
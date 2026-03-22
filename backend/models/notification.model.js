import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema(
	{
		userId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
			required: true,
		},
		title: {
			type: String,
			required: true,
		},
		message: {
			type: String,
			required: true,
		},
		type: {
			type: String,
			enum: [
				"listing", 
				"technician-request", 
				"recycling", 
				"system", 
				"message",
				"eco-points",
				"verification",
				"match"
			],
			default: "system",
		},
		isRead: {
			type: Boolean,
			default: false,
		},
		link: {
			type: String,
			default: "",
		},
		relatedId: {
			type: mongoose.Schema.Types.ObjectId,
		},
		relatedModel: {
			type: String,
		},
		data: {
			type: Object, // Additional data related to the notification
		},
	},
	{ timestamps: true }
);

export const Notification = mongoose.model("Notification", notificationSchema);
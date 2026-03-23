import mongoose from "mongoose";

const exchangeSchema = new mongoose.Schema(
	{
		buyerId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
			required: true,
		},
		sellerId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
			required: true,
		},
		listingId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Listing",
			required: true,
		},
		offeredItems: {
			type: String, // Description of what the buyer is offering to trade
		},
		status: {
			type: String,
			enum: ["pending", "accepted", "completed_by_buyer", "completed_by_seller", "fully_completed", "cancelled", "rejected"],
			default: "pending",
		},
		meetingDetails: {
			location: String,
			time: Date,
		},
		negotiationNotes: {
			type: String,
			default: "",
		},
		lastMessage: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Message",
		},
	},
	{ timestamps: true }
);

export const Exchange = mongoose.model("Exchange", exchangeSchema);

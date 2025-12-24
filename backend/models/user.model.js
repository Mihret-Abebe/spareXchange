import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
	{
		email: {
			type: String,
			required: true,
			unique: true,
		},
		password: {
			type: String,
			required: true,
		},
		name: {
			type: String,
			required: true,
		},
		lastLogin: {
			type: Date,
			default: Date.now,
		},
		isVerified: {
			type: Boolean,
			default: false,
		},
		resetPasswordToken: String,
		resetPasswordExpiresAt: Date,
		verificationToken: String,
		verificationTokenExpiresAt: Date,
		// New fields for SpareXChange features
		ecoPoints: {
			type: Number,
			default: 0,
		},
		userType: {
			type: String,
			enum: ["individual", "garage", "repair-shop", "recycler", "admin"],
			default: "individual",
		},
		verifiedSeller: {
			type: Boolean,
			default: false,
		},
		location: {
			type: String,
			default: "",
		},
		phone: {
			type: String,
			default: "",
		},
		profilePicture: {
			type: String,
			default: "",
		},
	},
	{ timestamps: true }
);

export const User = mongoose.model("User", userSchema);
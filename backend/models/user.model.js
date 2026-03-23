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
			enum: ["individual", "garage", "repair-shop", "recycler", "technician", "admin"],
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
		totalReviews: {
			type: Number,
			default: 0,
		},
		interests: { type: [String], default: [] },
		achievements: { type: [String], default: [] },
		locationCoords: {
			type: {
				type: String,
				enum: ["Point"],
				default: "Point",
			},
			coordinates: {
				type: [Number],
				default: [0, 0],
			},
		},
		verificationDocs: [String], // URLs to PDF or images
		roleStatus: {
			type: String,
			enum: ["none", "pending", "verified", "rejected"],
			default: "none",
		},
		refreshToken: { type: String },
		mfaSecret: { type: String },
		isMfaEnabled: { type: Boolean, default: false },
		mfaBackupCodes: [{ type: String }],
		permissions: [{ type: String }],
		isBanned: {
			type: Boolean,
			default: false,
		},
		isActive: {
			type: Boolean,
			default: true,
		},
	},
	{ timestamps: true }
);

userSchema.index({ locationCoords: "2dsphere" });

export const User = mongoose.model("User", userSchema);
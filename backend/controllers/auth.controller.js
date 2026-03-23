import bcryptjs from "bcryptjs";
import crypto from "crypto";
import jwt from "jsonwebtoken";
import { generateSecret, generateURI, verify, generate } from "otplib";
import qrcode from "qrcode";

import { generateTokenAndSetCookie } from "../utils/generateTokenAndSetCookie.js";
import {
	sendPasswordResetEmail,
	sendResetSuccessEmail,
	sendVerificationEmail,
	sendWelcomeEmail,
} from "../mailtrap/emails.js";
import { User } from "../models/user.model.js";

export const signup = async (req, res) => {
	const { email, password, name } = req.body;

	try {
		if (!email || !password || !name) {
			throw new Error("All fields are required");
		}

		const userAlreadyExists = await User.findOne({ email });
		console.log("userAlreadyExists", userAlreadyExists);

		if (userAlreadyExists) {
			return res.status(400).json({ success: false, message: "User already exists" });
		}

		const hashedPassword = await bcryptjs.hash(password, 10);
		const verificationToken = Math.floor(100000 + Math.random() * 900000).toString();

		const user = new User({
			email,
			password: hashedPassword,
			name,
			verificationToken,
			verificationTokenExpiresAt: Date.now() + 24 * 60 * 60 * 1000, // 24 hours
			permissions: ["create_listings", "propose_exchanges"] // Default base permissions
		});

		await user.save();

		// jwt
		const { accessToken, refreshToken } = generateTokenAndSetCookie(res, user._id);
		user.refreshToken = refreshToken;
		await user.save();

		let emailSent = false;
		try {
			emailSent = await sendVerificationEmail(user.email, verificationToken);
		} catch (err) {
			console.error("Verification email failed", err);
		}

		const responseMessage = emailSent
			? "User created successfully"
			: "User created successfully (verification email failed; please re-send verification email from your profile)";

		res.status(201).json({
			success: true,
			message: responseMessage,
			accessToken,
			user: {
				...user._doc,
				password: undefined,
				refreshToken: undefined,
			},
		});
	} catch (error) {
		res.status(400).json({ success: false, message: error.message });
	}
};

export const verifyEmail = async (req, res) => {
	const { code } = req.body;
	try {
		const user = await User.findOne({
			verificationToken: code,
			verificationTokenExpiresAt: { $gt: Date.now() },
		});

		if (!user) {
			return res.status(400).json({ success: false, message: "Invalid or expired verification code" });
		}

		user.isVerified = true;
		user.verificationToken = undefined;
		user.verificationTokenExpiresAt = undefined;
		await user.save();

		try {
			await sendWelcomeEmail(user.email, user.name);
		} catch (err) {
			console.error("Welcome email failed: ", err);
		}

		res.status(200).json({
			success: true,
			message: "Email verified successfully",
			user: {
				...user._doc,
				password: undefined,
			},
		});
	} catch (error) {
		console.log("error in verifyEmail ", error);
		res.status(500).json({ success: false, message: "Server error" });
	}
};

export const login = async (req, res) => {
	const { email, password } = req.body;
	try {
		const user = await User.findOne({ email });
		if (!user || user.isActive === false) {
			return res.status(400).json({ success: false, message: "Invalid credentials" });
		}
		const isPasswordValid = await bcryptjs.compare(password, user.password);
		if (!isPasswordValid) {
			return res.status(400).json({ success: false, message: "Invalid credentials" });
		}

		if (user.isBanned) {
			return res.status(403).json({ success: false, message: "Your account has been suspended. Please contact support." });
		}

		user.lastLogin = new Date();
		await user.save();

		if (user.isMfaEnabled) {
			return res.status(200).json({
				success: true,
				mfaRequired: true,
				message: "MFA verification required",
				email: user.email // Client will use this for validateMFALogin
			});
		}

		const { accessToken, refreshToken } = generateTokenAndSetCookie(res, user._id);
		user.refreshToken = refreshToken;
		await user.save();

		res.status(200).json({
			success: true,
			message: "Logged in successfully",
			accessToken,
			user: {
				...user._doc,
				password: undefined,
				refreshToken: undefined,
			},
		});
	} catch (error) {
		console.log("Error in login ", error);
		res.status(400).json({ success: false, message: error.message });
	}
};

export const logout = async (req, res) => {
	const refreshToken = req.cookies.refreshToken;
	if (refreshToken) {
		const user = await User.findOne({ refreshToken });
		if (user) {
			user.refreshToken = undefined;
			await user.save();
		}
	}
	res.clearCookie("token");
	res.clearCookie("refreshToken");
	res.status(200).json({ success: true, message: "Logged out successfully" });
};

export const forgotPassword = async (req, res) => {
	const { email } = req.body;
	try {
		const user = await User.findOne({ email });

		if (!user) {
			return res.status(400).json({ success: false, message: "User not found" });
		}

		// Generate reset token
		const resetToken = crypto.randomBytes(20).toString("hex");
		const resetTokenExpiresAt = Date.now() + 1 * 60 * 60 * 1000; // 1 hour

		user.resetPasswordToken = resetToken;
		user.resetPasswordExpiresAt = resetTokenExpiresAt;

		await user.save();

		// send email
		await sendPasswordResetEmail(user.email, `${process.env.CLIENT_URL}/reset-password/${resetToken}`);

		res.status(200).json({ success: true, message: "Password reset link sent to your email" });
	} catch (error) {
		console.log("Error in forgotPassword ", error);
		res.status(400).json({ success: false, message: error.message });
	}
};

export const resetPassword = async (req, res) => {
	try {
		const { token } = req.params;
		const { password } = req.body;

		const user = await User.findOne({
			resetPasswordToken: token,
			resetPasswordExpiresAt: { $gt: Date.now() },
		});

		if (!user) {
			return res.status(400).json({ success: false, message: "Invalid or expired reset token" });
		}

		// update password
		const hashedPassword = await bcryptjs.hash(password, 10);

		user.password = hashedPassword;
		user.resetPasswordToken = undefined;
		user.resetPasswordExpiresAt = undefined;
		await user.save();

		try {
			await sendResetSuccessEmail(user.email);
		} catch (err) {
			console.error("Reset success email failed: ", err);
		}

		res.status(200).json({ success: true, message: "Password reset successful" });
	} catch (error) {
		console.log("Error in resetPassword ", error);
		res.status(400).json({ success: false, message: error.message });
	}
};

export const checkAuth = async (req, res) => {
	try {
		const user = await User.findById(req.userId).select("-password");
		if (!user) {
			return res.status(400).json({ success: false, message: "User not found" });
		}

		if (user.isBanned) {
			return res.status(403).json({ success: false, message: "Account suspended" });
		}

		res.status(200).json({ success: true, user });
	} catch (error) {
		console.log("Error in checkAuth ", error);
		res.status(400).json({ success: false, message: error.message });
	}
};

export const requestRoleVerification = async (req, res) => {
	try {
		const { userType, expertise, documents } = req.body;
		const user = await User.findById(req.userId);

		if (!user) return res.status(404).json({ success: false, message: "User not found" });

		// Update user fields for review
		user.userType = userType || user.userType; // 'garage', 'repair-shop', 'recycler', or 'technician' (expertise only)
		if (expertise) user.expertise = expertise;
		if (documents && Array.isArray(documents)) {
			user.verificationDocs = documents;
		}

		user.roleStatus = "pending";
		await user.save();

		res.status(200).json({
			success: true,
			message: "Verification request submitted successfully. An admin will review it soon.",
			user
		});
	} catch (error) {
		console.log("Error in requestRoleVerification ", error);
		res.status(500).json({ success: false, message: "Server error" });
	}
};

export const refreshToken = async (req, res) => {
	const cookieRefreshToken = req.cookies.refreshToken;

	if (!cookieRefreshToken) {
		return res.status(401).json({ success: false, message: "Refresh token not found" });
	}

	try {
		const decoded = jwt.verify(cookieRefreshToken, process.env.JWT_REFRESH_SECRET || "refresh_secret_123");
		const user = await User.findById(decoded.userId);

		if (!user || user.refreshToken !== cookieRefreshToken) {
			return res.status(403).json({ success: false, message: "Invalid refresh token" });
		}

		// Generate new pair
		const { accessToken, refreshToken: newRefreshToken } = generateTokenAndSetCookie(res, user._id);
		
		user.refreshToken = newRefreshToken;
		await user.save();

		res.status(200).json({ success: true, accessToken });
	} catch (error) {
		console.log("Error in refreshToken ", error);
		res.status(403).json({ success: false, message: "Invalid or expired refresh token" });
	}
};

// --- MFA Logic ---

export const setupMFA = async (req, res) => {
	try {
		const user = await User.findById(req.userId);
		if (!user) return res.status(404).json({ success: false, message: "User not found" });

		const secret = generateSecret();
		const otpauth = generateURI({ label: user.email, issuer: "SpareXChange", secret });
		const qrCodeUrl = await qrcode.toDataURL(otpauth);

		// Store secret temporarily (encrypted or as-is for setup)
		user.mfaSecret = secret;
		await user.save();

		const backupCodes = Array.from({ length: 5 }, () => crypto.randomBytes(4).toString("hex"));
		user.mfaBackupCodes = backupOfBackupCodes(backupCodes); // We'll hash these if we were ultra-secure

		res.status(200).json({
			success: true,
			qrCodeUrl,
			secret,
			backupCodes
		});
	} catch (error) {
		console.error("Error in setupMFA:", error);
		res.status(500).json({ success: false, message: "Server error" });
	}
};

function backupOfBackupCodes(codes) {
	// Simple storage for now, ideally hashed
	return codes;
}

export const verifyMFA = async (req, res) => {
	try {
		const { code } = req.body;
		const user = await User.findById(req.userId);
		if (!user || !user.mfaSecret) {
			return res.status(400).json({ success: false, message: "MFA setup not initiated" });
		}

		const isValid = verify({ token: code, secret: user.mfaSecret });
		if (!isValid) {
			return res.status(400).json({ success: false, message: "Invalid verification code" });
		}

		user.isMfaEnabled = true;
		await user.save();

		res.status(200).json({ success: true, message: "MFA enabled successfully" });
	} catch (error) {
		console.error("Error in verifyMFA:", error);
		res.status(500).json({ success: false, message: "Server error" });
	}
};

export const validateMFALogin = async (req, res) => {
	try {
		const { email, code } = req.body;
		const user = await User.findOne({ email });

		if (!user || !user.isMfaEnabled) {
			return res.status(400).json({ success: false, message: "MFA not enabled or user not found" });
		}

		const isValid = verify({ token: code, secret: user.mfaSecret });
		const isBackupUsed = !isValid && user.mfaBackupCodes.includes(code);

		if (!isValid && !isBackupUsed) {
			return res.status(400).json({ success: false, message: "Invalid MFA code" });
		}

		if (isBackupUsed) {
			user.mfaBackupCodes = user.mfaBackupCodes.filter(c => c !== code);
			await user.save();
		}

		// Success -> issue tokens
		const { accessToken, refreshToken } = generateTokenAndSetCookie(res, user._id);
		user.refreshToken = refreshToken;
		await user.save();

		res.status(200).json({
			success: true,
			accessToken,
			user: { ...user._doc, password: undefined, refreshToken: undefined, mfaSecret: undefined }
		});
	} catch (error) {
		console.error("Error in validateMFALogin:", error);
		res.status(500).json({ success: false, message: "Server error" });
	}
};

// --- Mock OAuth2 Logic ---

export const googleLogin = async (req, res) => {
	try {
		const { credential } = req.body;
		if (!credential) return res.status(400).json({ success: false, message: "Credential required" });

		// In a real app, we'd use: const ticket = await client.verifyIdToken({ idToken: credential, audience: CLIENT_ID });
		// For this mock, we'll assume 'credential' is a JSON string containing { email, name, sub }
		let decoded;
		try {
			decoded = JSON.parse(credential);
		} catch (e) {
			return res.status(400).json({ success: false, message: "Invalid mock credential" });
		}

		const { email, name, sub } = decoded;
		if (!email) return res.status(400).json({ success: false, message: "Email missing from credential" });

		let user = await User.findOne({ email });

		if (!user) {
			// Create new user for first-time social login
			user = new User({
				email,
				name,
				isVerified: true, // Social accounts are trusted usually
				password: crypto.randomBytes(16).toString("hex"), // Random dummy password
				permissions: ["create_listings", "propose_exchanges"]
			});
			await user.save();
		}

		if (user.isBanned) return res.status(403).json({ success: false, message: "Account suspended" });

		const { accessToken, refreshToken } = generateTokenAndSetCookie(res, user._id);
		user.refreshToken = refreshToken;
		user.lastLogin = new Date();
		await user.save();

		res.status(200).json({
			success: true,
			accessToken,
			user: { ...user._doc, password: undefined, refreshToken: undefined }
		});
	} catch (error) {
		console.error("Error in googleLogin:", error);
		res.status(500).json({ success: false, message: "Server error" });
	}
};

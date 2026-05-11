import cloudinary from "cloudinary";
import fs from "fs";
import path from "path";
import crypto from "crypto";

// Configure Cloudinary
const cloudinaryConfigured = process.env.CLOUDINARY_CLOUD_NAME && 
                            process.env.CLOUDINARY_API_KEY && 
                            process.env.CLOUDINARY_API_SECRET;

if (cloudinaryConfigured) {
	cloudinary.v2.config({
		cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
		api_key: process.env.CLOUDINARY_API_KEY,
		api_secret: process.env.CLOUDINARY_API_SECRET,
	});
	console.log("✓ Cloudinary configured successfully");
} else {
	console.log("⚠ Cloudinary not configured - using local storage fallback");
}

/**
 * Upload image to Cloudinary with local fallback
 * @param {String} base64Data - Base64 encoded image data or URL
 * @returns {String|null} - Public URL of uploaded image
 */
export const uploadImage = async (base64Data) => {
	if (!base64Data) return null;

	// If it's already a URL, return it
	if (base64Data.startsWith("http")) return base64Data;

	// Cloudinary upload (if configured)
	if (cloudinaryConfigured) {
		try {
			const result = await cloudinary.v2.uploader.upload(base64Data, {
				folder: "sparexchange",
				resource_type: "image",
				transformation: [
					{ quality: "auto", fetch_format: "auto" }, // Optimize format and quality
					{ width: 1200, crop: "limit" }, // Resize if too large
				],
			});
			return result.secure_url;
		} catch (error) {
			console.error("Cloudinary upload failed, falling back to local:", error.message);
			// Fallback to local storage
		}
	}

	// Local storage fallback
	return uploadToLocal(base64Data);
};

/**
 * Upload image to local filesystem (fallback)
 */
const uploadToLocal = async (base64Data) => {
	if (!base64Data || !base64Data.startsWith("data:image")) {
		return null;
	}

	try {
		const base64Content = base64Data.split(";base64,").pop();
		const buffer = Buffer.from(base64Content, "base64");
		
		const filename = `${crypto.randomBytes(16).toString("hex")}.jpg`;
		const uploadsDir = path.join(path.resolve(), "backend", "uploads");
		const filePath = path.join(uploadsDir, filename);
		
		// Ensure uploads directory exists
		await fs.promises.mkdir(uploadsDir, { recursive: true });
		
		await fs.promises.writeFile(filePath, buffer);
		
		// Return the public access URL
		return `/uploads/${filename}`;
	} catch (error) {
		console.error("Local image upload failed:", error);
		return null;
	}
};

/**
 * Delete image from Cloudinary or local storage
 * @param {String} imageUrl - URL of image to delete
 */
export const deleteImage = async (imageUrl) => {
	if (!imageUrl) return;

	// Delete from Cloudinary
	if (imageUrl.includes("res.cloudinary.com")) {
		try {
			// Extract public_id from URL
			const urlParts = imageUrl.split("/");
			const filename = urlParts[urlParts.length - 1].split(".")[0];
			const publicId = `sparexchange/${filename}`;
			
			await cloudinary.v2.uploader.destroy(publicId);
		} catch (error) {
			console.error("Cloudinary delete failed:", error.message);
		}
	}
	// Delete from local storage
	else if (imageUrl.startsWith("/uploads/")) {
		try {
			const filePath = path.join(path.resolve(), "backend", imageUrl);
			if (fs.existsSync(filePath)) {
				await fs.promises.unlink(filePath);
			}
		} catch (error) {
			console.error("Local image delete failed:", error.message);
		}
	}
};

/**
 * Bulk upload images
 */
export const bulkUploadImages = async (base64Array) => {
	if (!Array.isArray(base64Array)) return [];
	const uploadPromises = base64Array.map(img => uploadImage(img));
	const results = await Promise.all(uploadPromises);
	return results.filter(url => url !== null);
};

/**
 * Optimize image URL for different contexts
 */
export const optimizeImageUrl = (url, options = {}) => {
	if (!url || !url.includes("res.cloudinary.com")) return url;

	const { width = 800, quality = "auto", format = "auto" } = options;
	
	// Add Cloudinary transformation parameters
	const transformations = `w_${width},q_${quality},f_${format}`;
	const uploadIndex = url.indexOf("/upload/");
	
	if (uploadIndex !== -1) {
		return url.replace("/upload/", `/upload/${transformations}/`);
	}
	
	return url;
};

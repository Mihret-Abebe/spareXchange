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
 * @param {String} resourceType - 'image' or 'raw' (for PDFs)
 * @returns {String|null} - Public URL of uploaded image
 */
export const uploadImage = async (base64Data, resourceType = 'image') => {
	if (!base64Data) return null;

	// If it's already a URL, return it
	if (base64Data.startsWith("http")) return base64Data;

	// Cloudinary upload (if configured)
	if (cloudinaryConfigured) {
		try {
			const isPDF = base64Data.includes("application/pdf");
			const actualResourceType = isPDF ? 'raw' : resourceType;
			
			const uploadOptions = {
				folder: "sparexchange/verifications",
				resource_type: actualResourceType,
			};

			// Add image-specific transformations
			if (actualResourceType === 'image') {
				uploadOptions.transformation = [
					{ quality: "auto", fetch_format: "auto" },
					{ width: 1200, crop: "limit" },
				];
			}

			const result = await cloudinary.v2.uploader.upload(base64Data, uploadOptions);
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
 * Upload document (PDF or image) to Cloudinary
 * Specifically for verification documents
 * @param {Buffer} fileBuffer - File buffer from multer
 * @param {String} mimetype - File MIME type
 * @param {String} originalName - Original filename
 * @returns {String|null} - Public URL of uploaded document
 */
export const uploadVerificationDocument = async (fileBuffer, mimetype, originalName) => {
	if (!fileBuffer) return null;

	try {
		// Convert buffer to base64
		const base64Data = `data:${mimetype};base64,${fileBuffer.toString('base64')}`;
		
		// Determine if it's a PDF or image
		const isPDF = mimetype === 'application/pdf';
		const resourceType = isPDF ? 'raw' : 'image';
		
		if (cloudinaryConfigured) {
			try {
				const uploadOptions = {
					folder: "sparexchange/verifications",
					resource_type: resourceType,
					public_id: `doc_${Date.now()}_${originalName.split('.')[0]}`,
				};

				// For images, add optimization
				if (!isPDF) {
					uploadOptions.transformation = [
						{ quality: "auto", fetch_format: "auto" },
						{ width: 1200, crop: "limit" },
					];
				}

				const result = await cloudinary.v2.uploader.upload(base64Data, uploadOptions);
				console.log(`✓ Document uploaded to Cloudinary: ${result.secure_url}`);
				return result.secure_url;
			} catch (error) {
				console.error("Cloudinary document upload failed:", error.message);
				throw error;
			}
		} else {
			// Fallback to local storage
			console.log("⚠ Cloudinary not configured, using local storage fallback");
			return uploadToLocal(base64Data);
		}
	} catch (error) {
		console.error("Document upload failed:", error);
		return null;
	}
};

/**
 * Bulk upload verification documents
 * @param {Array} files - Array of file objects from multer
 * @returns {Array} - Array of uploaded document URLs
 */
export const bulkUploadVerificationDocs = async (files) => {
	if (!Array.isArray(files) || files.length === 0) return [];
	
	const uploadPromises = files.map(file => 
		uploadVerificationDocument(file.buffer, file.mimetype, file.originalname)
	);
	
	const results = await Promise.all(uploadPromises);
	return results.filter(url => url !== null);
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

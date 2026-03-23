import fs from "fs";
import path from "path";
import crypto from "crypto";

/**
 * Mocks a cloud image upload service.
 * In a real app, this would use Cloudinary, S3, etc.
 * For this implementation, it saves base64 data to local /uploads.
 */
export const uploadImage = async (base64Data) => {
	if (!base64Data || !base64Data.startsWith("data:image")) {
		// If it's already a URL, return it
		if (base64Data && base64Data.startsWith("http")) return base64Data;
		return null;
	}

	try {
		const base64Content = base64Data.split(";base64,").pop();
		const buffer = Buffer.from(base64Content, "base64");
		
		const filename = `${crypto.randomBytes(16).toString("hex")}.jpg`;
		const filePath = path.join(path.resolve(), "backend", "uploads", filename);
		
		await fs.promises.writeFile(filePath, buffer);
		
		// Return the public access URL
		// In a real cloud setup, this would be https://cloudinary.com/...
		return `/uploads/${filename}`;
	} catch (error) {
		console.error("Image upload failed:", error);
		return null;
	}
};

export const bulkUploadImages = async (base64Array) => {
	if (!Array.isArray(base64Array)) return [];
	const uploadPromises = base64Array.map(img => uploadImage(img));
	const results = await Promise.all(uploadPromises);
	return results.filter(url => url !== null);
};

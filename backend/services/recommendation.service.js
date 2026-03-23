import { Listing } from "../models/listing.model.js";
import { SearchLog } from "../models/searchLog.model.js";

export const getRecommendations = async (userId) => {
	try {
		// 1. Get user's recent search history
		const userLogs = await SearchLog.find({ userId })
			.sort({ createdAt: -1 })
			.limit(10);

		if (userLogs.length === 0) {
			// Fallback: return most viewed or newest active listings
			return await Listing.find({ available: true, isActive: true })
				.sort({ views: -1 })
				.limit(6)
				.populate("seller", "name profilePicture verifiedSeller");
		}

		// 2. Extract unique categories and brands from logs
		const categories = [...new Set(userLogs.map(log => log.filters?.category).filter(Boolean))];
		const brands = [...new Set(userLogs.map(log => log.filters?.brand).filter(Boolean))];
		const models = [...new Set(userLogs.map(log => log.filters?.model).filter(Boolean))];

		// 3. Find listings that match these categories or brands/models
		const query = {
			userId: { $ne: userId }, // Don't recommend own listings
			available: true,
			isActive: true,
			$or: [
				{ category: { $in: categories } },
				{ brand: { $in: brands } },
				{ model: { $in: models } },
				{ "compatibleVehicles.brand": { $in: brands } },
				{ "compatibleVehicles.model": { $in: models } }
			]
		};

		const recommendedListings = await Listing.find(query)
			.sort({ createdAt: -1 })
			.limit(10)
			.populate("seller", "name profilePicture verifiedSeller");

		return recommendedListings;
	} catch (error) {
		console.error("Error in getRecommendations logic:", error);
		return [];
	}
};

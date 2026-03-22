import { User } from "../models/user.model.js";
import { Notification } from "../models/notification.model.js";

/**
 * Scans for users who might be interested in a new listing
 * based on their interests and proximity.
 */
export const scanMatches = async (listing) => {
	try {
		const { category, brand, model, locationCoords, seller, _id: listingId } = listing;

		// 1. Find users who match criteria
		// - Not the seller
		// - Match category or brand in their interests
		// - Within 50km (50000 meters)
		const matchedUsers = await User.find({
			_id: { $ne: seller },
			$or: [
				{ interests: { $in: [category, brand] } },
				{ interests: { $regex: new RegExp(category, "i") } } // simple fuzzy match
			],
			locationCoords: {
				$near: {
					$geometry: locationCoords,
					$maxDistance: 50000 // 50km in meters
				}
			}
		}).select("_id name");

		console.log(`Found ${matchedUsers.length} matches for listing ${listingId}`);

		// 2. Create notifications for each matched user
		const notificationPromises = matchedUsers.map(user => {
			const newNotification = new Notification({
				userId: user._id,
				type: "match",
				title: "New Spare Part Match!",
				message: `A new ${brand || ""} ${category} was posted near you.`,
				link: `/listings/${listingId}`,
				relatedId: listingId,
				relatedModel: "Listing"
			});
			return newNotification.save();
		});

		await Promise.all(notificationPromises);

	} catch (error) {
		console.error("Error in scanMatches service:", error);
	}
};

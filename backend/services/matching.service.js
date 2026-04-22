import { User } from "../models/user.model.js";
import { Notification } from "../models/notification.model.js";
import { emitToUser } from "../utils/socket.js";

/**
 * Scans for users who might be interested in a new listing
 * based on their interests and proximity.
 */
export const scanMatches = async (listing) => {
	try {
		const { category, brand, model, locationCoords, seller, _id: listingId } = listing;

		// 1. Find users who match criteria
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
			emitToUser(user._id.toString(), "new_notification", newNotification);
			return newNotification.save();
		});

		await Promise.all(notificationPromises);

	} catch (error) {
		console.error("Error in scanMatches service:", error);
	}
};

/**
 * Scans for technicians whose expertise matches a new service request
 * and are within the specified proximity.
 */
export const scanTechnicianMatches = async (technicianRequest) => {
	try {
		const { serviceType, locationCoords, userId: customerId, _id: requestId } = technicianRequest;

		// 1. Find verified technicians with matching expertise within 50km
		const matchedTechnicians = await User.find({
			_id: { $ne: customerId },
			userType: "technician",
			roleStatus: "verified",
			expertise: { $regex: new RegExp(serviceType, "i") }, // match expertise to serviceType
			locationCoords: {
				$near: {
					$geometry: locationCoords,
					$maxDistance: 75000 // 75km range for services
				}
			}
		}).select("_id name");

		console.log(`Found ${matchedTechnicians.length} technicians for request ${requestId}`);

		// 2. Create notifications and emit real-time alerts
		const notificationPromises = matchedTechnicians.map(tech => {
			const newNotification = new Notification({
				userId: tech._id,
				type: "technician-request",
				title: "New Service Request Proximity!",
				message: `A new ${serviceType} request was posted near you. Send a quote now!`,
				link: `/technician-requests/${requestId}`,
				relatedId: requestId,
				relatedModel: "TechnicianRequest"
			});
			emitToUser(tech._id.toString(), "new_notification", newNotification);
			return newNotification.save();
		});

		await Promise.all(notificationPromises);

	} catch (error) {
		console.error("Error in scanTechnicianMatches service:", error);
	}
};

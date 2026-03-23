import { Exchange } from "../models/exchange.model.js";
import { User } from "../models/user.model.js";
import { Listing } from "../models/listing.model.js";
import { emitToUser } from "../utils/socket.js";
import { EcoPointTransaction } from "../models/ecoPointTransaction.model.js";

export const proposeExchange = async (req, res) => {
	try {
		const { listingId, offeredItems, meetingLocation, meetingTime, lastMessageId } = req.body;
		const buyerId = req.userId;

		const listing = await Listing.findById(listingId);
		if (!listing) return res.status(404).json({ success: false, message: "Listing not found" });

		const newExchange = new Exchange({
			buyerId,
			sellerId: listing.seller,
			listingId,
			offeredItems,
			meetingDetails: {
				location: meetingLocation,
				time: meetingTime,
			},
			lastMessage: lastMessageId,
		});

		await newExchange.save();
		res.status(201).json({ success: true, message: "Exchange proposed successfully", data: newExchange });
	} catch (error) {
		console.error("Error in proposeExchange: ", error);
		res.status(500).json({ success: false, message: "Server error" });
	}
};

export const negotiateExchange = async (req, res) => {
	try {
		const { id } = req.params;
		const { negotiationNotes, meetingLocation, meetingTime, lastMessageId } = req.body;
		const userId = req.userId;

		const exchange = await Exchange.findById(id);
		if (!exchange) return res.status(404).json({ success: false, message: "Exchange not found" });

		if (exchange.buyerId.toString() !== userId && exchange.sellerId.toString() !== userId) {
			return res.status(403).json({ success: false, message: "Not authorized" });
		}

		if (negotiationNotes) exchange.negotiationNotes = negotiationNotes;
		if (meetingLocation) exchange.meetingDetails.location = meetingLocation;
		if (meetingTime) exchange.meetingDetails.time = meetingTime;
		if (lastMessageId) exchange.lastMessage = lastMessageId;

		await exchange.save();
		res.status(200).json({ success: true, message: "Exchange details updated", data: exchange });
	} catch (error) {
		console.error("Error in negotiateExchange: ", error);
		res.status(500).json({ success: false, message: "Server error" });
	}
};

export const updateExchangeStatus = async (req, res) => {
	try {
		const { id } = req.params;
		const { status } = req.body; // accepted, rejected, cancelled
		const userId = req.userId;

		const exchange = await Exchange.findById(id);
		if (!exchange) return res.status(404).json({ success: false, message: "Exchange not found" });

		// Verify user is part of the exchange
		if (exchange.buyerId.toString() !== userId && exchange.sellerId.toString() !== userId) {
			return res.status(403).json({ success: false, message: "Not authorized" });
		}

		exchange.status = status;
		await exchange.save();

		res.status(200).json({ success: true, message: `Exchange ${status}`, data: exchange });
	} catch (error) {
		console.error("Error in updateExchangeStatus: ", error);
		res.status(500).json({ success: false, message: "Server error" });
	}
};

export const completeExchange = async (req, res) => {
	try {
		const { id } = req.params;
		const userId = req.userId;

		const exchange = await Exchange.findById(id);
		if (!exchange) return res.status(404).json({ success: false, message: "Exchange not found" });

		if (exchange.status !== "accepted" && exchange.status !== "completed_by_buyer" && exchange.status !== "completed_by_seller") {
			return res.status(400).json({ success: false, message: "Exchange must be accepted first or is already fully completed" });
		}

		let newStatus = exchange.status;
		
		if (exchange.buyerId.toString() === userId) {
			newStatus = exchange.status === "completed_by_seller" ? "fully_completed" : "completed_by_buyer";
		} else if (exchange.sellerId.toString() === userId) {
			newStatus = exchange.status === "completed_by_buyer" ? "fully_completed" : "completed_by_seller";
		} else {
			return res.status(403).json({ success: false, message: "Not authorized" });
		}

		exchange.status = newStatus;
		await exchange.save();

		// If fully completed, award Eco Points and check achievements
		if (newStatus === "fully_completed") {
			const rewardPoints = 50; // Points per successful exchange

			const buyer = await User.findById(exchange.buyerId);
			const seller = await User.findById(exchange.sellerId);

			if (!buyer || !seller) {
				console.error("Error: Buyer or Seller not found for completed exchange.");
				return res.status(500).json({ success: false, message: "Server error: User data missing" });
			}

			// Update seller stats and achievements
			seller.ecoPoints += rewardPoints;
			if (!seller.achievements.includes("First Successful Exchange")) {
				seller.achievements.push("First Successful Exchange");
			}
			await seller.save();

			// Update buyer stats and achievements
			buyer.ecoPoints += rewardPoints;
			if (!buyer.achievements.includes("First Successful Exchange")) {
				buyer.achievements.push("First Successful Exchange");
			}
			await buyer.save();

			// Create Ledger entries
			const transactions = [
				{ userId: exchange.buyerId, points: rewardPoints, reason: "exchange", description: `Completed exchange for listing ${exchange.listingId}`, referenceId: exchange._id },
				{ userId: exchange.sellerId, points: rewardPoints, reason: "exchange", description: `Completed exchange for listing ${exchange.listingId}`, referenceId: exchange._id }
			];
			await EcoPointTransaction.insertMany(transactions);
            
            // Mark listing as unavailable
            await Listing.findByIdAndUpdate(exchange.listingId, { available: false });
		}

		res.status(200).json({ success: true, message: "Exchange completion updated", data: exchange });
	} catch (error) {
		console.error("Error in completeExchange: ", error);
		res.status(500).json({ success: false, message: "Server error" });
	}
};

export const getUserExchanges = async (req, res) => {
	try {
		const userId = req.userId;
		const exchanges = await Exchange.find({
			$or: [{ buyerId: userId }, { sellerId: userId }]
		})
        .sort({ createdAt: -1 })
        .populate("buyerId", "name profilePicture")
        .populate("sellerId", "name profilePicture")
        .populate("listingId", "title images price");

		res.status(200).json({ success: true, data: exchanges });
	} catch (error) {
		console.error("Error in getUserExchanges: ", error);
		res.status(500).json({ success: false, message: "Server error" });
	}
};

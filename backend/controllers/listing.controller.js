import { Listing } from "../models/listing.model.js";
import { User } from "../models/user.model.js";
import { SearchLog } from "../models/searchLog.model.js";
import { EcoPointTransaction } from "../models/ecoPointTransaction.model.js";
import { scanMatches } from "../services/matching.service.js";

// Create a new listing
export const createListing = async (req, res) => {
	try {
		const { title, description, price, category, condition, location, images, contactInfo, specifications } = req.body;

		const user = await User.findById(req.userId);
		if (!user || user.status === "banned") return res.status(403).json({ success: false, message: "Forbidden" });

		// Only verified users or technicians can post spare parts
		if (user.userType !== "technician" && user.roleStatus !== "verified") {
			return res.status(403).json({ success: false, message: "Only verified users or technicians can post spare parts" });
		}

		// Validate required fields
		if (!title || !description || !price || !category || !condition || !location) {
			return res.status(400).json({ success: false, message: "All required fields must be filled" });
		}

		const newListing = new Listing({
			title,
			description,
			price,
			category,
			condition,
			location,
			images: images || [],
			seller: req.userId, // from middleware
			contactInfo,
			specifications,
		});

		const savedListing = await newListing.save();

		// Award 10 eco-points for posting (according to SRS)
		try {
			user.ecoPoints += 10;
			if (!user.achievements.includes("First Listing Posted")) {
				user.achievements.push("First Listing Posted");
			}
			await user.save();

			// Log transaction
			const transaction = new EcoPointTransaction({
				userId: user._id,
				points: 10,
				reason: "posting",
				description: `Awarded 10 points for posting listing: ${savedListing.title}`,
				referenceId: savedListing._id
			});
			await transaction.save();
		} catch (pointError) {
			console.error("Failed to award points for listing:", pointError);
		}

		// Trigger automated matching engine (async, don't block response)
		scanMatches(savedListing);

		res.status(201).json({
			success: true,
			message: "Listing created successfully",
			listing: savedListing,
		});
	} catch (error) {
		console.error("Error in createListing:", error);
		res.status(500).json({ success: false, message: "Server error" });
	}
};

// Get all listings with optional filters
export const getListings = async (req, res) => {
	try {
		const { category, condition, minPrice, maxPrice, location, search, sort } = req.query;

		// Build query object
		const query = { available: true, isActive: true }; // Only show available and active listings

		if (category) query.category = category;
		if (condition) query.condition = condition;
		if (location) query.location = { $regex: location, $options: "i" }; // case-insensitive
		if (search) query.title = { $regex: search, $options: "i" }; // case-insensitive

		// Advanced Filtering: Brand, Model, Year
		const { brand, model, year, latitude, longitude, radius } = req.query;
		if (brand) query.brand = brand;
		if (model) query.model = model;
		if (year) query.year = Number(year);

		// Proximity Search (GeoJSON)
		if (latitude && longitude) {
			query.locationCoords = {
				$near: {
					$geometry: {
						type: "Point",
						coordinates: [Number(longitude), Number(latitude)],
					},
					$maxDistance: (Number(radius) || 50) * 1000, // Default 50km
				},
			};
		}

		// Price range filter
		if (minPrice || maxPrice) {
			query.price = {};
			if (minPrice) query.price.$gte = Number(minPrice);
			if (maxPrice) query.price.$lte = Number(maxPrice);
		}

		// Sorting
		let sortOption = "-createdAt"; // default: newest first
		if (sort === "price-asc") sortOption = "price";
		if (sort === "price-desc") sortOption = "-price";
		if (sort === "oldest") sortOption = "createdAt";

		const listings = await Listing.find(query)
			.populate("seller", "name profilePicture verifiedSeller ecoPoints") // populate seller info
			.sort(sortOption);

		// Log search if search or category or location filters are used
		if (search || category || location) {
			try {
				const log = new SearchLog({
					userId: req.userId || null,
					query: search,
					filters: { category, condition, minPrice, maxPrice, location },
					resultsCount: listings.length,
				});
				await log.save();
			} catch (logError) {
				console.error("Failed to log search:", logError);
			}
		}

		res.status(200).json({
			success: true,
			count: listings.length,
			listings,
		});
	} catch (error) {
		console.error("Error in getListings:", error);
		res.status(500).json({ success: false, message: "Server error" });
	}
};

// Get a single listing by ID
export const getListing = async (req, res) => {
	try {
		const { id } = req.params;

		const listing = await Listing.findOne({ _id: id, isActive: true })
			.populate("seller", "name profilePicture verifiedSeller ecoPoints location phone");

		if (!listing) {
			return res.status(404).json({ success: false, message: "Listing not found" });
		}

		// Increment view count
		listing.views += 1;
		await listing.save();

		res.status(200).json({
			success: true,
			listing,
		});
	} catch (error) {
		console.error("Error in getListing:", error);
		res.status(500).json({ success: false, message: "Server error" });
	}
};

// Update a listing
export const updateListing = async (req, res) => {
	try {
		const { id } = req.params;
		const { title, description, price, category, condition, location, images, contactInfo, specifications, available } = req.body;

		const listing = await Listing.findById(id);

		if (!listing) {
			return res.status(404).json({ success: false, message: "Listing not found" });
		}

		// Check if the user is the owner of the listing
		if (listing.seller.toString() !== req.userId) {
			return res.status(403).json({ success: false, message: "Not authorized to update this listing" });
		}

		const updatedListing = await Listing.findByIdAndUpdate(
			id,
			{
				title,
				description,
				price,
				category,
				condition,
				location,
				images: images || listing.images,
				contactInfo,
				specifications,
				available,
			},
			{ new: true } // return updated document
		).populate("seller", "name profilePicture verifiedSeller");

		res.status(200).json({
			success: true,
			message: "Listing updated successfully",
			listing: updatedListing,
		});
	} catch (error) {
		console.error("Error in updateListing:", error);
		res.status(500).json({ success: false, message: "Server error" });
	}
};

// Delete a listing
export const deleteListing = async (req, res) => {
	try {
		const { id } = req.params;

		const listing = await Listing.findById(id);

		if (!listing) {
			return res.status(404).json({ success: false, message: "Listing not found" });
		}

		// Check if the user is the owner of the listing
		if (listing.seller.toString() !== req.userId) {
			return res.status(403).json({ success: false, message: "Not authorized to delete this listing" });
		}

		listing.isActive = false;
		await listing.save();

		res.status(200).json({
			success: true,
			message: "Listing deleted successfully",
		});
	} catch (error) {
		console.error("Error in deleteListing:", error);
		res.status(500).json({ success: false, message: "Server error" });
	}
};

// Get listings by current user
export const getUserListings = async (req, res) => {
	try {
		const listings = await Listing.find({ seller: req.userId, isActive: true })
			.sort({ createdAt: -1 }); // newest first

		res.status(200).json({
			success: true,
			count: listings.length,
			listings,
		});
	} catch (error) {
		console.error("Error in getUserListings:", error);
		res.status(500).json({ success: false, message: "Server error" });
	}
};

// Toggle listing availability
export const toggleListingAvailability = async (req, res) => {
	try {
		const { id } = req.params;

		const listing = await Listing.findById(id);

		if (!listing) {
			return res.status(404).json({ success: false, message: "Listing not found" });
		}

		// Check if the user is the owner of the listing
		if (listing.seller.toString() !== req.userId) {
			return res.status(403).json({ success: false, message: "Not authorized to update this listing" });
		}

		listing.available = !listing.available;
		await listing.save();

		res.status(200).json({
			success: true,
			message: `Listing marked as ${listing.available ? "available" : "unavailable"}`,
			available: listing.available,
		});
	} catch (error) {
		console.error("Error in toggleListingAvailability:", error);
		res.status(500).json({ success: false, message: "Server error" });
	}
};
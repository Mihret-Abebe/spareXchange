import { TechnicianRequest } from "../models/technicianRequest.model.js";

// Create a new technician request
export const createTechnicianRequest = async (req, res) => {
	try {
		const { serviceType, description, location, contactInfo, priority, images } = req.body;

		// Validate required fields
		if (!serviceType || !description || !location) {
			return res.status(400).json({ success: false, message: "Service type, description, and location are required" });
		}

		const newRequest = new TechnicianRequest({
			userId: req.userId, // from middleware
			serviceType,
			description,
			location,
			contactInfo,
			priority: priority || "medium",
			images: images || [],
		});

		const savedRequest = await newRequest.save();

		res.status(201).json({
			success: true,
			message: "Technician request created successfully",
			request: savedRequest,
		});
	} catch (error) {
		console.error("Error in createTechnicianRequest:", error);
		res.status(500).json({ success: false, message: "Server error" });
	}
};

// Get all technician requests for a user
export const getUserTechnicianRequests = async (req, res) => {
	try {
		const requests = await TechnicianRequest.find({ userId: req.userId })
			.sort({ createdAt: -1 }); // newest first

		res.status(200).json({
			success: true,
			count: requests.length,
			requests,
		});
	} catch (error) {
		console.error("Error in getUserTechnicianRequests:", error);
		res.status(500).json({ success: false, message: "Server error" });
	}
};

// Get all technician requests (for admin/technicians)
export const getAllTechnicianRequests = async (req, res) => {
	try {
		const { status, serviceType, priority } = req.query;

		// Build query object
		const query = {};
		if (status) query.status = status;
		if (serviceType) query.serviceType = serviceType;
		if (priority) query.priority = priority;

		const requests = await TechnicianRequest.find(query)
			.populate("userId", "name profilePicture location phone")
			.sort({ createdAt: -1 });

		res.status(200).json({
			success: true,
			count: requests.length,
			requests,
		});
	} catch (error) {
		console.error("Error in getAllTechnicianRequests:", error);
		res.status(500).json({ success: false, message: "Server error" });
	}
};

// Get a single technician request
export const getTechnicianRequest = async (req, res) => {
	try {
		const { id } = req.params;

		const request = await TechnicianRequest.findById(id)
			.populate("userId", "name profilePicture location phone")
			.populate("assignedTechnician", "name profilePicture location phone");

		if (!request) {
			return res.status(404).json({ success: false, message: "Request not found" });
		}

		// Check if the user is the owner of the request or is an admin/technician
		if (request.userId.toString() !== req.userId) {
			// Additional checks for admin/technician access could go here
		}

		res.status(200).json({
			success: true,
			request,
		});
	} catch (error) {
		console.error("Error in getTechnicianRequest:", error);
		res.status(500).json({ success: false, message: "Server error" });
	}
};

// Update a technician request
export const updateTechnicianRequest = async (req, res) => {
	try {
		const { id } = req.params;
		const { description, location, contactInfo, priority, status, estimatedCost } = req.body;

		const request = await TechnicianRequest.findById(id);

		if (!request) {
			return res.status(404).json({ success: false, message: "Request not found" });
		}

		// Check if the user is the owner of the request
		if (request.userId.toString() !== req.userId) {
			return res.status(403).json({ success: false, message: "Not authorized to update this request" });
		}

		// Only allow updating certain fields for the owner
		const updatedRequest = await TechnicianRequest.findByIdAndUpdate(
			id,
			{
				description: description || request.description,
				location: location || request.location,
				contactInfo: contactInfo || request.contactInfo,
				priority: priority || request.priority,
				status: status || request.status,
				estimatedCost: estimatedCost || request.estimatedCost,
			},
			{ new: true } // return updated document
		).populate("userId", "name profilePicture");

		res.status(200).json({
			success: true,
			message: "Request updated successfully",
			request: updatedRequest,
		});
	} catch (error) {
		console.error("Error in updateTechnicianRequest:", error);
		res.status(500).json({ success: false, message: "Server error" });
	}
};

// Assign a technician to a request (for admin/technician)
export const assignTechnician = async (req, res) => {
	try {
		const { id } = req.params;
		const { technicianId } = req.body;

		const request = await TechnicianRequest.findById(id);

		if (!request) {
			return res.status(404).json({ success: false, message: "Request not found" });
		}

		// Update the assigned technician
		request.assignedTechnician = technicianId;
		request.status = "in-progress";
		await request.save();

		// Populate the updated request for response
		const updatedRequest = await TechnicianRequest.findById(request._id)
			.populate("userId", "name profilePicture")
			.populate("assignedTechnician", "name profilePicture");

		res.status(200).json({
			success: true,
			message: "Technician assigned successfully",
			request: updatedRequest,
		});
	} catch (error) {
		console.error("Error in assignTechnician:", error);
		res.status(500).json({ success: false, message: "Server error" });
	}
};

// Complete a technician request
export const completeTechnicianRequest = async (req, res) => {
	try {
		const { id } = req.params;

		const request = await TechnicianRequest.findById(id);

		if (!request) {
			return res.status(404).json({ success: false, message: "Request not found" });
		}

		// Check if the user is the assigned technician or the owner
		if (request.assignedTechnician.toString() !== req.userId && request.userId.toString() !== req.userId) {
			return res.status(403).json({ success: false, message: "Not authorized to complete this request" });
		}

		request.status = "completed";
		await request.save();

		res.status(200).json({
			success: true,
			message: "Request completed successfully",
		});
	} catch (error) {
		console.error("Error in completeTechnicianRequest:", error);
		res.status(500).json({ success: false, message: "Server error" });
	}
};

// Cancel a technician request
export const cancelTechnicianRequest = async (req, res) => {
	try {
		const { id } = req.params;

		const request = await TechnicianRequest.findById(id);

		if (!request) {
			return res.status(404).json({ success: false, message: "Request not found" });
		}

		// Check if the user is the owner of the request
		if (request.userId.toString() !== req.userId) {
			return res.status(403).json({ success: false, message: "Not authorized to cancel this request" });
		}

		request.status = "cancelled";
		await request.save();

		res.status(200).json({
			success: true,
			message: "Request cancelled successfully",
		});
	} catch (error) {
		console.error("Error in cancelTechnicianRequest:", error);
		res.status(500).json({ success: false, message: "Server error" });
	}
};
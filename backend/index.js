import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import path from "path";
import http from "http";
import { initSocket } from "./utils/socket.js";

import { connectDB } from "./db/connectDB.js";
import { startExpiryCron } from "./services/cron.service.js";

import authRoutes from "./routes/auth.route.js";
import listingRoutes from "./routes/listing.route.js";
import technicianRequestRoutes from "./routes/technicianRequest.route.js";
import recyclingSubmissionRoutes from "./routes/recyclingSubmission.v2.route.js";
import notificationRoutes from "./routes/notification.route.js";
import messageRoutes from "./routes/message.route.js";
import exchangeRoutes from "./routes/exchange.route.js";
import reviewRoutes from "./routes/review.route.js";
import adminRoutes from "./routes/admin.route.js";
import userRoutes from "./routes/user.route.js";
import disputeRoutes from "./routes/dispute.route.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const __dirname = path.resolve();

app.use(cors({ origin: "http://localhost:5173", credentials: true }));

app.use(express.json()); // allows us to parse incoming requests:req.body
app.use(cookieParser()); // allows us to parse incoming cookies

app.use("/uploads", express.static(path.join(path.resolve(), "uploads")));

app.use("/api/auth", authRoutes);
app.use("/api/listings", listingRoutes);
app.use("/api/technician-requests", technicianRequestRoutes);
app.use("/api/recycling-submissions", recyclingSubmissionRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/exchanges", exchangeRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/users", userRoutes);
app.use("/api/disputes", disputeRoutes);

if (process.env.NODE_ENV === "production") {
	app.use(express.static(path.join(__dirname, "/frontend/dist")));

	app.get("*", (req, res) => {
		res.sendFile(path.resolve(__dirname, "frontend", "index.html"));
	});
}

const server = http.createServer(app);
initSocket(server);

if (process.env.NODE_ENV !== "test") {
	server.listen(PORT, () => {
		connectDB();
		startExpiryCron();
		console.log("Server is running on port: ", PORT);
	});
}

export { app, server };
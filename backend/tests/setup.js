import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

jest.mock("otplib", () => ({
	generateSecret: jest.fn(() => "test-secret"),
	generateURI: jest.fn(() => "otpauth://..."),
	verify: jest.fn(() => true),
	generate: jest.fn(() => "123456"),
	authenticator: {
		generate: jest.fn(() => "123456"),
		verify: jest.fn(() => true)
	}
}));

beforeAll(async () => {
	console.log("--- Connecting to MongoDB for tests ---");
	if (mongoose.connection.readyState === 0) {
		let retries = 3;
		while (retries > 0) {
			try {
				await mongoose.connect(process.env.MONGO_URI, {
					serverSelectionTimeoutMS: 10000,
				});
				console.log("--- Connected to MongoDB ---");
				break;
			} catch (err) {
				console.error(`--- MongoDB Connection Attempt Failed (${retries} retries left) ---`, err.message);
				retries -= 1;
				if (retries === 0) throw err;
				await new Promise(resolve => setTimeout(resolve, 2000));
			}
		}
	}
});

afterAll(async () => {
	await mongoose.connection.close();
});

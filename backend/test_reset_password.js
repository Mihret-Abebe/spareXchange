import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

const BASE_URL = 'http://localhost:5000/api/auth';
const uniqueEmail = `a.abeselom.t@gmail.com`; // Using a real email to prevent SMTP bounces

// define a minimal schema to extract token
const userSchema = new mongoose.Schema({
    email: String,
    resetPasswordToken: String
});
const User = mongoose.model('User', userSchema);

async function testReset() {
    console.log("1. Creating User (Signup)...");
    try {
        await fetch(`${BASE_URL}/signup`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name: "Reset Tester", email: uniqueEmail, password: "Password123!" })
        });
        console.log("Signup successful");
    } catch (e) {
        console.error("Signup failed:", e.message); return;
    }

    console.log("\n2. Requesting Forgot Password...");
    try {
        const res = await fetch(`${BASE_URL}/forgot-password`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: uniqueEmail })
        });
        const data = await res.json();
        console.log("Forgot Password Response (Expected false if SMTP is broken):", data);
    } catch (e) {
        console.error("Forgot password request failed:", e.message); 
        // We do not return here! We proceed to check the DB token.
    }

    console.log("\n3. Extracting Reset Token from DB...");
    try {
        await mongoose.connect('mongodb+srv://abeselom:abeselom@cluster0.rywnafj.mongodb.net/?appName=Cluster0');
        const user = await User.findOne({ email: uniqueEmail });
        if (!user || !user.resetPasswordToken) {
            console.error("Failed to find user or reset token in DB!");
            await mongoose.disconnect();
            return;
        }
        var resetToken = user.resetPasswordToken;
        console.log("Extracted Reset Token:", resetToken);
        await mongoose.disconnect();
    } catch (e) {
        console.error("Database error:", e.message); return;
    }

    console.log("\n4. Testing Reset Password Endpoint...");
    try {
        const res = await fetch(`${BASE_URL}/reset-password/${resetToken}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ password: "NewPassword456!" })
        });
        const data = await res.json();
        console.log("Reset Password Response:", data);
    } catch (e) {
        console.error("Reset password failed:", e.message);
    }

    console.log("\n5. Verifying Login with New Password...");
    try {
        const res = await fetch(`${BASE_URL}/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: uniqueEmail, password: "NewPassword456!" })
        });
        const data = await res.json();
        if (data.success) {
            console.log("Login with new password SUCCESS:", data.message);
        } else {
            console.error("Login failed with new password.");
        }
    } catch (e) {
        console.error("Login failed:", e.message);
    }
}

testReset();

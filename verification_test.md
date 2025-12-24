# User Verification Process Test

## Overview
This document details the user verification process in the SpareXChange application based on code analysis.

## Verification Flow

### 1. Registration with Verification Token Generation
When a user registers via `POST /api/auth/signup`:
- User provides email, password, and name
- System generates a 6-digit verification token: `Math.floor(100000 + Math.random() * 900000).toString()`
- Token is stored in the user document with expiration: `verificationTokenExpiresAt: Date.now() + 24 * 60 * 60 * 1000`
- Verification email is sent to the user using `sendVerificationEmail(user.email, verificationToken)`

### 2. Email Verification Process
When a user submits verification via `POST /api/auth/verify-email`:
- Request body contains the verification `code`
- System queries for user with matching `verificationToken` that hasn't expired
- If user found and token valid:
  - Sets `user.isVerified = true`
  - Clears `verificationToken` and `verificationTokenExpiresAt`
  - Sends welcome email using `sendWelcomeEmail(user.email, user.name)`

### 3. Verification Token Management
- Tokens expire after 24 hours
- Tokens are removed from user document after successful verification
- Invalid or expired tokens return error message

## Security Measures
- Verification tokens are 6-digit random numbers
- Tokens have 24-hour expiration
- Token validation includes expiration check
- Verification status is stored in user document (`isVerified` field)

## Email Integration
- Uses mailtrap/emails.js for verification emails
- Uses sendVerificationEmail function to send verification codes
- Uses sendWelcomeEmail function after successful verification

## API Endpoints
- `POST /api/auth/signup` - Creates user with verification token
- `POST /api/auth/verify-email` - Verifies user email with code

## Database Schema Impact
- User model has `isVerified` boolean field
- User model has `verificationToken` string field
- User model has `verificationTokenExpiresAt` date field

## Testing Scenarios
1. Successful verification with valid token
2. Failed verification with invalid token
3. Failed verification with expired token
4. Verification attempt after already verified
5. Verification email delivery

## Verification Status Check
- Verified users can access additional functionality
- The `checkAuth` endpoint returns user information including verification status
- Verified users may have additional privileges (e.g., creating listings)

## Expected Behavior
- New users are unverified by default (`isVerified: false`)
- Verification status affects user privileges
- Successful verification triggers welcome email
- Verification tokens can only be used once
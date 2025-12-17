# SpareXchange - Advanced Authentication System 🔒

![SpareXchange Demo](/frontend/public/screenshot-for-readme.png)

A full-stack authentication system built with the MERN stack (MongoDB, Express, React, Node.js) featuring advanced security measures, email verification, password reset functionality, and a modern UI with beautiful animations.

## 🎥 Video Tutorial

[Watch the tutorial on YouTube](https://youtu.be/pmvEgZC55Cg)

## 🌟 Features

- 🔐 Secure user authentication (signup, login, logout)
- 📧 Email verification for new accounts
- 🔑 Password reset functionality
- 🛡️ JWT-based session management
- 🔄 Protected routes for authenticated users
- 🎨 Responsive and modern UI with React
- 📱 Mobile-friendly design
- 🌈 Beautiful animations and transitions with Framer Motion
- 🛠️ Comprehensive error handling
- 📦 Modular and well-organized code structure
- 🚀 Production-ready deployment setup

## 🛠️ Tech Stack

### Frontend
- React.js with Vite
- TailwindCSS for styling
- Zustand for state management
- React Router for navigation
- Framer Motion for animations
- Lucide React for icons
- React Hot Toast for notifications

### Backend
- Node.js with Express.js
- MongoDB with Mongoose
- JSON Web Tokens (JWT) for authentication
- Nodemailer for email services
- bcryptjs for password hashing
- Crypto for token generation
- Cookie Parser for cookie management
- CORS for cross-origin resource sharing

## 🚀 Getting Started

### Prerequisites

- Node.js (v14 or higher)
- MongoDB database (local or cloud instance like MongoDB Atlas)
- npm or yarn package manager

### Setup .env file

Create a `.env` file in the root of the `backend` directory with the following variables:

```bash
MONGO_URI=your_mongo_uri
PORT=5000
JWT_SECRET=your_secret_key
NODE_ENV=development

# Nodemailer Configuration (Ethereal.email test account)
SMTP_HOST=smtp.ethereal.email
SMTP_PORT=587
SMTP_USER=iuqcjydv66lxcve7@ethereal.email
SMTP_PASS=4zzAtV5KkCFNV33apm
FROM_EMAIL=iuqcjydv66lxcve7@ethereal.email

CLIENT_URL=http://localhost:5173
```

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/abeselom-tsegazeab/spareXchange.git
   cd spareXchange
   ```

2. Install backend dependencies:
   ```bash
   cd backend
   npm install
   ```

3. Install frontend dependencies:
   ```bash
   cd ../frontend
   npm install
   ```

### Running the Application

#### Development Mode

1. Start the backend server:
   ```bash
   cd backend
   npm run dev
   ```

2. Start the frontend development server:
   ```bash
   cd frontend
   npm run dev
   ```

#### Production Mode

1. Build the frontend:
   ```bash
   cd frontend
   npm run build
   ```

2. Start the backend server:
   ```bash
   cd backend
   npm start
   ```

The application will be available at:
- Frontend: http://localhost:5173
- Backend API: http://localhost:5000

## 🔄 API Endpoints

### Authentication Routes
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/signup` | Register a new user |
| POST | `/api/auth/login` | Login existing user |
| POST | `/api/auth/logout` | Logout current user |
| POST | `/api/auth/verify-email` | Verify user email with code |
| POST | `/api/auth/forgot-password` | Request password reset |
| POST | `/api/auth/reset-password/:token` | Reset password with token |
| GET | `/api/auth/check-auth` | Check if user is authenticated |

## 📁 Project Structure

```
spareXchange/
├── backend/
│   ├── controllers/          # Request handlers
│   ├── db/                   # Database connection
│   ├── mailtrap/             # Email templates and sending
│   ├── middleware/           # Custom middleware functions
│   ├── models/               # Mongoose models
│   ├── routes/               # API route definitions
│   ├── utils/                # Utility functions
│   └── index.js              # Entry point
└── frontend/
    ├── src/
    │   ├── components/       # Reusable UI components
    │   ├── pages/            # Page components
    │   ├── store/            # State management
    │   ├── utils/            # Utility functions
    │   ├── App.jsx           # Main app component
    │   ├── index.css         # Global styles
    │   └── main.jsx          # Entry point
    ├── index.html            # HTML template
    └── vite.config.js        # Vite configuration
```

## 📧 Email Functionality

The application uses Nodemailer with Ethereal.email for email testing. Emails are sent for:
- Email verification after signup
- Password reset requests
- Welcome message after successful verification
- Password reset confirmation

## 🔐 Security Features

- Passwords are hashed using bcryptjs
- JWT tokens for secure session management
- Email verification for account validation
- Password reset tokens with expiration
- Protected routes for authenticated users only
- CORS configuration for controlled access
- Cookie-based authentication with HttpOnly flag

## 🤝 Support

If you find this project helpful, please consider:

- ⭐ Starring this repository
- 📢 Sharing with others
- 💬 Providing feedback or suggestions
- 🎯 Subscribing to [AsaProgrammer_](https://www.youtube.com/@asaprogrammer_) on YouTube

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Thanks to all the developers who contributed to the open-source libraries used in this project
- Special thanks to the YouTube community for their continued support

---

Built with ❤️ using the MERN stack

# SpareXchange - Complete Authentication & Authorization System 🔐

![SpareXchange Demo](/frontend/public/screenshot-for-readme.png)

A production-ready, full-stack authentication system built with the MERN stack (MongoDB, Express, React, Node.js) featuring comprehensive security measures, email verification, password reset functionality, JWT-based session management, and a stunning modern UI with beautiful animations.



## 🎥 Video Tutorial

[Watch the tutorial on YouTube](https://youtu.be/pmvEgZC55Cg)

## 🌟 Key Features

### Authentication & Authorization
- 🔐 Secure user registration with email verification
- 🔑 Login with email/password
- 🚪 Logout functionality
- 🔄 Email verification with 6-digit code
- 🔁 Password reset with email link
- ✅ Password reset confirmation
- 🛡️ JWT-based session management
- 🔄 Protected routes for authenticated users only
- 👤 User profile dashboard

### Security
- 🔒 Password hashing with bcryptjs
- 🕐 Email verification codes expire after 24 hours
- ⏰ Password reset tokens expire after 1 hour
- 🛡️ CORS protection
- 🍪 HttpOnly cookie-based authentication
- 🔐 Environment-based configuration

### User Experience
- 🎨 Modern, responsive UI with TailwindCSS
- 🌈 Smooth animations with Framer Motion
- 📱 Mobile-first design
- ⚡ Fast development with Vite
- 🛠️ Real-time form validation
- 📊 Visual password strength meter
- 🎯 Intuitive 6-digit verification code input
- 📋 Auto-focus navigation between code inputs
- 🔄 Automatic submission when code is complete
- 📢 User feedback with toast notifications

### Email Functionality
- 📧 Email verification after signup
- 🔗 Password reset request with secure link
- ✅ Confirmation after successful password reset
- 💌 Welcome email after verification
- 🧪 Works with any SMTP provider (configured for Ethereal.email)

### Developer Experience
- 📦 Well-organized, modular code structure
- 🛠️ Comprehensive error handling
- 🔄 State management with Zustand
- 🌐 API route organization
- 🎯 Environment-based API configuration
- 🚀 Production-ready deployment setup

## 🛠️ Technology Stack

### Frontend
- ⚛️ React.js with Vite (blazing fast development)
- 🎨 TailwindCSS for styling
- 🗃️ Zustand for lightweight state management
- 🌐 React Router for client-side routing
- 🎞️ Framer Motion for smooth animations
- 🎯 Lucide React for beautiful icons
- 📢 React Hot Toast for user notifications

### Backend
- 🟢 Node.js with Express.js
- 🗄️ MongoDB with Mongoose ODM
- 🔐 JSON Web Tokens (JWT) for authentication
- 📧 Nodemailer for email delivery
- 🔒 bcryptjs for password hashing
- 🔑 Crypto for secure token generation
- 🍪 Cookie Parser for cookie handling
- 🌐 CORS for cross-origin resource sharing
- ⚙️ Dotenv for environment configuration

## 🚀 Getting Started

### Prerequisites

- Node.js (v14 or higher)
- MongoDB database (local or cloud instance like MongoDB Atlas)
- npm or yarn package manager

### Environment Configuration

Create a `.env` file in the root of the `backend` directory with the following variables:

```bash
# MongoDB Connection
MONGO_URI=your_mongo_uri

# Server Configuration
PORT=5000
NODE_ENV=development

# JWT Configuration
JWT_SECRET=your_secret_key

# Client URL
CLIENT_URL=http://localhost:5173

# Nodemailer Configuration (Ethereal.email test account)
SMTP_HOST=smtp.ethereal.email
SMTP_PORT=587
SMTP_USER=iuqcjydv66lxcve7@ethereal.email
SMTP_PASS=4zzAtV5KkCFNV33apm
FROM_EMAIL=iuqcjydv66lxcve7@ethereal.email
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
| POST | `/api/auth/signup` | Register a new user with email verification |
| POST | `/api/auth/login` | Authenticate existing user credentials |
| POST | `/api/auth/logout` | Clear authentication cookie |
| POST | `/api/auth/verify-email` | Verify user email with 6-digit code |
| POST | `/api/auth/forgot-password` | Send password reset email |
| POST | `/api/auth/reset-password/:token` | Reset password with token |
| GET | `/api/auth/check-auth` | Validate current authentication status |

## 📁 Project Architecture

```
spareXchange/
├── backend/
│   ├── controllers/          # Business logic handlers
│   ├── db/                   # Database connection setup
│   ├── mailtrap/             # Email templates and delivery
│   ├── middleware/           # Authentication middleware
│   ├── models/               # MongoDB schemas and models
│   ├── routes/               # API route definitions
│   ├── utils/                # Helper functions
│   └── index.js              # Server entry point
└── frontend/
    ├── src/
    │   ├── components/       # Reusable UI components
    │   ├── pages/            # Page-level components
    │   ├── store/            # Global state management
    │   ├── utils/            # Helper functions
    │   ├── App.jsx           # Main application component
    │   ├── index.css         # Global styles
    │   └── main.jsx          # Client entry point
    ├── index.html            # HTML template
    └── vite.config.js        # Vite configuration
```

## 📧 Email Templates

The application includes professionally designed HTML email templates for:
- Email verification with 6-digit code
- Password reset request with secure link
- Password reset confirmation
- Welcome message after successful verification

## 🔐 Authentication Flow

1. **Registration**: User signs up with name, email, and password
2. **Email Verification**: 6-digit code sent to user's email (expires in 24 hours)
3. **Login**: User authenticates with email/password
4. **Session Management**: JWT stored in HttpOnly cookie
5. **Protected Access**: Middleware validates JWT on protected routes
6. **Password Reset**: User requests reset, receives email with secure link
7. **Logout**: Authentication cookie cleared

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

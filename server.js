/**
 * ============================================================
 *  MediCare Hospital Booking — Backend Server
 * ============================================================
 *
 *  Tech Stack: Node.js + Express + MongoDB (Mongoose)
 *  Auth:       JWT (JSON Web Tokens) + bcrypt password hashing
 *  Port:       7500 (configurable via .env)
 *
 *  API Routes:
 *  ──────────
 *  /api/auth          → Register, Login, Profile
 *  /api/doctors       → Doctor CRUD + Search/Filter
 *  /api/appointments  → Booking, Status Management
 *  /api/health        → Health check endpoint
 *
 *  Design Highlights:
 *  ──────────────────
 *  • Premium medical blue/teal color palette (frontend)
 *  • Glassmorphism navbar with backdrop blur
 *  • Animated hero section with floating card and glowing orbs
 *  • Micro-animations on hover (cards lift, buttons scale)
 *  • Fully responsive layout
 *  • Status badges with color-coded states
 *
 * ============================================================
 */

const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

// Load env vars
dotenv.config();

// Connect to database
connectDB();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/doctors', require('./routes/doctorRoutes'));
app.use('/api/appointments', require('./routes/appointmentRoutes'));
app.use('/api/doctor', require('./routes/doctorDashRoutes'));
app.use('/api/admin', require('./routes/adminUserRoutes'));
app.use('/api/doctor/account', require('./routes/doctorAccountRoutes'));

// Health check
app.get('/api/health', (req, res) => {
    res.json({ status: 'OK', message: 'Hospital Booking API is running' });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

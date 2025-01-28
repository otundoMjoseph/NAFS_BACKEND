const express = require('express');
const session = require('express-session');
const cors = require('cors');
const path = require('path');
require('dotenv').config();


const pool = require('./config/database');
const authRoutes = require('./routes/authRoutes')(pool);
const userRoutes = require('./routes/userRoutes')(pool);
const appointmentRoutes = require('./routes/appointmentRoutes')(pool);
const errorHandler = require('./middlewares/errorHandler');


const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors({
    origin: 'http://localhost:5173', // or where you react app runs
    credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// Session Management
app.use(
    session({
        secret: process.env.SESSION_SECRET,
        resave: false,
        saveUninitialized: false,
        cookie: {
            secure: false, // For development over HTTP. Change to true for HTTPS in production
            httpOnly: true,
        },
    })
);

// Routes
app.use('/auth', authRoutes);
app.use('/', userRoutes);
app.use('/appointments', appointmentRoutes)

// Global error handler
app.use(errorHandler);
// Start the Server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
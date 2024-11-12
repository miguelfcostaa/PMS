// src/backend/server.js
const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const authRoutes = require('./routes/authRoutes');

dotenv.config({ path: './src/backend/.env' });
const app = express();

// Middlewares
app.use(cors({
    origin: 'http://localhost:3000', // Allow only your frontend to make requests
    methods: ['GET', 'POST', 'PUT', 'DELETE'], // Allowed HTTP methods
    allowedHeaders: ['Content-Type', 'Authorization'] // Allowed headers
}));

app.use(express.json({ limit: '50mb' })); // Increase payload limit for JSON
app.use(express.urlencoded({ limit: '50mb', extended: true })); // Increase payload limit for FormData

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
})
    .then(() => console.log('Connected to MongoDB successfully!'))
    .catch((error) => console.error('Error connecting to MongoDB:', error));

// Use the authentication routes
app.use('/api/auth', authRoutes);

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

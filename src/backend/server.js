const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const authRoutes = require('./routes/authRoutes');
const campaignRoutes = require('./routes/campaignRoutes');

dotenv.config({ path: './src/backend/.env' });
const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: 'http://localhost:3000',
        methods: ['GET', 'POST'],
    },
});

// Middleware
app.use(cors({
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
}));

app.use(express.json({ limit: '10mb' })); 
app.use(express.urlencoded({ extended: true, limit: '10mb' })); 

mongoose.connect(process.env.MONGO_URI, {})
    .then(() => console.log('Connected to MongoDB successfully!'))
    .catch((error) => console.error('Error connecting to MongoDB:', error));

app.use('/api/auth', authRoutes);
app.use('/api/campaign', campaignRoutes);

io.on('connection', (socket) => {
    console.log('Client connected:', socket.id);

    socket.on('disconnect', () => {
        console.log('Client disconnected:', socket.id);
    });
});

// Exporta o `io` para que outros arquivos possam usá-lo
module.exports = { app, server, io };

server.listen(process.env.PORT || 5000, () => {
    console.log(`Server running on port ${process.env.PORT || 5000}`);
});

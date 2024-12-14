const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config({ path: './src/backend/.env' });

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      maxPoolSize: 10, // Limite máximo de conexões simultâneas
      serverSelectionTimeoutMS: 5000, 
      socketTimeoutMS: 45000, 
      connectTimeoutMS: 10000,
    });
    console.log('Connected to MongoDB successfully!');
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
    process.exit(1);
  }
};

module.exports = connectDB;
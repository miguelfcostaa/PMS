const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config({ path: './src/backend/.env' });

let connection = null;

const connectDB = async () => {
  try {
    if (!connection) {
      connection = await mongoose.connect(process.env.MONGO_URI, {
        maxPoolSize: 35,
        serverSelectionTimeoutMS: 5000,
        socketTimeoutMS: 45000,
        connectTimeoutMS: 10000,
        useUnifiedTopology: true,
      });
      console.log('Connected to MongoDB successfully!');
    }
    return connection;
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
    process.exit(1);
  }
};

module.exports = { mongoose, connectDB }; // Exporta o Mongoose e a função de conexão

const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 10000,
      socketTimeoutMS: 45000,
      family: 4
    });
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`MongoDB connection error: ${error.message}`);
    console.log('Server will continue running. MongoDB will reconnect when available.');
    // Don't exit - let the server run and mongoose will auto-retry
  }
};

module.exports = connectDB;


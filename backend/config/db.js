const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');

let memoryServer;

const getFallbackMongoUri = async () => {
  if (!memoryServer) {
    memoryServer = await MongoMemoryServer.create();
  }

  return memoryServer.getUri();
};

const connectDB = async () => {
  const mongoUri = process.env.MONGODB_URI || (await getFallbackMongoUri());
  const options = {
    dbName: process.env.MONGODB_DB || 'digital_healthcare',
    serverSelectionTimeoutMS: 10000,
    connectTimeoutMS: 10000
  };

  try {
    const conn = await mongoose.connect(mongoUri, options);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    try {
      const fallbackUri = await getFallbackMongoUri();
      const conn = await mongoose.connect(fallbackUri, options);
      console.log(`MongoDB Connected: ${conn.connection.host} (fallback)`);
    } catch (fallbackError) {
      console.error(`MongoDB connection failed for URI: ${error.message}`);
      process.exit(1);
    }
  }
};

module.exports = connectDB;

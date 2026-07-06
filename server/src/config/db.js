import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';

let mongoServer;

const connectDB = async () => {
  try {
    let uri = process.env.MONGODB_URI;
    
    try {
      console.log(`Attempting to connect to MongoDB at ${uri}...`);
      await mongoose.connect(uri, { serverSelectionTimeoutMS: 2000 });
      console.log(`MongoDB Connected successfully to: ${mongoose.connection.host}`);
    } catch (initialErr) {
      console.log(`Failed to connect to local MongoDB. Falling back to in-memory database...`);
      mongoServer = await MongoMemoryServer.create();
      uri = mongoServer.getUri();
      await mongoose.connect(uri);
      console.log(`MongoDB In-Memory Server Connected at: ${uri}`);
    }
  } catch (error) {
    console.error(`MongoDB Connection Error: ${error.message}`);
    process.exit(1);
  }
};

export default connectDB;

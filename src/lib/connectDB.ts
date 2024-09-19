import mongoose from "mongoose";

const connectDB = async (): Promise<void> => {
  if (mongoose.connections[0].readyState) {
    console.log("MongoDB already connected.");
    return;
  }

  try {
    const db = await mongoose.connect(process.env.MONGODB_URI || "");
    console.log("Successfully connected to MongoDB databse.", db);
  } catch (error) {
    console.log("Failed connecting to MongoDB database. ", error);
    process.exit(1);
  }
};

export default connectDB;

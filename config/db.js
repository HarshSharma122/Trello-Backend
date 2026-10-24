import mongoose from "mongoose";

const MONGODB_URI = "mongodb+srv://...";


const connectDB = async () => {
  try {
    const connect = await mongoose.connect(MONGODB_URI);
    if (!connect) {
      console.log("Database connection issue");
    }

    return connect;
  } catch (error) {
    console.log("Database connection issue", error);
    process.exit(1);
  }
};

export default connectDB;

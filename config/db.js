import mongoose from "mongoose";

const MONGODB_URI = "mongodb+srv://harsh444577_db_user:cKnKZkBn72Gh58Qm@baantlo.lu4escd.mongodb.net/trello";


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

import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config()

const {MONGO_URI} = process.env
const connectDB = async () => {
  try {
    const connect = await mongoose.connect(MONGO_URI);
    console.log("Connect database successfully", connect.connection.host);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};
export default connectDB;
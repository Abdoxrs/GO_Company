import mongoose from "mongoose";
import dotenv from 'dotenv'

dotenv.config()

const connectDB = async () => {
  const uri = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/GO";
  return mongoose.connect(uri)
}

export default connectDB;
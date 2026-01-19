/* eslint-disable @typescript-eslint/no-explicit-any */
import mongoose from "mongoose";

const MONGO_URI =
  process.env.MONGO_URI || "mongodb://127.0.0.1:27017/next_graphql";

if (!MONGO_URI) {
  throw new Error("Please define MONGO_URI");
}

const cached = (global as any).mongoose || { conn: null };

export async function connectDB() {
  if (cached.conn) return cached.conn;

  cached.conn = await mongoose.connect(MONGO_URI);
  return cached.conn;
}

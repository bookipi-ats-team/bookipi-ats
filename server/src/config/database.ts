import mongoose from "mongoose";
import env from "./env.js";

mongoose.set("strictQuery", true);

const { connection } = mongoose;

connection.on("connected", () => {
  console.log("Connected to MongoDB");
});

connection.on("error", (error) => {
  console.error("MongoDB connection error", error);
});

connection.on("disconnected", () => {
  console.warn("Disconnected from MongoDB");
});

let connectionPromise: Promise<typeof mongoose> | null = null;

export const connectToDatabase = async (): Promise<typeof mongoose | null> => {
  if (!env.mongoUri) {
    console.warn("MONGODB_URI not set; skipping MongoDB connection");
    return null;
  }

  if (!connectionPromise) {
    connectionPromise = mongoose.connect(env.mongoUri);
  }

  try {
    return await connectionPromise;
  } catch (error) {
    connectionPromise = null;
    throw error;
  }
};

export const disconnectFromDatabase = async (): Promise<boolean> => {
  if (connection.readyState === 0) {
    return false;
  }

  await mongoose.disconnect();
  connectionPromise = null;
  return true;
};

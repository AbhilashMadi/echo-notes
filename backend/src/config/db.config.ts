import mongoose from "mongoose";
import { envConfig } from "./env.config.js";

export async function connectDB(): Promise<void> {
  try {
    await mongoose.connect(envConfig.MONGO_DB_URI, {
      dbName: envConfig.DB_NAME,
    });

    console.log("✅ MongoDB Connected Successfully!");

    // MongoDB Connection Events for Debugging
    mongoose.connection.on("connected", () => {
      console.log("🔗 MongoDB Connection Established");
    });

    mongoose.connection.on("error", (err) => {
      console.error("🐞 MongoDB Connection Error:", err);
    });

    mongoose.connection.on("disconnected", () => {
      console.warn("⚠️ MongoDB Disconnected!");
    });

    // Graceful Shutdown Handling
    process.on("SIGINT", async () => {
      await mongoose.connection.close();
      console.log("🔻 MongoDB Disconnected due to app termination");
      process.exit(0);
    });

  } catch (error) {
    console.error("💀 MongoDB Connection Failed:", error);
    process.exit(1);
  }
}

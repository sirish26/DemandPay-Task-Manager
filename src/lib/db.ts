import mongoose from "mongoose";

export const connectDB = async () => {
  try {
    if (mongoose.connection.readyState >= 1) {
      return;
    }
    await mongoose.connect(process.env.MONGODB_URL as string, {
      dbName: "TaskManager",
    });
    console.log("Fu*k Yeah DB is connected");
    } catch (error) {
        console.error("Fu*k error:", error);
        }
}

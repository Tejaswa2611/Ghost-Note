import mongoose from "mongoose";

type ConnectionObject = {
    isConnected?: boolean;
}

const connection: ConnectionObject = {};

async function connectDB(): Promise<void> {
    if (connection.isConnected) {
        console.log("Already connected to DB");
        return;
    }

    try {
        const mongoUrl = process.env.MONGODB_URI || process.env.MONGO_URL || "";
        
        if (!mongoUrl) {
            throw new Error("MONGODB_URI or MONGO_URL environment variable is not set");
        }
        
        console.log("🔗 Connecting to MongoDB...");
        const db = await mongoose.connect(mongoUrl, {});
        connection.isConnected = true;
        console.log("db.connection.readyState->", db.connection.readyState);
        console.log("✅ Connected to DB successfully");
    } catch (err) {
        console.error("❌ Database connection failed->", err);
        process.exit(1); // gracefully exit the process if connection fails
    }

}

export default connectDB;
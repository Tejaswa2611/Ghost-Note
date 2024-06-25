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
        const db = await mongoose.connect(process.env.MONGO_URI || "", {});
        console.log("this is db->", db);
        connection.isConnected = true;
        console.log("db.connection.readyState->", db.connection.readyState);
        console.log("Connected to DB");
    } catch (err) {
        console.error("Database connection failed->", err);
        process.exit(1); // gracefully exit the process if connection fails
    }

}

export default connectDB;
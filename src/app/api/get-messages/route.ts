// take user from session(get Server session) and obtain its id from new mongoose.Types.ObjectId(user._id)
// aggregation pipeline- get user from id, unwind messages, sort messages by createdAt, group messages by id


import connectDB from "@/lib/connectDB";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import UserModel from "@/models/User";
import mongoose from "mongoose";


export async function GET(request: Request) {
    try {
        console.log("📨 Starting get-messages API...");
        
        // Check environment variables
        if (!process.env.MONGODB_URI && !process.env.MONGO_URL) {
            console.log("❌ MongoDB URL not configured");
            return Response.json({
                success: false,
                message: "Database not configured"
            }, { status: 500 })
        }
        
        await connectDB();
        console.log("📨 Fetching messages for user...");
        
        const session = await getServerSession(authOptions);
        const user = session?.user;
        
        if (!session || !user) {
            console.log("❌ No session or user found");
            return Response.json({
                success: false,
                message: "User not authenticated"
            }, { status: 401 })
        }
        
        console.log("✅ User authenticated:", user.username || user.email);
        
        if (!user._id) {
            console.log("❌ User ID missing from session");
            return Response.json({
                success: false,
                message: "User ID missing"
            }, { status: 400 })
        }
        
        const userId = new mongoose.Types.ObjectId(user._id);
        console.log("🔍 Searching for user with ID:", userId);
        
        const userWithMessages = await UserModel.aggregate([
            { $match: { _id: userId } },
            { $unwind: { path: "$messages", preserveNullAndEmptyArrays: true } },
            { $sort: { "messages.createdOn": -1 } },
            { $group: { 
                _id: "$_id", 
                messages: { $push: "$messages" },
                username: { $first: "$username" },
                email: { $first: "$email" },
                isAcceptingMessages: { $first: "$isAcceptingMessages" }
            }},
        ]);

        console.log("📊 Aggregation result:", userWithMessages);

        if (!userWithMessages || userWithMessages.length === 0) {
            console.log("❌ User not found in database");
            return Response.json({
                success: false,
                message: "User not found"
            }, { status: 404 })
        }

        // Filter out null messages (from preserveNullAndEmptyArrays)
        const messages = userWithMessages[0].messages.filter((msg: any) => msg !== null);
        
        console.log(`✅ Found ${messages.length} messages for user`);

        return Response.json({
            success: true,
            messages: messages
        }, { status: 200 })
    } catch (error) {
        console.error("❌ Error fetching messages:", error);
        return Response.json({
            success: false,
            message: "Error fetching messages"
        }, { status: 500 })
    }
}
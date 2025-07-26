// Enhanced message retrieval with robust error handling and aggregation pipeline
import { withDatabaseConnection } from "@/lib/connectDB";
import { createErrorResponse, createSuccessResponse, handleDatabaseError } from "@/lib/apiResponse";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import UserModel from "@/models/User";
import mongoose from "mongoose";

// Mark this route as dynamic to prevent static generation issues
export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
    try {
        console.log("📨 Starting get-messages API...");
        
        // Check authentication first
        const session = await getServerSession(authOptions);
        const user = session?.user;
        
        if (!session || !user) {
            console.log("❌ No session or user found");
            return createErrorResponse("User not authenticated", 401);
        }
        
        if (!user._id) {
            console.log("❌ User ID missing from session");
            return createErrorResponse("User session invalid", 400);
        }
        
        console.log("✅ User authenticated:", user.username || user.email);
        
        // Use robust database connection wrapper
        const result = await withDatabaseConnection(async () => {
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
                }}
            ]);

            console.log("📊 Aggregation result length:", userWithMessages.length);

            if (!userWithMessages || userWithMessages.length === 0) {
                throw new Error("USER_NOT_FOUND");
            }

            // Filter out null messages (from preserveNullAndEmptyArrays)
            const messages = userWithMessages[0].messages.filter((msg: any) => msg !== null);
            
            console.log(`✅ Found ${messages.length} messages for user`);

            return {
                messages,
                username: userWithMessages[0].username,
                isAcceptingMessages: userWithMessages[0].isAcceptingMessages,
                totalCount: messages.length
            };
            
        }, "Fetch user messages");

        return createSuccessResponse(
            "Messages retrieved successfully",
            {
                messages: result.messages,
                username: result.username,
                isAcceptingMessages: result.isAcceptingMessages,
                totalCount: result.totalCount
            }
        );
        
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : "Unknown error";
        
        // Handle specific business logic errors
        if (errorMessage === "USER_NOT_FOUND") {
            return createErrorResponse("User not found", 404);
        }
        
        // Handle database connection errors
        if (errorMessage.includes("Database operation failed") || errorMessage.includes("Failed to connect")) {
            return handleDatabaseError(error);
        }
        
        // Generic error handling
        console.error("❌ Error fetching messages:", error);
        return createErrorResponse("Failed to fetch messages", 500, undefined, errorMessage);
    }
}
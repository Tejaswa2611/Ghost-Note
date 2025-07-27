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
        

        
        // Use robust database connection wrapper
        const result = await withDatabaseConnection(async () => {
            // First, try to find the user by different methods
            let foundUser = null;
            let searchMethod = '';
            
            // Try finding by username (most reliable)
            if (user.username) {
                foundUser = await UserModel.findOne({ username: user.username });
                searchMethod = 'username';
            }
            
            // Try finding by email if username fails
            if (!foundUser && user.email) {
                foundUser = await UserModel.findOne({ email: user.email });
                searchMethod = 'email';
            }
            
            // Try finding by ObjectId if it's valid
            if (!foundUser && user._id && mongoose.Types.ObjectId.isValid(user._id)) {
                try {
                    const userId = new mongoose.Types.ObjectId(user._id);
                    foundUser = await UserModel.findById(userId);
                    searchMethod = 'ObjectId';
                } catch (error) {
                    // Silent fallback
                }
            }

            if (!foundUser) {
                throw new Error("USER_NOT_FOUND");
            }
            
            // Ensure messages array exists
            const messages = foundUser.messages || [];
            
            // Sort messages by creation date (newest first)
            if (messages.length > 0) {
                messages.sort((a: any, b: any) => {
                    const dateA = new Date(a.createdOn).getTime();
                    const dateB = new Date(b.createdOn).getTime();
                    return dateB - dateA;
                });
            }

            return {
                messages,
                username: foundUser.username,
                isAcceptingMessages: foundUser.isAcceptingMessages,
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
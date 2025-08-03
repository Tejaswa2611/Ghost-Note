// Enhanced anonymous message sending with robust error handling
import { withDatabaseConnection } from "@/lib/connectDB";
import { createErrorResponse, createSuccessResponse, handleDatabaseError } from "@/lib/apiResponse";
import User, { Message } from "@/models/User";
import { sendNotificationEmail } from "@/helpers/sendNotificationEmail";

export async function POST(request: Request) {
    try {
        // Validate request body
        const { username, content, category = 'general' } = await request.json();
        
        if (!username || !content) {
            return createErrorResponse(
                "Username and content are required",
                400
            );
        }
        
        if (content.length > 1000) {
            return createErrorResponse(
                "Message content exceeds maximum length of 1000 characters",
                400
            );
        }
        
        // Use robust database connection wrapper
        const result = await withDatabaseConnection(async () => {
            const user = await User.findOne({ username }).select('username isAcceptingMessages messages');
            
            if (!user) {
                throw new Error("USER_NOT_FOUND");
            }
            
            if (!user.isAcceptingMessages) {
                throw new Error("USER_NOT_ACCEPTING_MESSAGES");
            }
            
            const message: Message = {
                content: content.trim(),
                createdOn: new Date(),
                category: category || 'general'
            } as Message;
            
            user.messages.push(message);
            await user.save();
            
            return {
                messageCount: user.messages.length,
                timestamp: message.createdOn
            };
        }, "Send anonymous message");
        
        console.log(`✅ Message sent successfully to ${username}`);
        
        return createSuccessResponse(
            "Message sent successfully",
            {
                recipient: username,
                messageCount: result.messageCount,
                timestamp: result.timestamp
            }
        );
        
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : "Unknown error";
        
        // Handle specific business logic errors
        if (errorMessage === "USER_NOT_FOUND") {
            return createErrorResponse("User not found", 404);
        }
        
        if (errorMessage === "USER_NOT_ACCEPTING_MESSAGES") {
            return createErrorResponse("User is currently not accepting messages", 403);
        }
        
        // Handle database connection errors
        if (errorMessage.includes("Database operation failed") || errorMessage.includes("Failed to connect")) {
            return handleDatabaseError(error);
        }
        
        // Generic error handling
        console.error("❌ Error sending message:", error);
        return createErrorResponse("Failed to send message", 500, undefined, errorMessage);
    }
}
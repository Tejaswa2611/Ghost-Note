// get username and content from request body
// search for user by username 
// if user not found return 404, if user's isacceptingmessages is false return 403
// if user found, create a message object with content and createdOn, push it to user's messages array
// save user 

import connectDB from "@/lib/connectDB";
import User, { Message } from "@/models/User";
import { sendNotificationEmail } from "@/helpers/sendNotificationEmail";

export async function POST(request: Request) {
    try {
        await connectDB();
        const { username, content } = await request.json(); // todo: check if await is needed here
        const user = await User.findOne({ username });
        if (!user) {
            return Response.json({
                success: false,
                message: "User not found"
            }, { status: 404 })
        }
        if (!user.isAcceptingMessages) {
            return Response.json({
                success: false,
                message: "User is currently not accepting messages"
            }, { status: 403 })
        }
    
        const message = {
            content,
            createdOn: new Date()
        }
        user.messages.push(message as Message);
        await user.save();

        // Send email notification (non-blocking)
        try {
            const messagePreview = content.length > 100 ? content.substring(0, 100) : content;
            await sendNotificationEmail({
                email: user.email,
                username: user.username,
                messagePreview,
                messageCount: user.messages.filter(msg => !msg.read).length || 1
            });
        } catch (emailError) {
            console.error("Failed to send notification email:", emailError);
            // Don't fail the main request if email fails
        }

        return Response.json({
            success: true,
            message: "Message sent successfully"
        })
    } catch (error) {
        console.error("Error sending message: ", error);
        return Response.json({
            success: false,
            message: "Error sending message"
        }, { status: 500 })
    }
}
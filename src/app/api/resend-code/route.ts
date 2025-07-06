import { sendVerificationEmail } from "@/helpers/sendVerificationEmails";
import connectDB from "@/lib/connectDB";
import UserModel from "@/models/User";

export async function POST(request: Request) {
    await connectDB();
    try {
        const { username } = await request.json();
        
        console.log("Resending verification code for username:", username);
        
        const user = await UserModel.findOne({ username, isVerified: false });
        if (!user) {
            console.log("User not found or already verified for username:", username);
            return Response.json({
                success: false,
                message: "User not found or already verified"
            }, { status: 404 })
        }
        
        // Generate new verification code
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        const expiryDate = new Date();
        expiryDate.setHours(expiryDate.getHours() + 1);
        
        // Update user with new code and expiry
        user.verifyCode = otp;
        user.verifyCodeExpires = expiryDate;
        await user.save();
        
        console.log("New verification code generated for user:", username, "Code:", otp);
        
        // Send new verification email via Nodemailer
        const emailResponse = await sendVerificationEmail(user.email, username, otp);
        console.log("Nodemailer email response for resend:", emailResponse);

        if (!emailResponse.success) {
            return Response.json({
                success: false,
                message: "Error sending verification email"
            }, { status: 500 })
        }
        
        return Response.json({
            success: true,
            message: "Verification code resent successfully"
        }, { status: 200 })
        
    } catch (error) {
        console.log("Error in resend code route", error);
        return Response.json({
            success: false,
            message: "Error resending verification code"
        }, { status: 500 })
    }
}

// take username otp from request
// find username in db, if not found return 404 error
// check the expiry date and code of the otp compare them
// if they are same then return 200 status code with isVerified: true

import UserModel from "@/models/User";
import connectDB from "@/lib/connectDB";

export async function POST(request: Request) {
    await connectDB();
    try {
        const { username, code } = await request.json();
        
        console.log("Verification attempt for username:", username, "with code:", code);
        
        const user = await UserModel.findOne({ username, isVerified: false });
        if (!user) {
            console.log("User not found or already verified for username:", username);
            return Response.json({
                success: false,
                message: "User not found or already verified"
            }, { status: 404 })
        }
        
        console.log("User found. Stored code:", user.verifyCode, "Provided code:", code);
        console.log("Code expiry:", user.verifyCodeExpires, "Current time:", new Date());
        
        const isCodeValid = user.verifyCode === code;
        const isCodeNotExpired = user.verifyCodeExpires > new Date();
        
        console.log("Is code valid:", isCodeValid, "Is code not expired:", isCodeNotExpired);
        
        if (isCodeValid && isCodeNotExpired) {
            user.isVerified = true;
            await user.save();
            console.log("User verified successfully:", username);
            return Response.json({
                success: true,
                message: "User verified successfully"
            }, { status: 200 })
        } else if (!isCodeValid) {
            console.log("Invalid code for user:", username);
            return Response.json({
                success: false,
                message: "Invalid verification code"
            }, { status: 400 })
        } else if (!isCodeNotExpired) {
            console.log("Code expired for user:", username);
            return Response.json({
                success: false,
                message: "Verification code has expired. Please sign up again to get a new code"
            }, { status: 400 })
        }
    } catch (error) {
        console.log("Error in verify code route", error);
        return Response.json({
            success: false,
            message: "Error in verifying code"
        }, { status: 500 })
    }
}
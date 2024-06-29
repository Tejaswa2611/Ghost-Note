// take username otp from request
// find username in db, if not found return 404 error
// check the expiry date and code of the otp compare them
// if they are same then return 200 status code with isVerified: true

import UserModel from "@/models/User";

export async function POST(request: Request) {
    try {
        const { username, code } = await request.json();
        const user = await UserModel.findOne({ username, isVerified: false });
        if (!user) {
            return Response.json({
                success: false,
                message: "User not found"
            }, { status: 404 })
        }
        const isCodeValid = user.verifyCode === code;
        const isCodeNotExpired = user.verifyCodeExpires > new Date();
        if (isCodeValid && isCodeNotExpired) {
            user.isVerified = true;
            await user.save();
            return Response.json({
                success: true,
                message: "User verified succesfully"
            }, { status: 200 })
        } else if (!isCodeValid) {
            return Response.json({
                success: false,
                message: "Invalid code"
            }, { status: 400 })
        } else if (!isCodeNotExpired) {
            return Response.json({
                success: false,
                message: "Code expired. Please signup again to get new code"
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
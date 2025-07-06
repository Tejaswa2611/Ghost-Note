// Development helper to test verification without email
import connectDB from "@/lib/connectDB";
import UserModel from "@/models/User";

export async function GET(request: Request) {
    try {
        await connectDB();
        
        const url = new URL(request.url);
        const username = url.searchParams.get('username');
        
        if (!username) {
            return Response.json({
                success: false,
                message: "Username parameter required"
            }, { status: 400 });
        }
        
        const user = await UserModel.findOne({ username, isVerified: false });
        
        if (!user) {
            return Response.json({
                success: false,
                message: "User not found or already verified"
            }, { status: 404 });
        }
        
        // Only show this in development
        if (process.env.NODE_ENV === 'development') {
            return Response.json({
                success: true,
                data: {
                    username: user.username,
                    email: user.email,
                    verifyCode: user.verifyCode,
                    verifyCodeExpires: user.verifyCodeExpires,
                    isVerified: user.isVerified,
                    expiresIn: Math.max(0, Math.floor((user.verifyCodeExpires.getTime() - Date.now()) / 1000 / 60)) + " minutes"
                }
            }, { status: 200 });
        }
        
        return Response.json({
            success: false,
            message: "This endpoint is only available in development"
        }, { status: 403 });
        
    } catch (error) {
        console.error("Error in dev helper:", error);
        return Response.json({
            success: false,
            message: "Error fetching user data"
        }, { status: 500 });
    }
}

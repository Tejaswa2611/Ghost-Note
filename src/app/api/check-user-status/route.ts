import connectDB from "@/lib/connectDB";
import UserModel from "@/models/User";

export async function GET(request: Request) {
    try {
        await connectDB();
        
        const { searchParams } = new URL(request.url);
        const username = searchParams.get('username');
        
        if (!username) {
            return Response.json({
                success: false,
                message: "Username is required"
            }, { status: 400 });
        }

        const user = await UserModel.findOne({ username }).select('username isAcceptingMessages');
        
        if (!user) {
            return Response.json({
                success: false,
                exists: false,
                message: "User not found"
            }, { status: 404 });
        }

        return Response.json({
            success: true,
            exists: true,
            isAcceptingMessages: user.isAcceptingMessages,
            username: user.username
        }, { status: 200 });
        
    } catch (error) {
        console.error("Error checking user status:", error);
        return Response.json({
            success: false,
            message: "Error checking user status"
        }, { status: 500 });
    }
}

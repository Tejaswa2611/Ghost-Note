import connectDB from "@/lib/connectDB";
import UserModel from "@/models/User";

export async function GET() {
    try {
        console.log("🧪 Testing database connection...");
        await connectDB();
        
        const userCount = await UserModel.countDocuments();
        console.log("✅ Database connected successfully");
        console.log(`📊 Total users in database: ${userCount}`);
        
        return Response.json({
            success: true,
            message: "Database connection successful",
            userCount
        });
    } catch (error) {
        console.error("❌ Database test failed:", error);
        return Response.json({
            success: false,
            message: "Database connection failed",
            error: error instanceof Error ? error.message : "Unknown error"
        }, { status: 500 });
    }
}

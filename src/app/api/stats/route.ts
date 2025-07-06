import connectDB from "@/lib/connectDB";
import UserModel from "@/models/User";

export async function GET() {
    try {
        await connectDB();
        
        console.log("📊 Fetching app statistics...");
        
        // Get total number of verified users
        const totalUsers = await UserModel.countDocuments({ isVerified: true });
        
        // Get total number of messages across all users
        const messageStats = await UserModel.aggregate([
            { $match: { isVerified: true } },
            { $project: { messageCount: { $size: "$messages" } } },
            { $group: { _id: null, totalMessages: { $sum: "$messageCount" } } }
        ]);
        
        const totalMessages = messageStats.length > 0 ? messageStats[0].totalMessages : 0;
        
        // Get additional stats
        const usersWithMessages = await UserModel.countDocuments({ 
            isVerified: true, 
            "messages.0": { $exists: true } 
        });
        
        const acceptingUsers = await UserModel.countDocuments({ 
            isVerified: true, 
            isAcceptingMessages: true 
        });
        
        console.log("📈 Statistics calculated:", {
            totalUsers,
            totalMessages,
            usersWithMessages,
            acceptingUsers
        });
        
        return Response.json({
            success: true,
            data: {
                totalUsers: totalUsers + 250,
                totalMessages: totalMessages + 320,
                usersWithMessages,
                acceptingUsers,
                // Additional metrics for potential future use
                averageMessagesPerUser: totalUsers > 0 ? Math.round((totalMessages / totalUsers) * 10) / 10 : 0
            }
        }, { status: 200 });
        
    } catch (error) {
        console.error("❌ Error fetching statistics:", error);
        
        // Return fallback statistics if database query fails
        return Response.json({
            success: false,
            message: "Error fetching statistics",
            data: {
                totalUsers: 350, // Fallback with +250
                totalMessages: 750, // Fallback with +250
                usersWithMessages: 50,
                acceptingUsers: 100,
                averageMessagesPerUser: 2.1
            }
        }, { status: 200 }); // Still return 200 to show fallback data
    }
}

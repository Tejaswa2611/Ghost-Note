import { withDatabaseConnection, checkDatabaseHealth } from "@/lib/connectDB";
import { createErrorResponse, createSuccessResponse, handleDatabaseError } from "@/lib/apiResponse";
import UserModel from "@/models/User";

export async function GET() {
    try {
        console.log("🧪 Testing database connection and operations...");
        
        // Test database health first
        const isHealthy = await checkDatabaseHealth();
        
        if (!isHealthy) {
            return createErrorResponse("Database health check failed", 503);
        }
        
        // Test database operations
        const result = await withDatabaseConnection(async () => {
            const userCount = await UserModel.countDocuments();
            const recentUsers = await UserModel.find({})
                .select('username createdOn isVerified')
                .sort({ createdOn: -1 })
                .limit(5);
                
            return {
                userCount,
                recentUsers: recentUsers.map(user => ({
                    username: user.username,
                    isVerified: user.isVerified,
                    createdOn: user.createdOn
                }))
            };
        }, "Database test operations");
        
        console.log("✅ Database test completed successfully");
        console.log(`📊 Total users in database: ${result.userCount}`);
        
        return createSuccessResponse(
            "Database connection and operations successful",
            {
                userCount: result.userCount,
                recentUsers: result.recentUsers,
                timestamp: new Date().toISOString(),
                status: "healthy"
            }
        );
        
    } catch (error) {
        console.error("❌ Database test failed:", error);
        return handleDatabaseError(error);
    }
}

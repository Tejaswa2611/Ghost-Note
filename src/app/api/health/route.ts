import { checkDatabaseHealth } from "@/lib/connectDB";
import mongoose from "mongoose";

export async function GET() {
    try {
        const startTime = Date.now();
        
        // Check database health
        const isDatabaseHealthy = await checkDatabaseHealth();
        const responseTime = Date.now() - startTime;
        
        // Get connection details
        const connectionState = mongoose.connection.readyState;
        const connectionStates = {
            0: 'disconnected',
            1: 'connected', 
            2: 'connecting',
            3: 'disconnecting'
        };
        
        const healthStatus = {
            status: isDatabaseHealthy ? 'healthy' : 'unhealthy',
            timestamp: new Date().toISOString(),
            services: {
                database: {
                    status: isDatabaseHealthy ? 'up' : 'down',
                    connectionState: connectionStates[connectionState as keyof typeof connectionStates] || 'unknown',
                    responseTime: `${responseTime}ms`,
                    name: mongoose.connection.name || 'unknown'
                },
                application: {
                    status: 'up',
                    nodeVersion: process.version,
                    uptime: `${Math.floor(process.uptime())}s`
                }
            }
        };

        const statusCode = isDatabaseHealthy ? 200 : 503;
        
        return Response.json(healthStatus, { status: statusCode });
        
    } catch (error) {
        console.error("❌ Health check failed:", error);
        
        const errorResponse = {
            status: 'unhealthy',
            timestamp: new Date().toISOString(),
            error: error instanceof Error ? error.message : 'Unknown error',
            services: {
                database: {
                    status: 'down',
                    error: 'Connection check failed'
                },
                application: {
                    status: 'up',
                    nodeVersion: process.version
                }
            }
        };
        
        return Response.json(errorResponse, { status: 503 });
    }
} 
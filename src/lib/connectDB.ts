import mongoose from "mongoose";

type ConnectionObject = {
    isConnected?: boolean;
    isConnecting?: boolean;
    lastAttempt?: Date;
    retryCount?: number;
}

const connection: ConnectionObject = {};
const MAX_RETRIES = 3;
const RETRY_DELAY = 5000; // 5 seconds
const CONNECTION_TIMEOUT = 10000; // 10 seconds

// Health check function
export async function checkDatabaseHealth(): Promise<boolean> {
    try {
        if (mongoose.connection.readyState === 1) {
            // Test with a simple ping
            await mongoose.connection.db.admin().ping();
            return true;
        }
        return false;
    } catch (error) {
        console.error("🔍 Database health check failed:", error);
        return false;
    }
}

// Graceful disconnect
export async function disconnectDB(): Promise<void> {
    try {
        if (mongoose.connection.readyState !== 0) {
            await mongoose.disconnect();
            connection.isConnected = false;
            console.log("🔌 Disconnected from MongoDB");
        }
    } catch (error) {
        console.error("❌ Error disconnecting from MongoDB:", error);
    }
}

// Enhanced connection function with retry logic
async function connectDB(): Promise<void> {
    // If already connected, just return
    if (connection.isConnected && mongoose.connection.readyState === 1) {
        console.log("✅ Already connected to MongoDB");
        return;
    }

    // If currently connecting, wait a bit and return
    if (connection.isConnecting) {
        console.log("⏳ Connection attempt already in progress...");
        return;
    }

    const mongoUrl = process.env.MONGODB_URI || process.env.MONGO_URL || "";
    
    if (!mongoUrl) {
        const error = new Error("MONGODB_URI or MONGO_URL environment variable is not set");
        console.error("❌ Database configuration error:", error.message);
        throw error;
    }

    connection.isConnecting = true;
    connection.retryCount = connection.retryCount || 0;

    try {
        console.log(`🔗 Attempting to connect to MongoDB... (Attempt ${connection.retryCount + 1}/${MAX_RETRIES})`);
        
        // Enhanced connection options
        const options = {
            serverSelectionTimeoutMS: CONNECTION_TIMEOUT,
            socketTimeoutMS: CONNECTION_TIMEOUT,
            maxPoolSize: 10, // Maintain up to 10 socket connections
            minPoolSize: 2,  // Maintain a minimum of 2 socket connections
            maxIdleTimeMS: 30000, // Close connections after 30 seconds of inactivity
            bufferCommands: false, // Disable mongoose buffering
            bufferMaxEntries: 0, // Disable mongoose buffering
        };

        const db = await mongoose.connect(mongoUrl, options);
        
        connection.isConnected = true;
        connection.isConnecting = false;
        connection.retryCount = 0;
        connection.lastAttempt = new Date();

        console.log(`✅ Successfully connected to MongoDB`);
        console.log(`📊 Connection state: ${db.connection.readyState}`);
        console.log(`🏷️  Database name: ${db.connection.name}`);

        // Set up connection event listeners
        setupConnectionListeners();

    } catch (error) {
        connection.isConnecting = false;
        connection.retryCount = (connection.retryCount || 0) + 1;
        connection.lastAttempt = new Date();

        const errorMessage = error instanceof Error ? error.message : "Unknown error";
        console.error(`❌ MongoDB connection failed (Attempt ${connection.retryCount}/${MAX_RETRIES}):`, errorMessage);

        // If we haven't exceeded max retries, try again
        if (connection.retryCount < MAX_RETRIES) {
            console.log(`⏳ Retrying connection in ${RETRY_DELAY / 1000} seconds...`);
            await new Promise(resolve => setTimeout(resolve, RETRY_DELAY));
            return connectDB(); // Recursive retry
        } else {
            // Reset retry count for future attempts
            connection.retryCount = 0;
            const finalError = new Error(`Failed to connect to MongoDB after ${MAX_RETRIES} attempts: ${errorMessage}`);
            console.error("🚨 Database connection permanently failed:", finalError.message);
            throw finalError;
        }
    }
}

// Set up connection event listeners for monitoring
function setupConnectionListeners(): void {
    const db = mongoose.connection;

    // Only set up listeners once
    if (db.listenerCount('connected') === 0) {
        db.on('connected', () => {
            console.log('🔗 Mongoose connected to MongoDB');
            connection.isConnected = true;
        });

        db.on('error', (error) => {
            console.error('❌ Mongoose connection error:', error);
            connection.isConnected = false;
        });

        db.on('disconnected', () => {
            console.log('🔌 Mongoose disconnected from MongoDB');
            connection.isConnected = false;
        });

        // Handle application termination
        process.on('SIGINT', async () => {
            console.log('🛑 Application terminating, closing MongoDB connection...');
            await disconnectDB();
            process.exit(0);
        });
    }
}

// Enhanced connection wrapper for API routes
export async function withDatabaseConnection<T>(
    operation: () => Promise<T>,
    operationName: string = "Database operation"
): Promise<T> {
    try {
        await connectDB();
        return await operation();
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : "Unknown error";
        console.error(`❌ ${operationName} failed:`, errorMessage);
        
        // Re-throw with more context
        throw new Error(`${operationName} failed: ${errorMessage}`);
    }
}

export default connectDB;
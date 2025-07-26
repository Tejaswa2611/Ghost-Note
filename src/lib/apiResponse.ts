// Standardized API response utilities
export interface ApiResponse<T = any> {
    success: boolean;
    message: string;
    data?: T;
    error?: string;
    timestamp?: string;
}

// Database error types
export enum DatabaseErrorType {
    CONNECTION_FAILED = 'CONNECTION_FAILED',
    QUERY_FAILED = 'QUERY_FAILED',
    VALIDATION_ERROR = 'VALIDATION_ERROR',
    DOCUMENT_NOT_FOUND = 'DOCUMENT_NOT_FOUND',
    DUPLICATE_KEY = 'DUPLICATE_KEY'
}

// Create standardized error response
export function createErrorResponse(
    message: string, 
    statusCode: number = 500,
    errorType?: DatabaseErrorType,
    details?: string
): Response {
    const errorResponse: ApiResponse = {
        success: false,
        message,
        error: details || message,
        timestamp: new Date().toISOString()
    };

    console.error(`❌ API Error [${statusCode}]:`, message, details ? `- ${details}` : '');
    
    return Response.json(errorResponse, { status: statusCode });
}

// Create standardized success response
export function createSuccessResponse<T>(
    message: string,
    data?: T,
    statusCode: number = 200
): Response {
    const successResponse: ApiResponse<T> = {
        success: true,
        message,
        data,
        timestamp: new Date().toISOString()
    };

    return Response.json(successResponse, { status: statusCode });
}

// Handle database connection errors specifically
export function handleDatabaseError(error: unknown): Response {
    const errorMessage = error instanceof Error ? error.message : 'Unknown database error';
    
    // Check for specific MongoDB errors
    if (errorMessage.includes('Failed to connect to MongoDB')) {
        return createErrorResponse(
            'Database connection temporarily unavailable',
            503,
            DatabaseErrorType.CONNECTION_FAILED,
            errorMessage
        );
    }
    
    if (errorMessage.includes('E11000') || errorMessage.includes('duplicate key')) {
        return createErrorResponse(
            'Duplicate entry found',
            409,
            DatabaseErrorType.DUPLICATE_KEY,
            errorMessage
        );
    }
    
    if (errorMessage.includes('validation failed')) {
        return createErrorResponse(
            'Invalid data provided',
            400,
            DatabaseErrorType.VALIDATION_ERROR,
            errorMessage
        );
    }
    
    // Generic database error
    return createErrorResponse(
        'Database operation failed',
        500,
        DatabaseErrorType.QUERY_FAILED,
        errorMessage
    );
} 
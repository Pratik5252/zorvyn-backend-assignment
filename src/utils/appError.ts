
class AppError extends Error {

    constructor(
        public statusCode: number,
        public message: string,
        public errorCode: string = 'INTERNAL_ERROR'
    ){
        super(message);
        Object.setPrototypeOf(this, AppError.prototype);
    }

    // Static factory methods for common error types
    static badRequest(message: string, errorCode: string = 'BAD_REQUEST') {
        return new AppError(400, message, errorCode);
    }

    static unauthorized(message: string = 'Unauthorized', errorCode: string = 'UNAUTHORIZED') {
        return new AppError(401, message, errorCode);
    }

    static forbidden(message: string = 'Forbidden', errorCode: string = 'FORBIDDEN') {
        return new AppError(403, message, errorCode);
    }

    static notFound(message: string = 'Not Found', errorCode: string = 'NOT_FOUND') {
        return new AppError(404, message, errorCode);
    }

    static conflict(message: string = 'Conflict', errorCode: string = 'CONFLICT') {
        return new AppError(409, message, errorCode);
    }

    static internal(message: string = 'Internal Server Error', errorCode: string = 'INTERNAL_ERROR') {
        return new AppError(500, message, errorCode);
    }
}

export default AppError;
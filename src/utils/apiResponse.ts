import { ApiResponse } from "../types";

/**
 * Utility function to create a standardized success API response.
 * @param statusCode - HTTP status code to be sent in the response
 * @param message - A descriptive message about the response
 * @param data - Optional data payload to be included in the response
 * @returns 
 */
export const sendSuccess = <T> (
    statusCode?: number,
    message: string = 'Success',
    data?: T
): ApiResponse<T> => {
    return {
        success: true,
        statusCode,
        message,
        data,
        timestamp: new Date().toISOString()
    }
}

/**
 * Utility function to create a standardized error API response.
 * @param statusCode - HTTP status code to be sent in the response
 * @param message - A descriptive message about the error
 * @param errorCode - A specific error code to identify the type of error
 * @returns 
 */
export const sendError = (
    statusCode: number = 500,
    message: string = 'Internal Server Error',
    errorCode: string = 'INTERNAL_ERROR',
    errors?: any
): ApiResponse => {
    return {
        success: false,
        statusCode,
        message,
        errorCode,
        errors,
        timestamp: new Date().toISOString()
    }
}
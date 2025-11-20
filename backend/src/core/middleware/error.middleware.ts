import { Request, Response, NextFunction } from 'express';
import logger from '../logger/logger';

/**
 * Custom error class for application errors
 */
export class AppError extends Error {
    constructor(
        public statusCode: number,
        public message: string,
        public isOperational = true
    ) {
        super(message);
        Object.setPrototypeOf(this, AppError.prototype);
        Error.captureStackTrace(this, this.constructor);
    }
}

/**
 * Global error handling middleware
 * Catches all errors and sends appropriate responses
 */
export const errorHandler = (
    err: Error | AppError,
    req: Request,
    res: Response,
    next: NextFunction
): void => {
    // Default error values
    let statusCode = 500;
    let message = 'Internal Server Error';
    let isOperational = false;

    // Handle AppError
    if (err instanceof AppError) {
        statusCode = err.statusCode;
        message = err.message;
        isOperational = err.isOperational;
    }

    // Log error
    if (statusCode >= 500) {
        logger.error('Server Error:', {
            message: err.message,
            stack: err.stack,
            url: req.url,
            method: req.method,
            ip: req.ip,
        });
    } else {
        logger.warn('Client Error:', {
            message: err.message,
            url: req.url,
            method: req.method,
            statusCode,
        });
    }

    // Send error response
    res.status(statusCode).json({
        error: statusCode >= 500 ? 'Internal Server Error' : message,
        message: statusCode >= 500 && process.env.NODE_ENV === 'production'
            ? 'An unexpected error occurred'
            : message,
        ...(process.env.NODE_ENV === 'development' && {
            stack: err.stack,
            details: err,
        }),
    });
};

/**
 * 404 Not Found handler
 */
export const notFoundHandler = (
    req: Request,
    res: Response,
    next: NextFunction
): void => {
    const error = new AppError(404, `Route ${req.url} not found`);
    next(error);
};

/**
 * Async error wrapper
 * Wraps async route handlers to catch errors
 */
export const asyncHandler = (
    fn: (req: Request, res: Response, next: NextFunction) => Promise<any>
) => {
    return (req: Request, res: Response, next: NextFunction) => {
        Promise.resolve(fn(req, res, next)).catch(next);
    };
};

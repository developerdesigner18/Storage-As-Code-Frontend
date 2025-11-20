import { Request, Response, NextFunction } from 'express';
import logger from '../logger/logger';
import { prisma } from '../database/prisma.client';

/**
 * Request logging middleware
 * Logs all incoming HTTP requests with timing
 */
export const requestLogger = (
    req: Request,
    res: Response,
    next: NextFunction
): void => {
    const startTime = Date.now();

    // Log request
    logger.info('Incoming Request', {
        method: req.method,
        url: req.url,
        ip: req.ip,
        userAgent: req.get('user-agent'),
    });

    // Log response when finished
    res.on('finish', () => {
        const duration = Date.now() - startTime;

        logger.info('Request Completed', {
            method: req.method,
            url: req.url,
            statusCode: res.statusCode,
            duration: `${duration}ms`,
        });

        // Log to database for analytics
        if (process.env.NODE_ENV !== 'test') {
            prisma.log
                .create({
                    data: {
                        type: 'request',
                        message: `${req.method} ${req.url} - ${res.statusCode}`,
                        payload: JSON.stringify({
                            method: req.method,
                            url: req.url,
                            statusCode: res.statusCode,
                            duration,
                            ip: req.ip,
                        }),
                    },
                })
                .catch((err) => {
                    logger.error('Failed to log request to database:', err);
                });
        }
    });

    next();
};

/**
 * Performance monitoring middleware
 * Warns if request takes too long
 */
export const performanceMonitor = (
    req: Request,
    res: Response,
    next: NextFunction
): void => {
    const startTime = Date.now();

    res.on('finish', () => {
        const duration = Date.now() - startTime;

        // Warn if request takes more than 1 second
        if (duration > 1000) {
            logger.warn('Slow Request Detected', {
                method: req.method,
                url: req.url,
                duration: `${duration}ms`,
            });
        }
    });

    next();
};

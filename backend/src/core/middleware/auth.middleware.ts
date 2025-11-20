import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import config from '../config/config';
import logger from '../logger/logger';

export interface AuthRequest extends Request {
    user?: {
        id: string;
        email: string;
    };
}

/**
 * Authentication middleware
 * Verifies JWT token and attaches user to request
 */
export const authenticate = (
    req: AuthRequest,
    res: Response,
    next: NextFunction
): void => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            res.status(401).json({
                error: 'Unauthorized',
                message: 'No token provided',
            });
            return;
        }

        const token = authHeader.substring(7);

        try {
            const decoded = jwt.verify(token, config.jwt.secret) as {
                id: string;
                email: string;
            };

            req.user = {
                id: decoded.id,
                email: decoded.email,
            };

            logger.debug(`User authenticated: ${decoded.email}`);
            next();
        } catch (error) {
            logger.warn('Invalid token attempt', { error });
            res.status(401).json({
                error: 'Unauthorized',
                message: 'Invalid or expired token',
            });
            return;
        }
    } catch (error) {
        logger.error('Authentication middleware error:', error);
        res.status(500).json({
            error: 'Internal Server Error',
            message: 'Authentication failed',
        });
        return;
    }
};

/**
 * Optional authentication middleware
 * Attaches user if token is valid, but doesn't reject if missing
 */
export const optionalAuthenticate = (
    req: AuthRequest,
    res: Response,
    next: NextFunction
): void => {
    try {
        const authHeader = req.headers.authorization;

        if (authHeader && authHeader.startsWith('Bearer ')) {
            const token = authHeader.substring(7);

            try {
                const decoded = jwt.verify(token, config.jwt.secret) as {
                    id: string;
                    email: string;
                };

                req.user = {
                    id: decoded.id,
                    email: decoded.email,
                };
            } catch (error) {
                // Token invalid, but we don't reject the request
                logger.debug('Optional auth: Invalid token', { error });
            }
        }

        next();
    } catch (error) {
        logger.error('Optional authentication middleware error:', error);
        next();
    }
};

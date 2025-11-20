import { Request, Response } from 'express';
import { AuthService } from './auth.service';
import { LoginDtoSchema, RegisterDtoSchema } from './auth.dto';
import { AppError } from '../../core/middleware/error.middleware';
import logger from '../../core/logger/logger';

/**
 * Auth Controller
 * Handles HTTP requests for authentication
 */
export class AuthController {
    private authService: AuthService;

    constructor(authService: AuthService) {
        this.authService = authService;
    }

    /**
     * Login endpoint
     * POST /api/auth/login
     */
    login = async (req: Request, res: Response): Promise<void> => {
        try {
            // Validate request body
            const validatedData = LoginDtoSchema.parse(req.body);

            // Login user
            const result = await this.authService.login(validatedData);

            res.status(200).json(result);
        } catch (error) {
            if (error instanceof AppError) {
                throw error;
            }
            logger.error('Login controller error:', error);
            throw new AppError(400, 'Invalid login request');
        }
    };

    /**
     * Register endpoint
     * POST /api/auth/register
     */
    register = async (req: Request, res: Response): Promise<void> => {
        try {
            // Validate request body
            const validatedData = RegisterDtoSchema.parse(req.body);

            // Register user
            const result = await this.authService.register(validatedData);

            res.status(201).json(result);
        } catch (error) {
            if (error instanceof AppError) {
                throw error;
            }
            logger.error('Register controller error:', error);
            throw new AppError(400, 'Invalid registration request');
        }
    };

    /**
     * Get current user endpoint
     * GET /api/auth/me
     */
    getCurrentUser = async (req: Request, res: Response): Promise<void> => {
        try {
            const userId = (req as any).user?.id;

            if (!userId) {
                throw new AppError(401, 'Unauthorized');
            }

            const user = await this.authService.getUserById(userId);

            res.status(200).json(user);
        } catch (error) {
            if (error instanceof AppError) {
                throw error;
            }
            logger.error('Get current user error:', error);
            throw new AppError(500, 'Failed to get user');
        }
    };
}

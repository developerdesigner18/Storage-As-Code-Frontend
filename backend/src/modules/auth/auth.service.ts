import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { AuthRepository } from './auth.repository';
import { LoginDto, RegisterDto, AuthResponseDto, UserDto } from './auth.dto';
import { AppError } from '../../core/middleware/error.middleware';
import config from '../../core/config/config';
import logger from '../../core/logger/logger';

/**
 * Auth Service
 * Handles business logic for authentication
 */
export class AuthService {
    private authRepository: AuthRepository;
    private readonly saltRounds = 10;

    constructor(authRepository: AuthRepository) {
        this.authRepository = authRepository;
    }

    /**
     * Login user
     */
    async login(loginDto: LoginDto): Promise<AuthResponseDto> {
        try {
            const { email, password } = loginDto;

            // Find user
            const user = await this.authRepository.findByEmail(email);
            if (!user) {
                throw new AppError(401, 'Invalid email or password');
            }

            // Verify password
            const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
            if (!isPasswordValid) {
                throw new AppError(401, 'Invalid email or password');
            }

            // Generate JWT token
            const token = this.generateToken(user.id, user.email);

            logger.info(`User logged in: ${email}`);

            return {
                token,
                user: {
                    id: user.id,
                    email: user.email,
                },
            };
        } catch (error) {
            if (error instanceof AppError) {
                throw error;
            }
            logger.error('Login error:', error);
            throw new AppError(500, 'Login failed');
        }
    }

    /**
     * Register new user
     */
    async register(registerDto: RegisterDto): Promise<AuthResponseDto> {
        try {
            const { email, password } = registerDto;

            // Check if user already exists
            const existingUser = await this.authRepository.findByEmail(email);
            if (existingUser) {
                throw new AppError(409, 'User with this email already exists');
            }

            // Hash password
            const passwordHash = await bcrypt.hash(password, this.saltRounds);

            // Create user
            const user = await this.authRepository.create(email, passwordHash);

            // Generate JWT token
            const token = this.generateToken(user.id, user.email);

            logger.info(`User registered: ${email}`);

            return {
                token,
                user: {
                    id: user.id,
                    email: user.email,
                },
            };
        } catch (error) {
            if (error instanceof AppError) {
                throw error;
            }
            logger.error('Registration error:', error);
            throw new AppError(500, 'Registration failed');
        }
    }

    /**
     * Get user by ID
     */
    async getUserById(id: string): Promise<UserDto> {
        try {
            const user = await this.authRepository.findById(id);
            if (!user) {
                throw new AppError(404, 'User not found');
            }

            return {
                id: user.id,
                email: user.email,
                createdAt: user.createdAt,
            };
        } catch (error) {
            if (error instanceof AppError) {
                throw error;
            }
            logger.error('Get user error:', error);
            throw new AppError(500, 'Failed to get user');
        }
    }

    /**
     * Verify JWT token
     */
    verifyToken(token: string): { id: string; email: string } {
        try {
            const decoded = jwt.verify(token, config.jwt.secret) as {
                id: string;
                email: string;
            };
            return decoded;
        } catch (error) {
            throw new AppError(401, 'Invalid or expired token');
        }
    }

    /**
     * Generate JWT token
     */
    private generateToken(id: string, email: string): string {
        return jwt.sign({ id, email }, config.jwt.secret, {
            expiresIn: config.jwt.expiresIn,
        });
    }

    /**
     * Hash password
     */
    async hashPassword(password: string): Promise<string> {
        return bcrypt.hash(password, this.saltRounds);
    }

    /**
     * Compare password
     */
    async comparePassword(password: string, hash: string): Promise<boolean> {
        return bcrypt.compare(password, hash);
    }
}

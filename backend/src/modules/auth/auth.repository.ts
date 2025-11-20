import { User } from '@prisma/client';
import { prisma } from '../../core/database/prisma.client';
import logger from '../../core/logger/logger';

/**
 * Auth Repository
 * Handles all database operations for authentication
 */
export class AuthRepository {
    /**
     * Find user by email
     */
    async findByEmail(email: string): Promise<User | null> {
        try {
            return await prisma.user.findUnique({
                where: { email },
            });
        } catch (error) {
            logger.error('Error finding user by email:', error);
            throw error;
        }
    }

    /**
     * Find user by ID
     */
    async findById(id: string): Promise<User | null> {
        try {
            return await prisma.user.findUnique({
                where: { id },
            });
        } catch (error) {
            logger.error('Error finding user by ID:', error);
            throw error;
        }
    }

    /**
     * Create new user
     */
    async create(email: string, passwordHash: string): Promise<User> {
        try {
            return await prisma.user.create({
                data: {
                    email,
                    passwordHash,
                },
            });
        } catch (error) {
            logger.error('Error creating user:', error);
            throw error;
        }
    }

    /**
     * Update user password
     */
    async updatePassword(id: string, passwordHash: string): Promise<User> {
        try {
            return await prisma.user.update({
                where: { id },
                data: { passwordHash },
            });
        } catch (error) {
            logger.error('Error updating user password:', error);
            throw error;
        }
    }

    /**
     * Delete user
     */
    async delete(id: string): Promise<void> {
        try {
            await prisma.user.delete({
                where: { id },
            });
        } catch (error) {
            logger.error('Error deleting user:', error);
            throw error;
        }
    }

    /**
     * Get all users
     */
    async findAll(): Promise<User[]> {
        try {
            return await prisma.user.findMany({
                select: {
                    id: true,
                    email: true,
                    createdAt: true,
                    updatedAt: true,
                    passwordHash: false,
                },
            }) as User[];
        } catch (error) {
            logger.error('Error finding all users:', error);
            throw error;
        }
    }
}

import { Volume } from '@prisma/client';
import { prisma } from '../../core/database/prisma.client';
import logger from '../../core/logger/logger';
import { VolumeQueryDto } from './volume.dto';

/**
 * Volume Repository
 * Handles all database operations for volumes
 */
export class VolumeRepository {
    /**
     * Create new volume
     */
    async create(data: {
        name: string;
        sizeGb: number;
        performanceClass: string;
        protectionPolicy: string;
        environment: string;
        tags: string;
        status: string;
        placement?: string;
        fusionVolumeId?: string;
        createdBy: string;
    }): Promise<Volume> {
        try {
            return await prisma.volume.create({
                data,
            });
        } catch (error) {
            logger.error('Error creating volume:', error);
            throw error;
        }
    }

    /**
     * Find volume by ID
     */
    async findById(id: string): Promise<Volume | null> {
        try {
            return await prisma.volume.findUnique({
                where: { id },
            });
        } catch (error) {
            logger.error('Error finding volume by ID:', error);
            throw error;
        }
    }

    /**
     * Find volume by name
     */
    async findByName(name: string): Promise<Volume | null> {
        try {
            return await prisma.volume.findUnique({
                where: { name },
            });
        } catch (error) {
            logger.error('Error finding volume by name:', error);
            throw error;
        }
    }

    /**
     * Find all volumes with optional filters
     */
    async findAll(query?: VolumeQueryDto): Promise<{ volumes: Volume[]; total: number }> {
        try {
            const where: any = {};

            if (query?.status) {
                where.status = query.status;
            }
            if (query?.environment) {
                where.environment = query.environment;
            }
            if (query?.performance_class) {
                where.performanceClass = query.performance_class;
            }

            const [volumes, total] = await Promise.all([
                prisma.volume.findMany({
                    where,
                    orderBy: { createdAt: 'desc' },
                    skip: query?.page && query?.pageSize ? (query.page - 1) * query.pageSize : undefined,
                    take: query?.pageSize,
                }),
                prisma.volume.count({ where }),
            ]);

            return { volumes, total };
        } catch (error) {
            logger.error('Error finding all volumes:', error);
            throw error;
        }
    }

    /**
     * Find volumes by user
     */
    async findByUser(userId: string): Promise<Volume[]> {
        try {
            return await prisma.volume.findMany({
                where: { createdBy: userId },
                orderBy: { createdAt: 'desc' },
            });
        } catch (error) {
            logger.error('Error finding volumes by user:', error);
            throw error;
        }
    }

    /**
     * Update volume
     */
    async update(id: string, data: Partial<Volume>): Promise<Volume> {
        try {
            return await prisma.volume.update({
                where: { id },
                data,
            });
        } catch (error) {
            logger.error('Error updating volume:', error);
            throw error;
        }
    }

    /**
     * Update volume status
     */
    async updateStatus(id: string, status: string): Promise<Volume> {
        try {
            return await prisma.volume.update({
                where: { id },
                data: { status },
            });
        } catch (error) {
            logger.error('Error updating volume status:', error);
            throw error;
        }
    }

    /**
     * Delete volume
     */
    async delete(id: string): Promise<void> {
        try {
            await prisma.volume.delete({
                where: { id },
            });
        } catch (error) {
            logger.error('Error deleting volume:', error);
            throw error;
        }
    }

    /**
     * Check if volume name exists
     */
    async nameExists(name: string): Promise<boolean> {
        try {
            const volume = await prisma.volume.findUnique({
                where: { name },
            });
            return !!volume;
        } catch (error) {
            logger.error('Error checking volume name:', error);
            throw error;
        }
    }
}

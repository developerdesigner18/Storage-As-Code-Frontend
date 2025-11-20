import { Response } from 'express';
import { VolumeService } from './volume.service';
import { CreateVolumeDtoSchema, UpdateVolumeDtoSchema, VolumeQueryDtoSchema } from './volume.dto';
import { AppError } from '../../core/middleware/error.middleware';
import { AuthRequest } from '../../core/middleware/auth.middleware';
import logger from '../../core/logger/logger';

/**
 * Volume Controller
 * Handles HTTP requests for volume management
 */
export class VolumeController {
    private volumeService: VolumeService;

    constructor(volumeService: VolumeService) {
        this.volumeService = volumeService;
    }

    /**
     * Create volume endpoint
     * POST /api/volumes
     */
    createVolume = async (req: AuthRequest, res: Response): Promise<void> => {
        try {
            if (!req.user) {
                throw new AppError(401, 'Unauthorized');
            }

            // Validate request body
            const validatedData = CreateVolumeDtoSchema.parse(req.body);

            // Create volume
            const volume = await this.volumeService.createVolume(validatedData, req.user.id);

            res.status(201).json(volume);
        } catch (error) {
            if (error instanceof AppError) {
                throw error;
            }
            logger.error('Create volume controller error:', error);
            throw new AppError(400, 'Invalid volume creation request');
        }
    };

    /**
     * Get all volumes endpoint
     * GET /api/volumes
     */
    getVolumes = async (req: AuthRequest, res: Response): Promise<void> => {
        try {
            // Parse query parameters
            const query = VolumeQueryDtoSchema.parse({
                page: req.query.page ? parseInt(req.query.page as string) : undefined,
                pageSize: req.query.pageSize ? parseInt(req.query.pageSize as string) : undefined,
                status: req.query.status,
                environment: req.query.environment,
                performance_class: req.query.performance_class,
            });

            const result = await this.volumeService.getVolumes(query);

            res.status(200).json(result);
        } catch (error) {
            if (error instanceof AppError) {
                throw error;
            }
            logger.error('Get volumes controller error:', error);
            throw new AppError(400, 'Invalid query parameters');
        }
    };

    /**
     * Get volume by ID endpoint
     * GET /api/volumes/:id
     */
    getVolumeById = async (req: AuthRequest, res: Response): Promise<void> => {
        try {
            const { id } = req.params;

            const volume = await this.volumeService.getVolumeById(id);

            res.status(200).json(volume);
        } catch (error) {
            if (error instanceof AppError) {
                throw error;
            }
            logger.error('Get volume by ID controller error:', error);
            throw new AppError(500, 'Failed to get volume');
        }
    };

    /**
     * Update volume endpoint
     * PATCH /api/volumes/:id
     */
    updateVolume = async (req: AuthRequest, res: Response): Promise<void> => {
        try {
            const { id } = req.params;

            // Validate request body
            const validatedData = UpdateVolumeDtoSchema.parse(req.body);

            const volume = await this.volumeService.updateVolume(id, validatedData);

            res.status(200).json(volume);
        } catch (error) {
            if (error instanceof AppError) {
                throw error;
            }
            logger.error('Update volume controller error:', error);
            throw new AppError(400, 'Invalid volume update request');
        }
    };

    /**
     * Delete volume endpoint
     * DELETE /api/volumes/:id
     */
    deleteVolume = async (req: AuthRequest, res: Response): Promise<void> => {
        try {
            const { id } = req.params;

            await this.volumeService.deleteVolume(id);

            res.status(200).json({
                message: 'Volume deleted successfully',
            });
        } catch (error) {
            if (error instanceof AppError) {
                throw error;
            }
            logger.error('Delete volume controller error:', error);
            throw new AppError(500, 'Failed to delete volume');
        }
    };
}

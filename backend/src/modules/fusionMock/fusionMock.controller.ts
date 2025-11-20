import { Request, Response } from 'express';
import { FusionMockService } from './fusionMock.service';
import logger from '../../core/logger/logger';

/**
 * Fusion Mock Controller
 * Handles HTTP requests for the mock Fusion API
 */
export class FusionMockController {
    private fusionMockService: FusionMockService;

    constructor(fusionMockService: FusionMockService) {
        this.fusionMockService = fusionMockService;
    }

    /**
     * Create volume
     * POST /v1/volumes
     */
    createVolume = async (req: Request, res: Response): Promise<void> => {
        try {
            const volume = await this.fusionMockService.createVolume(req.body);
            res.status(200).json(volume);
        } catch (error: any) {
            logger.error('Fusion Mock create volume error:', error);

            if (error.message === 'DUPLICATE_NAME') {
                res.status(409).json({
                    error: 'Conflict',
                    message: 'Volume with this name already exists',
                });
                return;
            }

            if (error.message.startsWith('VALIDATION_ERROR')) {
                res.status(400).json({
                    error: 'Bad Request',
                    message: error.message.replace('VALIDATION_ERROR: ', ''),
                });
                return;
            }

            if (error.message === 'INTERNAL_ERROR') {
                res.status(500).json({
                    error: 'Internal Server Error',
                    message: 'An unexpected error occurred',
                });
                return;
            }

            res.status(500).json({
                error: 'Internal Server Error',
                message: 'Failed to create volume',
            });
        }
    };

    /**
     * Get volume by ID
     * GET /v1/volumes/:id
     */
    getVolume = async (req: Request, res: Response): Promise<void> => {
        try {
            const { id } = req.params;
            const volume = await this.fusionMockService.getVolume(id);
            res.status(200).json(volume);
        } catch (error: any) {
            if (error.message === 'NOT_FOUND') {
                res.status(404).json({
                    error: 'Not Found',
                    message: 'Volume not found',
                });
                return;
            }

            res.status(500).json({
                error: 'Internal Server Error',
                message: 'Failed to get volume',
            });
        }
    };

    /**
     * Get all volumes
     * GET /v1/volumes
     */
    getAllVolumes = async (req: Request, res: Response): Promise<void> => {
        try {
            const volumes = await this.fusionMockService.getAllVolumes();
            res.status(200).json({
                volumes,
                total: volumes.length,
            });
        } catch (error) {
            logger.error('Fusion Mock get all volumes error:', error);
            res.status(500).json({
                error: 'Internal Server Error',
                message: 'Failed to get volumes',
            });
        }
    };

    /**
     * Delete volume
     * DELETE /v1/volumes/:id
     */
    deleteVolume = async (req: Request, res: Response): Promise<void> => {
        try {
            const { id } = req.params;
            await this.fusionMockService.deleteVolume(id);
            res.status(200).json({
                message: 'Volume deletion initiated',
            });
        } catch (error: any) {
            if (error.message === 'NOT_FOUND') {
                res.status(404).json({
                    error: 'Not Found',
                    message: 'Volume not found',
                });
                return;
            }

            res.status(500).json({
                error: 'Internal Server Error',
                message: 'Failed to delete volume',
            });
        }
    };

    /**
     * Health check
     * GET /v1/health
     */
    healthCheck = async (req: Request, res: Response): Promise<void> => {
        res.status(200).json({
            status: 'healthy',
            service: 'Pure Fusion Mock API',
            timestamp: new Date().toISOString(),
            volumes: this.fusionMockService.getVolumeCount(),
        });
    };
}

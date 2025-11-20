import axios from 'axios';
import { VolumeRepository } from './volume.repository';
import {
    CreateVolumeDto,
    UpdateVolumeDto,
    VolumeResponseDto,
    VolumeListResponseDto,
    VolumeQueryDto,
    TagDto,
} from './volume.dto';
import { AppError } from '../../core/middleware/error.middleware';
import config from '../../core/config/config';
import logger from '../../core/logger/logger';
import { prisma } from '../../core/database/prisma.client';

/**
 * Volume Service
 * Handles business logic for volume management
 */
export class VolumeService {
    private volumeRepository: VolumeRepository;
    private fusionApiUrl: string;

    constructor(volumeRepository: VolumeRepository) {
        this.volumeRepository = volumeRepository;
        this.fusionApiUrl = config.fusionMock.url;
    }

    /**
     * Create new volume
     */
    async createVolume(
        createVolumeDto: CreateVolumeDto,
        userId: string
    ): Promise<VolumeResponseDto> {
        try {
            const { name, size_gb, performance_class, protection_policy, environment, tags } =
                createVolumeDto;

            // Check if volume name already exists
            const existingVolume = await this.volumeRepository.findByName(name);
            if (existingVolume) {
                throw new AppError(409, `Volume with name '${name}' already exists`);
            }

            // Call Fusion Mock API to create volume
            let fusionResponse;
            try {
                fusionResponse = await axios.post(`${this.fusionApiUrl}/v1/volumes`, {
                    name,
                    size_gb,
                    performance_class,
                    protection_policy,
                    environment,
                });
            } catch (error: any) {
                if (error.response) {
                    // Fusion API returned an error
                    const status = error.response.status;
                    const message = error.response.data?.message || 'Fusion API error';

                    logger.error('Fusion API error:', {
                        status,
                        message,
                        data: error.response.data,
                    });

                    if (status === 409) {
                        throw new AppError(409, 'Volume name already exists in Fusion');
                    } else if (status === 400) {
                        throw new AppError(400, `Invalid volume data: ${message}`);
                    } else if (status === 500) {
                        throw new AppError(500, 'Fusion API internal error');
                    }

                    throw new AppError(500, `Fusion API error: ${message}`);
                }

                // Network or other error
                logger.error('Failed to connect to Fusion API:', error);
                throw new AppError(503, 'Storage service unavailable');
            }

            const fusionVolume = fusionResponse.data;

            // Save volume to database
            const volume = await this.volumeRepository.create({
                name,
                sizeGb: size_gb,
                performanceClass: performance_class,
                protectionPolicy: protection_policy,
                environment,
                tags: JSON.stringify(tags || []),
                status: fusionVolume.status || 'creating',
                placement: fusionVolume.placement,
                fusionVolumeId: fusionVolume.id,
                createdBy: userId,
            });

            // Log volume creation
            await this.logVolumeEvent('lifecycle', `Volume created: ${name}`, {
                volumeId: volume.id,
                fusionVolumeId: fusionVolume.id,
                status: volume.status,
            }, userId);

            logger.info(`Volume created: ${name} (${volume.id})`);

            // Start monitoring for status updates
            this.monitorVolumeStatus(volume.id, fusionVolume.id);

            return this.mapToResponseDto(volume);
        } catch (error) {
            if (error instanceof AppError) {
                throw error;
            }
            logger.error('Create volume error:', error);
            throw new AppError(500, 'Failed to create volume');
        }
    }

    /**
     * Get all volumes
     */
    async getVolumes(query?: VolumeQueryDto): Promise<VolumeListResponseDto> {
        try {
            const { volumes, total } = await this.volumeRepository.findAll(query);

            return {
                volumes: volumes.map((v) => this.mapToResponseDto(v)),
                total,
                page: query?.page,
                pageSize: query?.pageSize,
            };
        } catch (error) {
            logger.error('Get volumes error:', error);
            throw new AppError(500, 'Failed to get volumes');
        }
    }

    /**
     * Get volume by ID
     */
    async getVolumeById(id: string): Promise<VolumeResponseDto> {
        try {
            const volume = await this.volumeRepository.findById(id);
            if (!volume) {
                throw new AppError(404, 'Volume not found');
            }

            return this.mapToResponseDto(volume);
        } catch (error) {
            if (error instanceof AppError) {
                throw error;
            }
            logger.error('Get volume by ID error:', error);
            throw new AppError(500, 'Failed to get volume');
        }
    }

    /**
     * Update volume
     */
    async updateVolume(
        id: string,
        updateVolumeDto: UpdateVolumeDto
    ): Promise<VolumeResponseDto> {
        try {
            const volume = await this.volumeRepository.findById(id);
            if (!volume) {
                throw new AppError(404, 'Volume not found');
            }

            const updateData: any = {};

            if (updateVolumeDto.size_gb !== undefined) {
                updateData.sizeGb = updateVolumeDto.size_gb;
            }
            if (updateVolumeDto.performance_class !== undefined) {
                updateData.performanceClass = updateVolumeDto.performance_class;
            }
            if (updateVolumeDto.protection_policy !== undefined) {
                updateData.protectionPolicy = updateVolumeDto.protection_policy;
            }
            if (updateVolumeDto.tags !== undefined) {
                updateData.tags = JSON.stringify(updateVolumeDto.tags);
            }

            const updatedVolume = await this.volumeRepository.update(id, updateData);

            logger.info(`Volume updated: ${updatedVolume.name} (${id})`);

            return this.mapToResponseDto(updatedVolume);
        } catch (error) {
            if (error instanceof AppError) {
                throw error;
            }
            logger.error('Update volume error:', error);
            throw new AppError(500, 'Failed to update volume');
        }
    }

    /**
     * Delete volume
     */
    async deleteVolume(id: string): Promise<void> {
        try {
            const volume = await this.volumeRepository.findById(id);
            if (!volume) {
                throw new AppError(404, 'Volume not found');
            }

            // Call Fusion Mock API to delete volume
            if (volume.fusionVolumeId) {
                try {
                    await axios.delete(`${this.fusionApiUrl}/v1/volumes/${volume.fusionVolumeId}`);
                } catch (error: any) {
                    if (error.response?.status === 404) {
                        logger.warn(`Volume not found in Fusion: ${volume.fusionVolumeId}`);
                    } else {
                        logger.error('Failed to delete volume from Fusion:', error);
                        throw new AppError(500, 'Failed to delete volume from storage');
                    }
                }
            }

            // Delete from database
            await this.volumeRepository.delete(id);

            logger.info(`Volume deleted: ${volume.name} (${id})`);
        } catch (error) {
            if (error instanceof AppError) {
                throw error;
            }
            logger.error('Delete volume error:', error);
            throw new AppError(500, 'Failed to delete volume');
        }
    }

    /**
     * Monitor volume status updates from Fusion API
     */
    private async monitorVolumeStatus(volumeId: string, fusionVolumeId: string): Promise<void> {
        // Poll Fusion API for status updates
        const checkStatus = async () => {
            try {
                const response = await axios.get(`${this.fusionApiUrl}/v1/volumes/${fusionVolumeId}`);
                const fusionVolume = response.data;

                const currentVolume = await this.volumeRepository.findById(volumeId);
                if (!currentVolume) {
                    return; // Volume was deleted
                }

                if (fusionVolume.status !== currentVolume.status) {
                    await this.volumeRepository.updateStatus(volumeId, fusionVolume.status);

                    await this.logVolumeEvent(
                        'lifecycle',
                        `Volume status changed: ${currentVolume.status} -> ${fusionVolume.status}`,
                        {
                            volumeId,
                            oldStatus: currentVolume.status,
                            newStatus: fusionVolume.status,
                        }
                    );

                    logger.info(`Volume status updated: ${currentVolume.name} -> ${fusionVolume.status}`);
                }

                // Continue monitoring if still creating
                if (fusionVolume.status === 'creating') {
                    setTimeout(checkStatus, 2000); // Check every 2 seconds
                }
            } catch (error) {
                logger.error('Error monitoring volume status:', error);
            }
        };

        // Start monitoring after a short delay
        setTimeout(checkStatus, 2000);
    }

    /**
     * Log volume event
     */
    private async logVolumeEvent(
        type: string,
        message: string,
        payload?: any,
        userId?: string
    ): Promise<void> {
        try {
            await prisma.log.create({
                data: {
                    type,
                    message,
                    payload: payload ? JSON.stringify(payload) : null,
                    userId: userId || null,
                },
            });
        } catch (error) {
            logger.error('Failed to log volume event:', error);
        }
    }

    /**
     * Map database volume to response DTO
     */
    private mapToResponseDto(volume: any): VolumeResponseDto {
        let tags: TagDto[] = [];
        try {
            tags = JSON.parse(volume.tags || '[]');
        } catch (error) {
            logger.warn('Failed to parse volume tags:', error);
        }

        return {
            id: volume.id,
            name: volume.name,
            size_gb: volume.sizeGb,
            performance_class: volume.performanceClass,
            protection_policy: volume.protectionPolicy,
            environment: volume.environment,
            tags,
            status: volume.status,
            placement: volume.placement,
            fusion_volume_id: volume.fusionVolumeId,
            created_by: volume.createdBy,
            created_at: volume.createdAt,
            updated_at: volume.updatedAt,
        };
    }
}

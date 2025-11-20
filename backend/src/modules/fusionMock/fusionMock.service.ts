import { v4 as uuidv4 } from 'uuid';
import logger from '../../core/logger/logger';

/**
 * Fusion Volume interface
 */
export interface FusionVolume {
    id: string;
    name: string;
    size_gb: number;
    performance_class: string;
    protection_policy: string;
    environment: string;
    status: 'creating' | 'ready' | 'failed' | 'deleting';
    placement: string;
    created_at: Date;
    updated_at: Date;
}

/**
 * Fusion Mock Service
 * Simulates Pure Fusion API behavior
 */
export class FusionMockService {
    private volumes: Map<string, FusionVolume> = new Map();
    private volumesByName: Map<string, string> = new Map(); // name -> id mapping

    /**
     * Create volume
     * Simulates async volume creation with random errors
     */
    async createVolume(data: {
        name: string;
        size_gb: number;
        performance_class: string;
        protection_policy: string;
        environment: string;
    }): Promise<FusionVolume> {
        // Simulate 10% chance of internal error
        if (Math.random() < 0.1) {
            logger.warn('Fusion Mock: Simulating 500 internal error');
            throw new Error('INTERNAL_ERROR');
        }

        // Validate data
        if (!data.name || data.name.length < 3) {
            throw new Error('VALIDATION_ERROR: Invalid volume name');
        }

        if (data.size_gb < 10 || data.size_gb > 5000) {
            throw new Error('VALIDATION_ERROR: Size must be between 10 and 5000 GB');
        }

        // Check for duplicate name
        if (this.volumesByName.has(data.name)) {
            throw new Error('DUPLICATE_NAME');
        }

        // Create volume
        const volumeId = uuidv4();
        const placement = this.generatePlacement();

        const volume: FusionVolume = {
            id: volumeId,
            name: data.name,
            size_gb: data.size_gb,
            performance_class: data.performance_class,
            protection_policy: data.protection_policy,
            environment: data.environment,
            status: 'creating',
            placement,
            created_at: new Date(),
            updated_at: new Date(),
        };

        this.volumes.set(volumeId, volume);
        this.volumesByName.set(data.name, volumeId);

        logger.info(`Fusion Mock: Volume created - ${data.name} (${volumeId})`);

        // Simulate async operation - update to 'ready' after 5 seconds
        this.scheduleStatusUpdate(volumeId, 5000);

        return volume;
    }

    /**
     * Get volume by ID
     */
    async getVolume(id: string): Promise<FusionVolume> {
        const volume = this.volumes.get(id);
        if (!volume) {
            throw new Error('NOT_FOUND');
        }
        return volume;
    }

    /**
     * Get all volumes
     */
    async getAllVolumes(): Promise<FusionVolume[]> {
        return Array.from(this.volumes.values());
    }

    /**
     * Delete volume
     */
    async deleteVolume(id: string): Promise<void> {
        const volume = this.volumes.get(id);
        if (!volume) {
            throw new Error('NOT_FOUND');
        }

        // Update status to deleting
        volume.status = 'deleting';
        volume.updated_at = new Date();

        logger.info(`Fusion Mock: Volume deleting - ${volume.name} (${id})`);

        // Simulate async deletion - remove after 2 seconds
        setTimeout(() => {
            this.volumes.delete(id);
            this.volumesByName.delete(volume.name);
            logger.info(`Fusion Mock: Volume deleted - ${volume.name} (${id})`);
        }, 2000);
    }

    /**
     * Update volume status
     */
    async updateVolumeStatus(id: string, status: FusionVolume['status']): Promise<FusionVolume> {
        const volume = this.volumes.get(id);
        if (!volume) {
            throw new Error('NOT_FOUND');
        }

        volume.status = status;
        volume.updated_at = new Date();

        logger.info(`Fusion Mock: Volume status updated - ${volume.name}: ${status}`);

        return volume;
    }

    /**
     * Schedule status update
     * Simulates long-running operation
     */
    private scheduleStatusUpdate(volumeId: string, delayMs: number): void {
        setTimeout(async () => {
            try {
                const volume = this.volumes.get(volumeId);
                if (volume && volume.status === 'creating') {
                    volume.status = 'ready';
                    volume.updated_at = new Date();
                    logger.info(`Fusion Mock: Volume ready - ${volume.name} (${volumeId})`);
                }
            } catch (error) {
                logger.error('Error updating volume status:', error);
            }
        }, delayMs);
    }

    /**
     * Generate random placement string
     */
    private generatePlacement(): string {
        const arrays = ['array-01', 'array-02', 'array-03'];
        const shelves = ['shelf-01', 'shelf-02', 'shelf-03', 'shelf-04'];

        const randomArray = arrays[Math.floor(Math.random() * arrays.length)];
        const randomShelf = shelves[Math.floor(Math.random() * shelves.length)];

        return `${randomArray}-${randomShelf}`;
    }

    /**
     * Clear all volumes (for testing)
     */
    clearAll(): void {
        this.volumes.clear();
        this.volumesByName.clear();
        logger.info('Fusion Mock: All volumes cleared');
    }

    /**
     * Get volume count
     */
    getVolumeCount(): number {
        return this.volumes.size;
    }
}

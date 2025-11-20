import { FusionMockService } from '../modules/fusionMock/fusionMock.service';

describe('FusionMockService', () => {
    let fusionMockService: FusionMockService;

    beforeEach(() => {
        fusionMockService = new FusionMockService();
    });

    afterEach(() => {
        fusionMockService.clearAll();
    });

    describe('createVolume', () => {
        const mockVolumeData = {
            name: 'test-volume',
            size_gb: 100,
            performance_class: 'gold',
            protection_policy: 'daily',
            environment: 'dev',
        };

        it('should create volume with creating status', async () => {
            const volume = await fusionMockService.createVolume(mockVolumeData);

            expect(volume).toBeDefined();
            expect(volume.id).toBeDefined();
            expect(volume.name).toBe('test-volume');
            expect(volume.status).toBe('creating');
            expect(volume.placement).toBeDefined();
        });

        it('should throw error for duplicate volume name', async () => {
            await fusionMockService.createVolume(mockVolumeData);

            await expect(fusionMockService.createVolume(mockVolumeData)).rejects.toThrow(
                'DUPLICATE_NAME'
            );
        });

        it('should throw validation error for invalid size', async () => {
            const invalidData = {
                ...mockVolumeData,
                size_gb: 5, // Below minimum
            };

            await expect(fusionMockService.createVolume(invalidData)).rejects.toThrow(
                'VALIDATION_ERROR'
            );
        });

        it('should throw validation error for invalid name', async () => {
            const invalidData = {
                ...mockVolumeData,
                name: 'ab', // Too short
            };

            await expect(fusionMockService.createVolume(invalidData)).rejects.toThrow(
                'VALIDATION_ERROR'
            );
        });

        it('should update status to ready after delay', async () => {
            jest.useFakeTimers();

            const volume = await fusionMockService.createVolume(mockVolumeData);
            expect(volume.status).toBe('creating');

            // Fast-forward time by 5 seconds
            jest.advanceTimersByTime(5000);

            // Wait for async operations
            await new Promise((resolve) => setImmediate(resolve));

            const updatedVolume = await fusionMockService.getVolume(volume.id);
            expect(updatedVolume.status).toBe('ready');

            jest.useRealTimers();
        });
    });

    describe('getVolume', () => {
        it('should return volume if exists', async () => {
            const created = await fusionMockService.createVolume({
                name: 'test-volume',
                size_gb: 100,
                performance_class: 'gold',
                protection_policy: 'daily',
                environment: 'dev',
            });

            const volume = await fusionMockService.getVolume(created.id);

            expect(volume).toBeDefined();
            expect(volume.id).toBe(created.id);
        });

        it('should throw error if volume not found', async () => {
            await expect(fusionMockService.getVolume('non-existent')).rejects.toThrow('NOT_FOUND');
        });
    });

    describe('deleteVolume', () => {
        it('should delete volume successfully', async () => {
            const volume = await fusionMockService.createVolume({
                name: 'test-volume',
                size_gb: 100,
                performance_class: 'gold',
                protection_policy: 'daily',
                environment: 'dev',
            });

            await fusionMockService.deleteVolume(volume.id);

            // Volume should still exist but with deleting status
            const deletingVolume = await fusionMockService.getVolume(volume.id);
            expect(deletingVolume.status).toBe('deleting');
        });

        it('should throw error if volume not found', async () => {
            await expect(fusionMockService.deleteVolume('non-existent')).rejects.toThrow('NOT_FOUND');
        });
    });

    describe('getAllVolumes', () => {
        it('should return empty array initially', async () => {
            const volumes = await fusionMockService.getAllVolumes();
            expect(volumes).toEqual([]);
        });

        it('should return all created volumes', async () => {
            await fusionMockService.createVolume({
                name: 'volume-1',
                size_gb: 100,
                performance_class: 'gold',
                protection_policy: 'daily',
                environment: 'dev',
            });

            await fusionMockService.createVolume({
                name: 'volume-2',
                size_gb: 200,
                performance_class: 'silver',
                protection_policy: 'hourly',
                environment: 'prod',
            });

            const volumes = await fusionMockService.getAllVolumes();
            expect(volumes).toHaveLength(2);
        });
    });
});

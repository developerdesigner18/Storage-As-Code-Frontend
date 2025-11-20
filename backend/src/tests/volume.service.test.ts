import { VolumeService } from '../modules/volumes/volume.service';
import { VolumeRepository } from '../modules/volumes/volume.repository';
import { CreateVolumeDto } from '../modules/volumes/volume.dto';
import { AppError } from '../core/middleware/error.middleware';

// Mock the repository
jest.mock('../modules/volumes/volume.repository');
jest.mock('axios');

describe('VolumeService', () => {
    let volumeService: VolumeService;
    let volumeRepository: jest.Mocked<VolumeRepository>;

    beforeEach(() => {
        volumeRepository = new VolumeRepository() as jest.Mocked<VolumeRepository>;
        volumeService = new VolumeService(volumeRepository);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('createVolume', () => {
        const mockCreateDto: CreateVolumeDto = {
            name: 'test-volume',
            size_gb: 100,
            performance_class: 'gold',
            protection_policy: 'daily',
            environment: 'dev',
            tags: [{ key: 'team', value: 'engineering' }],
        };

        const mockUserId = 'user-123';

        it('should create a volume successfully', async () => {
            // Mock repository methods
            volumeRepository.findByName = jest.fn().mockResolvedValue(null);
            volumeRepository.create = jest.fn().mockResolvedValue({
                id: 'volume-123',
                name: 'test-volume',
                sizeGb: 100,
                performanceClass: 'gold',
                protectionPolicy: 'daily',
                environment: 'dev',
                tags: JSON.stringify([{ key: 'team', value: 'engineering' }]),
                status: 'creating',
                placement: 'array-01-shelf-02',
                fusionVolumeId: 'fusion-123',
                createdBy: mockUserId,
                createdAt: new Date(),
                updatedAt: new Date(),
            });

            // Mock axios
            const axios = require('axios');
            axios.post = jest.fn().mockResolvedValue({
                data: {
                    id: 'fusion-123',
                    status: 'creating',
                    placement: 'array-01-shelf-02',
                },
            });

            const result = await volumeService.createVolume(mockCreateDto, mockUserId);

            expect(result).toBeDefined();
            expect(result.name).toBe('test-volume');
            expect(result.status).toBe('creating');
            expect(volumeRepository.findByName).toHaveBeenCalledWith('test-volume');
            expect(volumeRepository.create).toHaveBeenCalled();
        });

        it('should throw error if volume name already exists', async () => {
            volumeRepository.findByName = jest.fn().mockResolvedValue({
                id: 'existing-volume',
                name: 'test-volume',
            });

            await expect(volumeService.createVolume(mockCreateDto, mockUserId)).rejects.toThrow(
                AppError
            );
            await expect(volumeService.createVolume(mockCreateDto, mockUserId)).rejects.toThrow(
                'already exists'
            );
        });

        it('should handle Fusion API errors', async () => {
            volumeRepository.findByName = jest.fn().mockResolvedValue(null);

            const axios = require('axios');
            axios.post = jest.fn().mockRejectedValue({
                response: {
                    status: 500,
                    data: { message: 'Internal error' },
                },
            });

            await expect(volumeService.createVolume(mockCreateDto, mockUserId)).rejects.toThrow(
                AppError
            );
        });
    });

    describe('getVolumeById', () => {
        it('should return volume if found', async () => {
            const mockVolume = {
                id: 'volume-123',
                name: 'test-volume',
                sizeGb: 100,
                performanceClass: 'gold',
                protectionPolicy: 'daily',
                environment: 'dev',
                tags: '[]',
                status: 'ready',
                placement: 'array-01-shelf-02',
                fusionVolumeId: 'fusion-123',
                createdBy: 'user-123',
                createdAt: new Date(),
                updatedAt: new Date(),
            };

            volumeRepository.findById = jest.fn().mockResolvedValue(mockVolume);

            const result = await volumeService.getVolumeById('volume-123');

            expect(result).toBeDefined();
            expect(result.id).toBe('volume-123');
            expect(volumeRepository.findById).toHaveBeenCalledWith('volume-123');
        });

        it('should throw error if volume not found', async () => {
            volumeRepository.findById = jest.fn().mockResolvedValue(null);

            await expect(volumeService.getVolumeById('non-existent')).rejects.toThrow(AppError);
            await expect(volumeService.getVolumeById('non-existent')).rejects.toThrow('not found');
        });
    });

    describe('deleteVolume', () => {
        it('should delete volume successfully', async () => {
            const mockVolume = {
                id: 'volume-123',
                name: 'test-volume',
                fusionVolumeId: 'fusion-123',
            };

            volumeRepository.findById = jest.fn().mockResolvedValue(mockVolume);
            volumeRepository.delete = jest.fn().mockResolvedValue(undefined);

            const axios = require('axios');
            axios.delete = jest.fn().mockResolvedValue({ data: {} });

            await volumeService.deleteVolume('volume-123');

            expect(volumeRepository.findById).toHaveBeenCalledWith('volume-123');
            expect(volumeRepository.delete).toHaveBeenCalledWith('volume-123');
        });

        it('should throw error if volume not found', async () => {
            volumeRepository.findById = jest.fn().mockResolvedValue(null);

            await expect(volumeService.deleteVolume('non-existent')).rejects.toThrow(AppError);
        });
    });
});

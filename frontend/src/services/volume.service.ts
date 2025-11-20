import { apiService } from './api.service';
import { Volume, CreateVolumeRequest, VolumeListResponse } from '../types';

/**
 * Volume Service
 * Handles volume API calls
 */
class VolumeService {
    /**
     * Get all volumes
     */
    async getVolumes(params?: {
        page?: number;
        pageSize?: number;
        status?: string;
        environment?: string;
    }): Promise<VolumeListResponse> {
        return apiService.get<VolumeListResponse>('/api/volumes', { params });
    }

    /**
     * Get volume by ID
     */
    async getVolumeById(id: string): Promise<Volume> {
        return apiService.get<Volume>(`/api/volumes/${id}`);
    }

    /**
     * Create volume
     */
    async createVolume(data: CreateVolumeRequest): Promise<Volume> {
        return apiService.post<Volume>('/api/volumes', data);
    }

    /**
     * Update volume
     */
    async updateVolume(id: string, data: Partial<CreateVolumeRequest>): Promise<Volume> {
        return apiService.patch<Volume>(`/api/volumes/${id}`, data);
    }

    /**
     * Delete volume
     */
    async deleteVolume(id: string): Promise<{ message: string }> {
        return apiService.delete<{ message: string }>(`/api/volumes/${id}`);
    }
}

export const volumeService = new VolumeService();

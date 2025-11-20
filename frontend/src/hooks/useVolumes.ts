import { useEffect, useCallback } from 'react';
import { useVolumeStore } from '../store/volumeStore';
import { useToastStore } from '../store/toastStore';
import { volumeService } from '../services/volume.service';
import { CreateVolumeRequest } from '../types';

/**
 * useVolumes Hook
 * Provides volume management functionality
 */
export const useVolumes = () => {
    const {
        volumes,
        loading,
        error,
        setVolumes,
        addVolume,
        updateVolume,
        removeVolume,
        setLoading,
        setError,
        clearError,
    } = useVolumeStore();

    const { addToast } = useToastStore();

    /**
     * Fetch all volumes
     */
    const fetchVolumes = useCallback(async () => {
        try {
            setLoading(true);
            clearError();
            const response = await volumeService.getVolumes();
            setVolumes(response.volumes);
        } catch (error) {
            setError('Failed to fetch volumes');
        } finally {
            setLoading(false);
        }
    }, [setLoading, clearError, setVolumes, setError]);

    /**
     * Create new volume
     */
    const createVolume = async (data: CreateVolumeRequest): Promise<boolean> => {
        try {
            setLoading(true);
            const volume = await volumeService.createVolume(data);
            addVolume(volume);
            addToast('success', `Volume "${data.name}" created successfully!`);

            // Start polling for status updates
            pollVolumeStatus(volume.id);

            return true;
        } catch (error) {
            return false;
        } finally {
            setLoading(false);
        }
    };

    /**
     * Delete volume
     */
    const deleteVolume = async (id: string, name: string): Promise<boolean> => {
        try {
            setLoading(true);
            await volumeService.deleteVolume(id);
            removeVolume(id);
            addToast('success', `Volume "${name}" deleted successfully!`);
            return true;
        } catch (error) {
            return false;
        } finally {
            setLoading(false);
        }
    };

    /**
     * Poll volume status for updates
     */
    const pollVolumeStatus = useCallback(
        async (volumeId: string) => {
            const maxAttempts = 30; // Poll for up to 60 seconds
            let attempts = 0;

            const poll = async () => {
                try {
                    const volume = await volumeService.getVolumeById(volumeId);
                    updateVolume(volumeId, volume);

                    // Stop polling if volume is ready or failed
                    if (volume.status === 'ready' || volume.status === 'failed') {
                        if (volume.status === 'ready') {
                            addToast('success', `Volume "${volume.name}" is now ready!`);
                        } else {
                            addToast('error', `Volume "${volume.name}" creation failed!`);
                        }
                        return;
                    }

                    // Continue polling if still creating
                    if (volume.status === 'creating' && attempts < maxAttempts) {
                        attempts++;
                        setTimeout(poll, 2000); // Poll every 2 seconds
                    }
                } catch (error) {
                    // Stop polling on error
                    console.error('Error polling volume status:', error);
                }
            };

            poll();
        },
        [updateVolume, addToast]
    );

    /**
     * Refresh volumes periodically
     */
    useEffect(() => {
        fetchVolumes();

        // Refresh every 30 seconds
        const interval = setInterval(fetchVolumes, 30000);

        return () => clearInterval(interval);
    }, [fetchVolumes]);

    return {
        volumes,
        loading,
        error,
        fetchVolumes,
        createVolume,
        deleteVolume,
    };
};

import { create } from 'zustand';
import { Volume } from '../types';

interface VolumeState {
    volumes: Volume[];
    loading: boolean;
    error: string | null;
    setVolumes: (volumes: Volume[]) => void;
    addVolume: (volume: Volume) => void;
    updateVolume: (id: string, updates: Partial<Volume>) => void;
    removeVolume: (id: string) => void;
    setLoading: (loading: boolean) => void;
    setError: (error: string | null) => void;
    clearError: () => void;
}

export const useVolumeStore = create<VolumeState>((set) => ({
    volumes: [],
    loading: false,
    error: null,
    setVolumes: (volumes) => set({ volumes }),
    addVolume: (volume) =>
        set((state) => ({
            volumes: [volume, ...state.volumes],
        })),
    updateVolume: (id, updates) =>
        set((state) => ({
            volumes: state.volumes.map((v) => (v.id === id ? { ...v, ...updates } : v)),
        })),
    removeVolume: (id) =>
        set((state) => ({
            volumes: state.volumes.filter((v) => v.id !== id),
        })),
    setLoading: (loading) => set({ loading }),
    setError: (error) => set({ error }),
    clearError: () => set({ error: null }),
}));

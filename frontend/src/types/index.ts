// User types
export interface User {
    id: string;
    email: string;
}

export interface AuthResponse {
    token: string;
    user: User;
}

export interface LoginRequest {
    email: string;
    password: string;
}

// Volume types
export interface Tag {
    key: string;
    value: string;
}

export interface Volume {
    id: string;
    name: string;
    size_gb: number;
    performance_class: 'gold' | 'silver' | 'bronze';
    protection_policy: 'daily' | 'hourly' | 'none';
    environment: 'dev' | 'test' | 'prod';
    tags: Tag[];
    status: 'creating' | 'ready' | 'failed' | 'deleting';
    placement?: string;
    fusion_volume_id?: string;
    created_by: string;
    created_at: string;
    updated_at: string;
}

export interface CreateVolumeRequest {
    name: string;
    size_gb: number;
    performance_class: 'gold' | 'silver' | 'bronze';
    protection_policy: 'daily' | 'hourly' | 'none';
    environment: 'dev' | 'test' | 'prod';
    tags?: Tag[];
}

export interface VolumeListResponse {
    volumes: Volume[];
    total: number;
    page?: number;
    pageSize?: number;
}

// Toast types
export type ToastType = 'success' | 'error' | 'warning' | 'info';

export interface Toast {
    id: string;
    type: ToastType;
    message: string;
    duration?: number;
}

// API Error types
export interface ApiError {
    error: string;
    message: string;
    details?: any;
}

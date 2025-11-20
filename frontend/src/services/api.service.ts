import axios, { AxiosInstance, AxiosError, InternalAxiosRequestConfig } from 'axios';
import { useAuthStore } from '../store/authStore';
import { useToastStore } from '../store/toastStore';
import { ApiError } from '../types';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

/**
 * API Service
 * Centralized HTTP client with interceptors
 */
class ApiService {
    private client: AxiosInstance;

    constructor() {
        this.client = axios.create({
            baseURL: API_URL,
            headers: {
                'Content-Type': 'application/json',
            },
            timeout: 30000,
        });

        this.setupInterceptors();
    }

    private setupInterceptors(): void {
        // Request interceptor - add auth token
        this.client.interceptors.request.use(
            (config: InternalAxiosRequestConfig) => {
                const token = useAuthStore.getState().token;
                if (token && config.headers) {
                    config.headers.Authorization = `Bearer ${token}`;
                }
                return config;
            },
            (error) => {
                return Promise.reject(error);
            }
        );

        // Response interceptor - handle errors
        this.client.interceptors.response.use(
            (response) => response,
            (error: AxiosError<ApiError>) => {
                const { addToast } = useToastStore.getState();

                if (error.response) {
                    const status = error.response.status;
                    const message = error.response.data?.message || 'An error occurred';

                    // Handle specific status codes
                    if (status === 401) {
                        // Unauthorized - clear auth and redirect to login
                        useAuthStore.getState().clearAuth();
                        addToast('error', 'Session expired. Please login again.');
                        window.location.href = '/login';
                    } else if (status === 403) {
                        addToast('error', 'You do not have permission to perform this action.');
                    } else if (status === 404) {
                        addToast('error', 'Resource not found.');
                    } else if (status === 409) {
                        addToast('error', message);
                    } else if (status >= 500) {
                        addToast('error', 'Server error. Please try again later.');
                    } else {
                        addToast('error', message);
                    }
                } else if (error.request) {
                    // Network error
                    addToast('error', 'Network error. Please check your connection.');
                } else {
                    addToast('error', 'An unexpected error occurred.');
                }

                return Promise.reject(error);
            }
        );
    }

    /**
     * GET request
     */
    async get<T>(url: string, config?: any): Promise<T> {
        const response = await this.client.get<T>(url, config);
        return response.data;
    }

    /**
     * POST request
     */
    async post<T>(url: string, data?: any, config?: any): Promise<T> {
        const response = await this.client.post<T>(url, data, config);
        return response.data;
    }

    /**
     * PUT request
     */
    async put<T>(url: string, data?: any, config?: any): Promise<T> {
        const response = await this.client.put<T>(url, data, config);
        return response.data;
    }

    /**
     * PATCH request
     */
    async patch<T>(url: string, data?: any, config?: any): Promise<T> {
        const response = await this.client.patch<T>(url, data, config);
        return response.data;
    }

    /**
     * DELETE request
     */
    async delete<T>(url: string, config?: any): Promise<T> {
        const response = await this.client.delete<T>(url, config);
        return response.data;
    }
}

export const apiService = new ApiService();

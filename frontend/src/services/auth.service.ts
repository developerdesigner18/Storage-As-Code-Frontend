import { apiService } from './api.service';
import { AuthResponse, LoginRequest, User } from '../types';

/**
 * Auth Service
 * Handles authentication API calls
 */
class AuthService {
    /**
     * Login user
     */
    async login(credentials: LoginRequest): Promise<AuthResponse> {
        return apiService.post<AuthResponse>('/api/auth/login', credentials);
    }

    /**
     * Register user
     */
    async register(credentials: LoginRequest): Promise<AuthResponse> {
        return apiService.post<AuthResponse>('/api/auth/register', credentials);
    }

    /**
     * Get current user
     */
    async getCurrentUser(): Promise<User> {
        return apiService.get<User>('/api/auth/me');
    }

    /**
     * Logout (client-side only)
     */
    logout(): void {
        // Clear local storage and redirect
        localStorage.clear();
        window.location.href = '/login';
    }
}

export const authService = new AuthService();

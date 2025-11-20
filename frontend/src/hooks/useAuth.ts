import { useAuthStore } from '../store/authStore';
import { authService } from '../services/auth.service';
import { useToastStore } from '../store/toastStore';
import { LoginRequest } from '../types';

/**
 * useAuth Hook
 * Provides authentication functionality
 */
export const useAuth = () => {
    const { user, token, isAuthenticated, setAuth, clearAuth } = useAuthStore();
    const { addToast } = useToastStore();

    const login = async (credentials: LoginRequest): Promise<boolean> => {
        try {
            const response = await authService.login(credentials);
            setAuth(response.user, response.token);
            addToast('success', `Welcome back, ${response.user.email}!`);
            return true;
        } catch (error) {
            // Error already handled by API service interceptor
            return false;
        }
    };

    const register = async (credentials: LoginRequest): Promise<boolean> => {
        try {
            const response = await authService.register(credentials);
            setAuth(response.user, response.token);
            addToast('success', 'Account created successfully!');
            return true;
        } catch (error) {
            return false;
        }
    };

    const logout = () => {
        clearAuth();
        authService.logout();
        addToast('info', 'Logged out successfully');
    };

    return {
        user,
        token,
        isAuthenticated,
        login,
        register,
        logout,
    };
};

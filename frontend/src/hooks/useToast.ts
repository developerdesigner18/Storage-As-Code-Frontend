import { useToastStore } from '../store/toastStore';
import { ToastType } from '../types';

/**
 * useToast Hook
 * Provides toast notification functionality
 */
export const useToast = () => {
    const { toasts, addToast, removeToast, clearToasts } = useToastStore();

    const showToast = (type: ToastType, message: string, duration?: number) => {
        addToast(type, message, duration);
    };

    const success = (message: string, duration?: number) => {
        addToast('success', message, duration);
    };

    const error = (message: string, duration?: number) => {
        addToast('error', message, duration);
    };

    const warning = (message: string, duration?: number) => {
        addToast('warning', message, duration);
    };

    const info = (message: string, duration?: number) => {
        addToast('info', message, duration);
    };

    return {
        toasts,
        showToast,
        success,
        error,
        warning,
        info,
        removeToast,
        clearToasts,
    };
};

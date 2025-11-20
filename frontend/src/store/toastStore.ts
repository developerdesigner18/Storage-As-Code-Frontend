import { create } from 'zustand';
import { Toast, ToastType } from '../types';

interface ToastState {
    toasts: Toast[];
    addToast: (type: ToastType, message: string, duration?: number) => void;
    removeToast: (id: string) => void;
    clearToasts: () => void;
}

let toastIdCounter = 0;

export const useToastStore = create<ToastState>((set) => ({
    toasts: [],
    addToast: (type, message, duration = 5000) => {
        const id = `toast-${++toastIdCounter}`;
        const toast: Toast = { id, type, message, duration };

        set((state) => ({
            toasts: [...state.toasts, toast],
        }));

        // Auto-remove toast after duration
        if (duration > 0) {
            setTimeout(() => {
                set((state) => ({
                    toasts: state.toasts.filter((t) => t.id !== id),
                }));
            }, duration);
        }
    },
    removeToast: (id) =>
        set((state) => ({
            toasts: state.toasts.filter((t) => t.id !== id),
        })),
    clearToasts: () => set({ toasts: [] }),
}));

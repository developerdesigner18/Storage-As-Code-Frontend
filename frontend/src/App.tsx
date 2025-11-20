import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { LoginPage } from './pages/LoginPage';
import { DashboardPage } from './pages/DashboardPage';
import { CreateVolumePage } from './pages/CreateVolumePage';
import { Toast } from './components/common/Toast';
import { useAuthStore } from './store/authStore';

/**
 * ProtectedRoute Component
 * Redirects to login if not authenticated
 */
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
    return isAuthenticated ? <>{children}</> : <Navigate to="/login" replace />;
};

/**
 * App Component
 * Main application with routing
 */
function App() {
    return (
        <BrowserRouter>
            <Toast />
            <Routes>
                <Route path="/login" element={<LoginPage />} />
                <Route
                    path="/dashboard"
                    element={
                        <ProtectedRoute>
                            <DashboardPage />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/create-volume"
                    element={
                        <ProtectedRoute>
                            <CreateVolumePage />
                        </ProtectedRoute>
                    }
                />
                <Route path="/" element={<Navigate to="/dashboard" replace />} />
                <Route path="*" element={<Navigate to="/dashboard" replace />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;

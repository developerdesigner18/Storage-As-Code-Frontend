import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import './Header.tsx';
import './Header.css';

/**
 * Header Component
 * Application header with navigation and user menu
 */
export const Header: React.FC = () => {
    const navigate = useNavigate();
    const { user, logout } = useAuth();

    return (
        <header className="header">
            <div className="header-content">
                <div className="header-left">
                    <h1 className="header-logo" onClick={() => navigate('/dashboard')}>
                        ⚡ Pure Fusion
                    </h1>
                    <span className="header-subtitle">Storage-as-Code Portal</span>
                </div>

                <div className="header-right">
                    <div className="user-info">
                        <span className="user-email">{user?.email}</span>
                        <button className="logout-btn" onClick={logout}>
                            Logout
                        </button>
                    </div>
                </div>
            </div>
        </header>
    );
};

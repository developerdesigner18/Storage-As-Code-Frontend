import React from 'react';
import { Header } from './Header';
import './Layout.css';

interface LayoutProps {
    children: React.ReactNode;
}

/**
 * Layout Component
 * Main application layout with header
 */
export const Layout: React.FC<LayoutProps> = ({ children }) => {
    return (
        <div className="layout">
            <Header />
            <main className="main-content">{children}</main>
        </div>
    );
};

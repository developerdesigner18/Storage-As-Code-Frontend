import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Layout } from '../components/layout/Layout';
import { Button } from '../components/common/Button';
import { VolumeTable } from '../components/volumes/VolumeTable';
import './DashboardPage.css';

/**
 * DashboardPage Component
 * Main dashboard with volume list
 */
export const DashboardPage: React.FC = () => {
    const navigate = useNavigate();

    return (
        <Layout>
            <div className="dashboard-page">
                <div className="dashboard-header">
                    <div>
                        <h1 className="dashboard-title">Volumes</h1>
                        <p className="dashboard-subtitle">Manage your storage volumes</p>
                    </div>
                    <Button variant="primary" onClick={() => navigate('/create-volume')}>
                        + Create Volume
                    </Button>
                </div>

                <div className="dashboard-content">
                    <VolumeTable />
                </div>
            </div>
        </Layout>
    );
};

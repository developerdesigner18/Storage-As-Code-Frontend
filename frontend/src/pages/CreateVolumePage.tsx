import React from 'react';
import { Layout } from '../components/layout/Layout';
import { VolumeForm } from '../components/volumes/VolumeForm';
import './CreateVolumePage.css';

/**
 * CreateVolumePage Component
 * Page for creating new volumes
 */
export const CreateVolumePage: React.FC = () => {
    return (
        <Layout>
            <div className="create-volume-page">
                <div className="page-header">
                    <h1 className="page-title">Create New Volume</h1>
                    <p className="page-subtitle">Configure and provision a new storage volume</p>
                </div>

                <div className="page-content">
                    <VolumeForm />
                </div>
            </div>
        </Layout>
    );
};

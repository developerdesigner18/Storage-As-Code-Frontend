import React from 'react';
import { VolumeTable } from './VolumeTable';

/**
 * VolumeList Component
 * Container for volume table
 */
export const VolumeList: React.FC = () => {
    return (
        <div className="volume-list">
            <VolumeTable />
        </div>
    );
};

import React, { useState } from 'react';
import { Table } from '../common/Table';
import { Button } from '../common/Button';
import { ConfirmDialog } from '../common/ConfirmDialog';
import { useVolumes } from '../../hooks/useVolumes';
import { Volume } from '../../types';
import './VolumeTable.css';

/**
 * VolumeTable Component
 * Displays volumes in a table with delete functionality
 */
export const VolumeTable: React.FC = () => {
    const { volumes, loading, deleteVolume } = useVolumes();
    const [deleteDialog, setDeleteDialog] = useState<{
        isOpen: boolean;
        volume: Volume | null;
    }>({ isOpen: false, volume: null });

    const handleDeleteClick = (volume: Volume) => {
        setDeleteDialog({ isOpen: true, volume });
    };

    const handleDeleteConfirm = async () => {
        if (deleteDialog.volume) {
            await deleteVolume(deleteDialog.volume.id, deleteDialog.volume.name);
            setDeleteDialog({ isOpen: false, volume: null });
        }
    };

    const getStatusBadge = (status: string) => {
        const statusClasses: Record<string, string> = {
            creating: 'status-creating',
            ready: 'status-ready',
            failed: 'status-failed',
            deleting: 'status-deleting',
        };

        return <span className={`status-badge ${statusClasses[status]}`}>{status}</span>;
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleString();
    };

    const columns = [
        {
            key: 'name',
            header: 'Name',
        },
        {
            key: 'size_gb',
            header: 'Size',
            render: (volume: Volume) => `${volume.size_gb} GB`,
        },
        {
            key: 'performance_class',
            header: 'Performance',
            render: (volume: Volume) => (
                <span className={`perf-badge perf-${volume.performance_class}`}>
                    {volume.performance_class}
                </span>
            ),
        },
        {
            key: 'protection_policy',
            header: 'Protection',
            render: (volume: Volume) => volume.protection_policy,
        },
        {
            key: 'environment',
            header: 'Environment',
            render: (volume: Volume) => (
                <span className={`env-badge env-${volume.environment}`}>{volume.environment}</span>
            ),
        },
        {
            key: 'status',
            header: 'Status',
            render: (volume: Volume) => getStatusBadge(volume.status),
        },
        {
            key: 'tags',
            header: 'Tags',
            render: (volume: Volume) => (
                <div className="tags-cell">
                    {volume.tags.slice(0, 2).map((tag, i) => (
                        <span key={i} className="tag-mini">
                            {tag.key}
                        </span>
                    ))}
                    {volume.tags.length > 2 && <span className="tag-more">+{volume.tags.length - 2}</span>}
                </div>
            ),
        },
        {
            key: 'created_at',
            header: 'Created',
            render: (volume: Volume) => formatDate(volume.created_at),
        },
        {
            key: 'actions',
            header: 'Actions',
            render: (volume: Volume) => (
                <Button
                    variant="danger"
                    size="small"
                    onClick={() => handleDeleteClick(volume)}
                    disabled={volume.status === 'deleting'}
                >
                    Delete
                </Button>
            ),
        },
    ];

    return (
        <>
            <Table data={volumes} columns={columns} loading={loading} emptyMessage="No volumes found" />

            <ConfirmDialog
                isOpen={deleteDialog.isOpen}
                title="Delete Volume"
                message={`Are you sure you want to delete volume "${deleteDialog.volume?.name}"? This action cannot be undone.`}
                confirmText="Delete"
                cancelText="Cancel"
                variant="danger"
                onConfirm={handleDeleteConfirm}
                onCancel={() => setDeleteDialog({ isOpen: false, volume: null })}
            />
        </>
    );
};

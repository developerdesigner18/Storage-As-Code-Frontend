import React from 'react';
import { Button } from './Button';
import './ConfirmDialog.css';

interface ConfirmDialogProps {
    isOpen: boolean;
    title: string;
    message: string;
    confirmText?: string;
    cancelText?: string;
    onConfirm: () => void;
    onCancel: () => void;
    variant?: 'danger' | 'primary';
}

/**
 * ConfirmDialog Component
 * Modal dialog for confirmation actions
 */
export const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
    isOpen,
    title,
    message,
    confirmText = 'Confirm',
    cancelText = 'Cancel',
    onConfirm,
    onCancel,
    variant = 'primary',
}) => {
    if (!isOpen) return null;

    return (
        <div className="dialog-overlay" onClick={onCancel}>
            <div className="dialog-content" onClick={(e) => e.stopPropagation()}>
                <div className="dialog-header">
                    <h3 className="dialog-title">{title}</h3>
                    <button className="dialog-close" onClick={onCancel}>
                        ×
                    </button>
                </div>
                <div className="dialog-body">
                    <p className="dialog-message">{message}</p>
                </div>
                <div className="dialog-footer">
                    <Button variant="secondary" onClick={onCancel}>
                        {cancelText}
                    </Button>
                    <Button variant={variant} onClick={onConfirm}>
                        {confirmText}
                    </Button>
                </div>
            </div>
        </div>
    );
};

import React, { InputHTMLAttributes } from 'react';
import './Input.css';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string;
    helperText?: string;
}

/**
 * Input Component
 * Reusable input field with label and error handling
 */
export const Input: React.FC<InputProps> = ({
    label,
    error,
    helperText,
    className = '',
    ...props
}) => {
    return (
        <div className="input-wrapper">
            {label && <label className="input-label">{label}</label>}
            <input className={`input ${error ? 'input-error' : ''} ${className}`} {...props} />
            {error && <span className="input-error-text">{error}</span>}
            {helperText && !error && <span className="input-helper-text">{helperText}</span>}
        </div>
    );
};

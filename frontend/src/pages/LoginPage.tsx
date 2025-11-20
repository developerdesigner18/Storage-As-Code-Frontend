import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Input } from '../components/common/Input';
import { Button } from '../components/common/Button';
import { useAuth } from '../hooks/useAuth';
import './LoginPage.css';

/**
 * LoginPage Component
 * User authentication page
 */
export const LoginPage: React.FC = () => {
    const navigate = useNavigate();
    const { login } = useAuth();
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});

    const validate = (): boolean => {
        const newErrors: Record<string, string> = {};

        if (!formData.email) {
            newErrors.email = 'Email is required';
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = 'Email is invalid';
        }

        if (!formData.password) {
            newErrors.password = 'Password is required';
        } else if (formData.password.length < 6) {
            newErrors.password = 'Password must be at least 6 characters';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validate()) return;

        setLoading(true);
        const success = await login(formData);
        setLoading(false);

        if (success) {
            navigate('/dashboard');
        }
    };

    return (
        <div className="login-page">
            <div className="login-container">
                <div className="login-header">
                    <h1 className="login-logo">⚡ Pure Fusion</h1>
                    <p className="login-subtitle">Storage-as-Code Self-Service Portal</p>
                </div>

                <form className="login-form" onSubmit={handleSubmit}>
                    <Input
                        label="Email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        error={errors.email}
                        placeholder="admin@purefusion.com"
                        autoComplete="email"
                    />

                    <Input
                        label="Password"
                        type="password"
                        value={formData.password}
                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        error={errors.password}
                        placeholder="••••••••"
                        autoComplete="current-password"
                    />

                    <Button type="submit" variant="primary" fullWidth loading={loading}>
                        Sign In
                    </Button>
                </form>

                <div className="login-footer">
                    <p className="demo-credentials">
                        <strong>Demo Credentials:</strong>
                        <br />
                        Email: admin@purefusion.com
                        <br />
                        Password: admin123
                    </p>
                </div>
            </div>
        </div>
    );
};

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Input } from '../common/Input';
import { Select } from '../common/Select';
import { Button } from '../common/Button';
import { useVolumes } from '../../hooks/useVolumes';
import { Tag } from '../../types';
import './VolumeForm.css';

/**
 * VolumeForm Component
 * Form for creating new volumes
 */
export const VolumeForm: React.FC = () => {
    const navigate = useNavigate();
    const { createVolume, loading } = useVolumes();

    const [formData, setFormData] = useState({
        name: '',
        size_gb: 100,
        performance_class: 'gold' as 'gold' | 'silver' | 'bronze',
        protection_policy: 'daily' as 'daily' | 'hourly' | 'none',
        environment: 'dev' as 'dev' | 'test' | 'prod',
    });

    const [tags, setTags] = useState<Tag[]>([]);
    const [newTag, setNewTag] = useState({ key: '', value: '' });
    const [errors, setErrors] = useState<Record<string, string>>({});

    const validate = (): boolean => {
        const newErrors: Record<string, string> = {};

        if (!formData.name || formData.name.length < 3) {
            newErrors.name = 'Name must be at least 3 characters';
        }

        if (formData.size_gb < 10 || formData.size_gb > 5000) {
            newErrors.size_gb = 'Size must be between 10 and 5000 GB';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validate()) return;

        const success = await createVolume({
            ...formData,
            tags,
        });

        if (success) {
            navigate('/dashboard');
        }
    };

    const addTag = () => {
        if (newTag.key && newTag.value) {
            setTags([...tags, newTag]);
            setNewTag({ key: '', value: '' });
        }
    };

    const removeTag = (index: number) => {
        setTags(tags.filter((_, i) => i !== index));
    };

    return (
        <form className="volume-form" onSubmit={handleSubmit}>
            <div className="form-section">
                <h3 className="section-title">Basic Information</h3>

                <Input
                    label="Volume Name *"
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    error={errors.name}
                    placeholder="e.g., prod-db-volume-01"
                    required
                />

                <Input
                    label="Size (GB) *"
                    type="number"
                    value={formData.size_gb}
                    onChange={(e) => setFormData({ ...formData, size_gb: parseInt(e.target.value) })}
                    error={errors.size_gb}
                    min={10}
                    max={5000}
                    required
                />
            </div>

            <div className="form-section">
                <h3 className="section-title">Configuration</h3>

                <Select
                    label="Performance Class *"
                    value={formData.performance_class}
                    onChange={(e) =>
                        setFormData({
                            ...formData,
                            performance_class: e.target.value as 'gold' | 'silver' | 'bronze',
                        })
                    }
                    options={[
                        { value: 'gold', label: 'Gold - High Performance' },
                        { value: 'silver', label: 'Silver - Medium Performance' },
                        { value: 'bronze', label: 'Bronze - Standard Performance' },
                    ]}
                    required
                />

                <Select
                    label="Protection Policy *"
                    value={formData.protection_policy}
                    onChange={(e) =>
                        setFormData({
                            ...formData,
                            protection_policy: e.target.value as 'daily' | 'hourly' | 'none',
                        })
                    }
                    options={[
                        { value: 'daily', label: 'Daily Backup' },
                        { value: 'hourly', label: 'Hourly Backup' },
                        { value: 'none', label: 'No Backup' },
                    ]}
                    required
                />

                <Select
                    label="Environment *"
                    value={formData.environment}
                    onChange={(e) =>
                        setFormData({
                            ...formData,
                            environment: e.target.value as 'dev' | 'test' | 'prod',
                        })
                    }
                    options={[
                        { value: 'dev', label: 'Development' },
                        { value: 'test', label: 'Testing' },
                        { value: 'prod', label: 'Production' },
                    ]}
                    required
                />
            </div>

            <div className="form-section">
                <h3 className="section-title">Tags (Optional)</h3>

                <div className="tag-input-group">
                    <Input
                        type="text"
                        placeholder="Key"
                        value={newTag.key}
                        onChange={(e) => setNewTag({ ...newTag, key: e.target.value })}
                    />
                    <Input
                        type="text"
                        placeholder="Value"
                        value={newTag.value}
                        onChange={(e) => setNewTag({ ...newTag, value: e.target.value })}
                    />
                    <Button type="button" variant="secondary" onClick={addTag}>
                        Add Tag
                    </Button>
                </div>

                {tags.length > 0 && (
                    <div className="tags-list">
                        {tags.map((tag, index) => (
                            <div key={index} className="tag-item">
                                <span className="tag-key">{tag.key}:</span>
                                <span className="tag-value">{tag.value}</span>
                                <button
                                    type="button"
                                    className="tag-remove"
                                    onClick={() => removeTag(index)}
                                >
                                    ×
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <div className="form-actions">
                <Button type="button" variant="secondary" onClick={() => navigate('/dashboard')}>
                    Cancel
                </Button>
                <Button type="submit" variant="primary" loading={loading}>
                    Create Volume
                </Button>
            </div>
        </form>
    );
};

import { z } from 'zod';

/**
 * Tag DTO
 */
export const TagDtoSchema = z.object({
    key: z.string().min(1, 'Tag key is required'),
    value: z.string().min(1, 'Tag value is required'),
});

export type TagDto = z.infer<typeof TagDtoSchema>;

/**
 * Create Volume DTO
 */
export const CreateVolumeDtoSchema = z.object({
    name: z
        .string()
        .min(3, 'Name must be at least 3 characters')
        .max(50, 'Name must not exceed 50 characters')
        .regex(/^[a-zA-Z0-9-_]+$/, 'Name can only contain letters, numbers, hyphens, and underscores'),
    size_gb: z
        .number()
        .int('Size must be an integer')
        .min(10, 'Minimum size is 10 GB')
        .max(5000, 'Maximum size is 5000 GB'),
    performance_class: z.enum(['gold', 'silver', 'bronze'], {
        errorMap: () => ({ message: 'Performance class must be gold, silver, or bronze' }),
    }),
    protection_policy: z.enum(['daily', 'hourly', 'none'], {
        errorMap: () => ({ message: 'Protection policy must be daily, hourly, or none' }),
    }),
    environment: z.enum(['dev', 'test', 'prod'], {
        errorMap: () => ({ message: 'Environment must be dev, test, or prod' }),
    }),
    tags: z.array(TagDtoSchema).optional().default([]),
});

export type CreateVolumeDto = z.infer<typeof CreateVolumeDtoSchema>;

/**
 * Update Volume DTO
 */
export const UpdateVolumeDtoSchema = z.object({
    size_gb: z
        .number()
        .int('Size must be an integer')
        .min(10, 'Minimum size is 10 GB')
        .max(5000, 'Maximum size is 5000 GB')
        .optional(),
    performance_class: z.enum(['gold', 'silver', 'bronze']).optional(),
    protection_policy: z.enum(['daily', 'hourly', 'none']).optional(),
    tags: z.array(TagDtoSchema).optional(),
});

export type UpdateVolumeDto = z.infer<typeof UpdateVolumeDtoSchema>;

/**
 * Volume Response DTO
 */
export interface VolumeResponseDto {
    id: string;
    name: string;
    size_gb: number;
    performance_class: string;
    protection_policy: string;
    environment: string;
    tags: TagDto[];
    status: string;
    placement?: string;
    fusion_volume_id?: string;
    created_by: string;
    created_at: Date;
    updated_at: Date;
}

/**
 * Volume List Response DTO
 */
export interface VolumeListResponseDto {
    volumes: VolumeResponseDto[];
    total: number;
    page?: number;
    pageSize?: number;
}

/**
 * Volume Query DTO
 */
export const VolumeQueryDtoSchema = z.object({
    page: z.number().int().min(1).optional().default(1),
    pageSize: z.number().int().min(1).max(100).optional().default(20),
    status: z.enum(['creating', 'ready', 'failed', 'deleting']).optional(),
    environment: z.enum(['dev', 'test', 'prod']).optional(),
    performance_class: z.enum(['gold', 'silver', 'bronze']).optional(),
});

export type VolumeQueryDto = z.infer<typeof VolumeQueryDtoSchema>;

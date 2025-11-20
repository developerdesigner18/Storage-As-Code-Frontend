import { z } from 'zod';

/**
 * Login Request DTO
 */
export const LoginDtoSchema = z.object({
    email: z.string().email('Invalid email format'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
});

export type LoginDto = z.infer<typeof LoginDtoSchema>;

/**
 * Register Request DTO
 */
export const RegisterDtoSchema = z.object({
    email: z.string().email('Invalid email format'),
    password: z
        .string()
        .min(8, 'Password must be at least 8 characters')
        .regex(
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
            'Password must contain uppercase, lowercase, and number'
        ),
});

export type RegisterDto = z.infer<typeof RegisterDtoSchema>;

/**
 * Auth Response DTO
 */
export interface AuthResponseDto {
    token: string;
    user: {
        id: string;
        email: string;
    };
}

/**
 * User DTO
 */
export interface UserDto {
    id: string;
    email: string;
    createdAt: Date;
}

import { CreateVolumeDtoSchema, UpdateVolumeDtoSchema } from '../modules/volumes/volume.dto';
import { LoginDtoSchema, RegisterDtoSchema } from '../modules/auth/auth.dto';

describe('Validation Tests', () => {
    describe('CreateVolumeDto Validation', () => {
        it('should validate correct volume data', () => {
            const validData = {
                name: 'test-volume',
                size_gb: 100,
                performance_class: 'gold',
                protection_policy: 'daily',
                environment: 'dev',
                tags: [{ key: 'team', value: 'engineering' }],
            };

            const result = CreateVolumeDtoSchema.safeParse(validData);
            expect(result.success).toBe(true);
        });

        it('should reject invalid volume name', () => {
            const invalidData = {
                name: 'ab', // Too short
                size_gb: 100,
                performance_class: 'gold',
                protection_policy: 'daily',
                environment: 'dev',
            };

            const result = CreateVolumeDtoSchema.safeParse(invalidData);
            expect(result.success).toBe(false);
        });

        it('should reject size below minimum', () => {
            const invalidData = {
                name: 'test-volume',
                size_gb: 5, // Below 10
                performance_class: 'gold',
                protection_policy: 'daily',
                environment: 'dev',
            };

            const result = CreateVolumeDtoSchema.safeParse(invalidData);
            expect(result.success).toBe(false);
        });

        it('should reject size above maximum', () => {
            const invalidData = {
                name: 'test-volume',
                size_gb: 6000, // Above 5000
                performance_class: 'gold',
                protection_policy: 'daily',
                environment: 'dev',
            };

            const result = CreateVolumeDtoSchema.safeParse(invalidData);
            expect(result.success).toBe(false);
        });

        it('should reject invalid performance class', () => {
            const invalidData = {
                name: 'test-volume',
                size_gb: 100,
                performance_class: 'platinum', // Invalid
                protection_policy: 'daily',
                environment: 'dev',
            };

            const result = CreateVolumeDtoSchema.safeParse(invalidData);
            expect(result.success).toBe(false);
        });

        it('should reject invalid environment', () => {
            const invalidData = {
                name: 'test-volume',
                size_gb: 100,
                performance_class: 'gold',
                protection_policy: 'daily',
                environment: 'staging', // Invalid
            };

            const result = CreateVolumeDtoSchema.safeParse(invalidData);
            expect(result.success).toBe(false);
        });

        it('should accept volume without tags', () => {
            const validData = {
                name: 'test-volume',
                size_gb: 100,
                performance_class: 'gold',
                protection_policy: 'daily',
                environment: 'dev',
            };

            const result = CreateVolumeDtoSchema.safeParse(validData);
            expect(result.success).toBe(true);
            if (result.success) {
                expect(result.data.tags).toEqual([]);
            }
        });
    });

    describe('UpdateVolumeDto Validation', () => {
        it('should validate partial update', () => {
            const validData = {
                size_gb: 200,
            };

            const result = UpdateVolumeDtoSchema.safeParse(validData);
            expect(result.success).toBe(true);
        });

        it('should reject invalid size in update', () => {
            const invalidData = {
                size_gb: 5,
            };

            const result = UpdateVolumeDtoSchema.safeParse(invalidData);
            expect(result.success).toBe(false);
        });
    });

    describe('LoginDto Validation', () => {
        it('should validate correct login data', () => {
            const validData = {
                email: 'user@example.com',
                password: 'password123',
            };

            const result = LoginDtoSchema.safeParse(validData);
            expect(result.success).toBe(true);
        });

        it('should reject invalid email', () => {
            const invalidData = {
                email: 'invalid-email',
                password: 'password123',
            };

            const result = LoginDtoSchema.safeParse(invalidData);
            expect(result.success).toBe(false);
        });

        it('should reject short password', () => {
            const invalidData = {
                email: 'user@example.com',
                password: '12345',
            };

            const result = LoginDtoSchema.safeParse(invalidData);
            expect(result.success).toBe(false);
        });
    });

    describe('RegisterDto Validation', () => {
        it('should validate correct registration data', () => {
            const validData = {
                email: 'user@example.com',
                password: 'Password123',
            };

            const result = RegisterDtoSchema.safeParse(validData);
            expect(result.success).toBe(true);
        });

        it('should reject password without uppercase', () => {
            const invalidData = {
                email: 'user@example.com',
                password: 'password123',
            };

            const result = RegisterDtoSchema.safeParse(invalidData);
            expect(result.success).toBe(false);
        });

        it('should reject password without number', () => {
            const invalidData = {
                email: 'user@example.com',
                password: 'PasswordABC',
            };

            const result = RegisterDtoSchema.safeParse(invalidData);
            expect(result.success).toBe(false);
        });

        it('should reject short password', () => {
            const invalidData = {
                email: 'user@example.com',
                password: 'Pass1',
            };

            const result = RegisterDtoSchema.safeParse(invalidData);
            expect(result.success).toBe(false);
        });
    });
});

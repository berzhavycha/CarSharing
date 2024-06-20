import { z, ZodSchema } from 'zod';
import { AuthType } from '@/helpers';
import { Env } from '@/core';

export const userSchema = (actionType: AuthType): ZodSchema => {
    const baseSchema = z.object({
        email: z.string()
            .email({ message: 'Invalid email format' })
            .min(1, { message: 'Email is required' }),
        password: z.string()
            .min(Env.PASSWORD_MIN_LENGTH, { message: `Password must be at least ${Env.PASSWORD_MIN_LENGTH} characters long` })
            .min(1, { message: 'Password is required' }),
        firstName: z.string()
            .min(1, { message: 'First Name is required' }),
        lastName: z.string()
            .min(1, { message: 'Last Name is required' }),
    });

    if (actionType === AuthType.SIGN_UP) {
        return baseSchema.extend({
            confirmPassword: z.string()
                .min(1, { message: 'Confirm password is required' })
        }).refine((data) => data.password === data.confirmPassword, {
            message: "Passwords do not match",
            path: ["confirmPassword"],
        });
    }

    return baseSchema;
};
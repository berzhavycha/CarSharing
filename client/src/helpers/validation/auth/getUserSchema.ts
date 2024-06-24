import { z, ZodSchema } from 'zod';

import { Env } from '@/core';
import { AuthType, Roles } from '@/helpers';

export const getUserSchema = (actionType: AuthType, role: string): ZodSchema => {
  let baseSchema = z.object({
    email: z
      .string()
      .email({ message: 'Invalid email format' })
      .min(1, { message: 'Email is required' }),
    password: z
      .string()
      .min(Env.PASSWORD_MIN_LENGTH, {
        message: `Password must be at least ${Env.PASSWORD_MIN_LENGTH} characters long`,
      })
      .min(1, { message: 'Password is required' }),
  });
  if (role === Roles.ADMIN) {
    baseSchema = baseSchema.extend({
      invitationCode: z.string().min(1, { message: 'Invitation Code is required' }),
    });
  }

  if (actionType === AuthType.SIGN_UP) {
    const extendedSchema = baseSchema.extend({
      firstName: z.string().min(1, { message: 'First Name is required' }),
      lastName: z.string().min(1, { message: 'Last Name is required' }),
      confirmPassword: z.string().min(1, { message: 'Confirm password is required' }),
    });

    baseSchema = extendedSchema.refine((data) => data.password === data.confirmPassword, {
      message: 'Passwords do not match',
      path: ['confirmPassword'],
    }) as unknown as typeof baseSchema;
  }

  return baseSchema;
};

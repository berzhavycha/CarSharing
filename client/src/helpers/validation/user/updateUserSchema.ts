import { z } from 'zod';

import { Env } from '@/core';

export const updateUserSchema = z.object({
  picture: z
    .custom<FileList>()
    .transform((file) => file.length > 0 && file.item(0))
    .refine((file) => !file || (!!file && file.size <= 10 * 1024 * 1024), {
      message: 'The profile picture must be a maximum of 10MB.',
    })
    .refine((file) => !file || (!!file && file.type?.startsWith('image')), {
      message: 'Only images are allowed to be sent.',
    }),
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  email: z.string().email('Invalid email address').min(1, 'Email is required'),
  oldPassword: z.string().min(Env.PASSWORD_MIN_LENGTH, 'Old password is required'),
  newPassword: z
    .string()
    .min(Env.PASSWORD_MIN_LENGTH, 'New password must be at least 8 characters long'),
});

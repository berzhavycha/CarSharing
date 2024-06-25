import { z } from 'zod';

import { Env } from '@/core';
import { ONE_MB } from '@/helpers/constants';

export const updateUserSchema = z.object({
  picture: z
    .custom<FileList>()
    .transform((file) => file.length > 0 && file.item(0))
    .refine((file) => !file || (!!file && file.size <= 10 * ONE_MB), {
      message: 'The profile picture must be a maximum of 10MB.',
    })
    .refine((file) => !file || (!!file && file.type?.startsWith('image')), {
      message: 'Only images are allowed to be sent.',
    }),
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  email: z.string().email('Invalid email address').min(1, 'Email is required'),
  oldPassword: z
    .string()
    .optional()
    .refine((val) => !val || val.length >= Env.PASSWORD_MIN_LENGTH, {
      message: 'Old password must be at least 8 characters long',
    }),
  newPassword: z
    .string()
    .optional()
    .refine((val) => !val || val.length >= Env.PASSWORD_MIN_LENGTH, {
      message: 'New password must be at least 8 characters long',
    }),
}).refine(data => {
  if (data.newPassword && !data.oldPassword) {
    return false;
  }
  return true;
}, {
  message: 'New password cannot be set without providing the old password',
  path: ['newPassword'],
});

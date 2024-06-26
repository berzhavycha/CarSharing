import { z } from 'zod';

import { ONE_MB } from '@/helpers/constants';

export const createCarSchema = z.object({
  pictures: z
    .custom<FileList>()
    .transform((fileList) => {
      const filesArray = Array.from(fileList).slice(0, 3);
      return filesArray.length > 0 ? filesArray : null;
    })
    .refine(
      (fileList) => {
        return fileList?.every(
          (file) => file.size <= 10 * ONE_MB && file.type?.startsWith('image/'),
        );
      },
      {
        message: 'Invalid pictures format or size. Only up to 3 images allowed, each up to 10MB.',
      },
    ),
  model: z.string().min(2, 'Model must be at least 2 characters long'),
  year: z
    .string()
    .min(4, 'Year must be a valid year')
    .transform((value) => (typeof value === 'string' ? parseInt(value, 10) : value))
    .refine((value) => typeof value === 'number' && value > 0, {
      message: 'Year must be positive',
    }),
  description: z.string().min(10, 'Description must be at least 10 characters long'),
  pricePerHour: z
    .string()
    .min(1, 'Price per hour must be at least 1')
    .transform((value) => (typeof value === 'string' ? parseFloat(value) : value))
    .refine((value) => typeof value === 'number' && value > 0, {
      message: 'Price per hour must be a positive number',
    }),
  type: z.string().min(2, 'Type must be at least 2 characters long'),
  status: z.string().min(2, 'Status must be at least 2 characters long'),
  capacity: z
    .string()
    .min(1, 'Capacity must be at least 1')
    .transform((value) => (typeof value === 'string' ? parseInt(value, 10) : value))
    .refine((value) => typeof value === 'number' && value > 0, {
      message: 'Capacity must be a positive number',
    }),
  fuelType: z.string().min(2, 'Fuel type must be at least 2 characters long'),
  steering: z.string().min(2, 'Steering must be at least 2 characters long'),
  fuelCapacity: z
    .string()
    .min(1, 'Fuel Capacity must be at least 1')
    .transform((value) => (typeof value === 'string' ? parseInt(value, 10) : value))
    .refine((value) => typeof value === 'number' && value > 0, {
      message: 'Fuel Capacity must be a positive number',
    }),
});

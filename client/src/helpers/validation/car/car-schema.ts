import { z, ZodSchema } from 'zod';

import { Env } from '@/core';
import { ONE_MB } from '@/helpers/constants';

export const carSchema = (existingImagesIds?: string[]): ZodSchema => {
  const picturesSchema = z.custom<File[]>().transform((fileList) => {
    const filesArray = Array.from(fileList).slice(0, +Env.ALLOWED_CAR_IMAGES_AMOUNT);
    return filesArray.length > 0 ? filesArray : null;
  });

  return z.object({
    pictures:
      existingImagesIds && existingImagesIds.length > 0
        ? picturesSchema.optional()
        : picturesSchema.refine(
          (fileList) => {
            return fileList?.every(
              (file) => file.size <= 10 * ONE_MB && file.type?.startsWith('image/'),
            );
          },
          {
            message:
              'Invalid pictures format or size. Only up to 3 images allowed, each up to 10MB.',
          },
        ),
    model: z.string().min(2, 'Model must be at least 2 characters long'),
    year: z.coerce.number().positive('Year must be positive'),
    description: z.string().min(10, 'Description must be at least 10 characters long'),
    pricePerHour: z.coerce.number().positive('Price per hour must be a positive number'),
    type: z.string().min(2, 'Type must be at least 2 characters long'),
    status: z.string().min(2, 'Status must be at least 2 characters long'),
    capacity: z.coerce.number().positive('Capacity must be a positive number'),
    fuelType: z.string().min(2, 'Fuel type must be at least 2 characters long'),
    steering: z.string().min(2, 'Steering must be at least 2 characters long'),
    fuelCapacity: z.coerce.number().positive('Fuel Capacity must be a positive number'),
  });
};

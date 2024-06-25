import { z } from 'zod';

import { ONE_MB } from '@/helpers/constants';

export const createCarSchema = z.object({
    pictures: z
        .custom<FileList>()
        .transform((fileList) => {
            const filesArray = Array.from(fileList).slice(0, 3);
            return filesArray.length > 0 ? filesArray : null;
        })
        .refine((fileList) => {
            return fileList?.every((file) => file.size <= 10 * ONE_MB && file.type?.startsWith('image/'));
        }, {
            message: 'Invalid pictures format or size. Only up to 3 images allowed, each up to 10MB.',
        }),
    model: z.string().min(2, 'Model must be at least 2 characters long'),
    year: z.number().min(1980, 'Year must be 1980 or later'),
    description: z.string().min(10, 'Description must be at least 10 characters long'),
    pricePerHour: z.number().min(1, 'Price per hour must be at least 1'),
    type: z.string().min(2, 'Type must be at least 2 characters long'),
    status: z.string().min(2, 'Status must be at least 2 characters long'),
    capacity: z.number().min(1, 'Capacity must be at least 1'),
    fuelType: z.string().min(2, 'Fuel type must be at least 2 characters long'),
    steering: z.string().min(2, 'Steering must be at least 2 characters long'),
    fuelCapacity: z.number().min(1, 'Fuel Capacity must be at least 1'),
});

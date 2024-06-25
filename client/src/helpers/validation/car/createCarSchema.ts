import { z } from 'zod';

import { ONE_MB } from '@/helpers/constants';

export const createCarSchema = z.object({
    picture: z
        .custom<FileList>()
        .transform((file) => file.length > 0 && file.item(0))
        .refine((file) => !file || (!!file && file.size <= 10 * ONE_MB), {
            message: 'The profile picture must be a maximum of 10MB.',
        })
        .refine((file) => !file || (!!file && file.type?.startsWith('image')), {
            message: 'Only images are allowed to be sent.',
        }),
    model: z.string().min(1, 'Model is required'),
    year: z.number().min(1980, 'Year is required'),
    description: z.string().min(1, 'Description is required'),
    pricePerHour: z.number().min(1, 'Price / Hour name is required'),
    type: z.string().min(1, 'Type is required'),
    status: z.string().min(1, 'Status is required'),
    capacity: z.number().min(1, 'Capacity is required'),
    fuelType: z.string().min(1, 'Fuel type is required'),
    steering: z.string().min(1, 'Steering is required'),
    fuelCapacity: z.number().min(1, 'Fuel Capacity is required'),
})
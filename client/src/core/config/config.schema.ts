import { z } from 'zod';

import { paginationSchema } from '@/helpers/validation/pagination/pagination-schema';

const configSchema = z.object({
  API_BASE_URL: z.string().refine((value) => value.trim() !== '', {
    message: 'API_BASE_URL cannot be an empty string',
  }),
  PASSWORD_MIN_LENGTH: z
    .string()
    .transform((val) => parseInt(val, 10))
    .pipe(z.number().min(1))
    .default('8'),
  ADMIN_CARS_PAGINATION_LIMIT: paginationSchema.default('10'),
  ALLOWED_CAR_IMAGES_AMOUNT: paginationSchema.default('3'),
  ADMIN_TRANSACTIONS_PAGINATION_LIMIT: paginationSchema.default('10'),
  USER_CARS_PAGINATION_LIMIT: paginationSchema.default('9'),
});

export type Config = z.infer<typeof configSchema>;

export const parseConfig = (configObj: Record<string, unknown>): Config => {
  const parseResult = configSchema.safeParse(configObj);

  if (!parseResult.success) throw parseResult.error;

  return parseResult.data;
};

import { z } from 'zod';

const parseNumberString = (val: string): number => parseInt(val, 10);

export const paginationSchema = z
  .string()
  .transform(parseNumberString)
  .pipe(z.number().min(1))
  .transform(String);

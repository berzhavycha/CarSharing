import { EXPIRATION_DATE_REGEX } from '@/regex';
import { z } from 'zod';

export const paymentFormSchema = z.object({
  cardNumber: z
    .string()
    .min(16, 'Card Number must be at least 16 digits')
    .max(16, 'Card Number must be at most 16 digits'),
  expirationDate: z
    .string()
    .regex(EXPIRATION_DATE_REGEX, 'Invalid expiration date'),
  cardHolder: z.string().min(1, 'Card Holder name is required'),
  CVC: z.string().min(3, 'CVC must be at least 3 digits').max(4, 'CVC must be at most 4 digits'),
});

import { z } from 'zod';

import { EXPIRATION_DATE_REGEX } from '@/regex';
import { CARD_NUMBER_MIN_DIGITS_AMOUNT, CARD_NUMBER_MAX_DIGITS_AMOUNT, CVC_DIGITS_MAX_AMOUNT, CVC_DIGITS_MIN_AMOUNT } from '@/helpers/constants';

export const paymentFormSchema = z.object({
  cardNumber: z
    .string()
    .min(CARD_NUMBER_MIN_DIGITS_AMOUNT, 'Card Number must be at least 16 digits')
    .max(CARD_NUMBER_MAX_DIGITS_AMOUNT, 'Card Number must be at most 16 digits'),
  expirationDate: z.string().regex(EXPIRATION_DATE_REGEX, 'Invalid expiration date'),
  cardHolder: z.string().min(1, 'Card Holder name is required'),
  cvc: z.string().min(CVC_DIGITS_MIN_AMOUNT, 'CVC must be at least 3 digits').max(CVC_DIGITS_MAX_AMOUNT, 'CVC must be at most 4 digits'),
});

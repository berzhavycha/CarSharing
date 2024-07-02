import { z } from 'zod';

import { paymentFormSchema } from '../payment';

export const topUpSchema = z.object({
  amount: z.coerce.number().positive('Amount must be positive a number'),
});

export const updateUserBalanceSchema = z.intersection(topUpSchema, paymentFormSchema);

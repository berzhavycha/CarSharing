import { z } from "zod";

export const paymentFormSchema = z.object({
    amount: z.coerce.number().positive('Amount must be positive a number'),
    cardNumber: z.string().min(16, "Card Number must be at least 16 digits").max(16, "Card Number must be at most 16 digits"),
    expirationDate: z.string().regex(/^(0[1-9]|1[0-2])\/?([0-9]{4}|[0-9]{2})$/, "Invalid expiration date"),
    cardHolder: z.string().min(1, "Card Holder name is required"),
    CVC: z.string().min(3, "CVC must be at least 3 digits").max(4, "CVC must be at most 4 digits"),
});

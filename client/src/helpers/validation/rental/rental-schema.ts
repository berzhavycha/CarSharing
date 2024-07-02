import { z } from "zod";
import { paymentFormSchema } from "../payment";

export const rentalFormSchema = z.object({
    pickUpLocation: z.string().min(1, "Pick Up Location is required"),
    dropOffLocation: z.string().min(1, "Drop Off Location is required"),
    hours: z.coerce.number().min(1, "Requested Hours must be at least 1"),
});

export const rentalSchema = z.intersection(rentalFormSchema, paymentFormSchema);
import { PaginationDto } from "./pagination";
import { Rental } from "./rental";
import { AuthenticatedUser } from "./user";

export type Transaction = {
    id: string;
    amount: number;
    type: TransactionType;
    user: AuthenticatedUser;
    rental: Rental
    createdAt: Date;
}

export enum TransactionType {
    TOP_UP = 'top_up',
    RENTAL_PAYMENT = 'rental_payment',
    REFUND = 'refund',
    PENALTY = 'penalty',
}

export type QueryTransactionsDto = PaginationDto & {
    search?: string;
};

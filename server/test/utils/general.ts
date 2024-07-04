import { Rental } from "@/entities";
import { TransactionType } from "@/helpers";
import { mockRental } from "../mocks";

type HashResult = { hash: string, salt: string }
type UpdateUserBalanceOptions = {
    id: string;
    balanceDto: {
        amount: number;
    };
    transactionType: TransactionType;
    rental: Rental;
}

export const makeHash = (hashDetails?: Partial<HashResult>): HashResult => {
    return {
        hash: 'mock-hash',
        salt: 'mock-salt',
        ...hashDetails
    };
}

export const makeUpdateUserBalanceOptions = (details?: UpdateUserBalanceOptions): UpdateUserBalanceOptions => {
    return {
        id: 'user-id',
        balanceDto: { amount: 100 },
        transactionType: TransactionType.REFUND,
        rental: mockRental,
        ...details
    }
}
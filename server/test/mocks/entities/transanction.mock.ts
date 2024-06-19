import { Rental, Transaction, User } from '@/entities';
import { TransactionType } from '@/helpers';

export const mockTransanction = {
  id: 'transanction-id',
  amount: 400,
  description: 'Description',
  type: TransactionType.RENTAL_PAYMENT,
  createdAt: new Date(),
  user: new User(),
  rental: new Rental(),
} as Transaction;

export const TRANSACTION_AMOUNT_PRECISION = 10;
export const TRANSACTION_AMOUNT_SCALE = 2;

export enum TransactionType {
  TOP_UP = 'top_up',
  RENTAL_PAYMENT = 'rental_payment',
  REFUND = 'refund',
  PENALTY = 'penalty',
}

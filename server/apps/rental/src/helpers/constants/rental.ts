export const RENTAL_STATUS_LENGTH = 20;

export enum RentalStatus {
  PENDING = 'pending',
  ACTIVE = 'active',
  CLOSED = 'closed',
  RETURN_FAILED = 'return-failed',
  CANCELLED = 'cancelled',
}

export const RENTAL_DEFAULT_ORDER_COLUMN = 'status';
export const RENTAL_DEFAULT_SEARCH_COLUMN = ['originalCar.model'];

export const DEFAULT_PRICE = 0;

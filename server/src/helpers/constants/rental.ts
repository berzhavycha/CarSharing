export const RENTAL_STATUS_LENGTH = 20;

export enum RentalStatus {
  ACTIVE = 'active',
  CLOSED = 'closed',
  CANCELLED = 'cancelled',
}

export const RENTAL_DEFAULT_ORDER_COLUMN = 'status';
export const RENTAL_DEFAULT_SEARCH_COLUMN = ['originalCar.model'];

export const DEFAULT_PRICE = 0;

import { RentalDto, UserRentalErrors } from '@/types';

export const createRentalFieldMappings: Record<string, keyof (RentalDto & UserRentalErrors)> = {
  rental: 'rental',
  money: 'balance',
  hours: 'hours',
  'pick up location': 'pickUpLocation',
  'drop off location': 'dropOffLocation',
  car: 'car',
};

export enum RentalStatus {
  ACTIVE = 'active',
  CLOSED = 'closed',
  CANCELLED = 'cancelled',
}

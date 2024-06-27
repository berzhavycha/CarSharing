export const CAR_FIELD_DEFAULT_PRECISION = 10;
export const CAR_FIELD_DEFAULT_SCALE = 2;

export const CAR_FIELD_MEDIUM_LENGTH = 50;

export const CAR_FIELD_SMALL_LENGTH = 20;

export enum CarFuelType {
  PETROL = 'Petrol',
  DIESEL = 'Diesel',
  ELECTRIC = 'Electric',
  LPG = 'LPG',
  HYBRID = 'Hybrid',
  NATURAL_GAS = 'NaturalGas',
}

export const CarDefaultFuelCapacity = {
  [CarFuelType.PETROL]: 60,
  [CarFuelType.DIESEL]: 55,
  [CarFuelType.ELECTRIC]: 500,
  [CarFuelType.LPG]: 50,
  [CarFuelType.HYBRID]: 55,
  [CarFuelType.NATURAL_GAS]: 45,
};

export const CarDefaultCapacity = {
  SUV: 6,
  MVP: 7,
  Hatchback: 5,
  Coupe: 4,
  Sedan: 5,
  Sport: 2,
  Crossover: 5,
  Pickup: 5,
  Minivan: 7,
};

export const CAR_DEFAULT_STEERING = 'Left-hand drive';
export const CAR_DEFAULT_TYPE = 'Sedan';

export enum CarStatus {
  AVAILABLE = 'available',
  BOOKED = 'booked',
  MAINTAINED = 'maintained',
}

export const CAR_DEFAULT_ORDER_COLUMN = 'pricePerHour';
export const CAR_DEFAULT_SEARCH_COLUMN = 'model';

export const MAX_CAR_PICTURES = 3
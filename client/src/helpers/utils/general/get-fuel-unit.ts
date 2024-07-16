import { CarFuelType, FUEL_UNIT_LITERS, FUEL_UNIT_KWH, FUEL_UNIT_CUBIC_METERS } from '@/helpers/constants';

export const getFuelUnit = (fuelType: CarFuelType): string => {
  switch (fuelType) {
    case CarFuelType.PETROL:
    case CarFuelType.DIESEL:
    case CarFuelType.LPG:
    case CarFuelType.HYBRID:
      return FUEL_UNIT_LITERS;
    case CarFuelType.ELECTRIC:
      return FUEL_UNIT_KWH;
    case CarFuelType.NATURAL_GAS:
      return FUEL_UNIT_CUBIC_METERS;
    default:
      return '';
  }
};

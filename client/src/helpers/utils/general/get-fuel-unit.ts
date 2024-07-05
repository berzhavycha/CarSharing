import { CarFuelType } from '@/helpers/constants';

export const getFuelUnit = (fuelType: CarFuelType): string => {
  switch (fuelType) {
    case CarFuelType.PETROL:
    case CarFuelType.DIESEL:
    case CarFuelType.LPG:
    case CarFuelType.HYBRID:
      return 'L';
    case CarFuelType.ELECTRIC:
      return 'kWh';
    case CarFuelType.NATURAL_GAS:
      return 'm³';
    default:
      return '';
  }
};

import { Car, OriginalCar, PublicFile } from '@/entities';

export const makePublicFile = (details?: Partial<PublicFile>): PublicFile => {
  return {
    id: 'av-id',
    key: 'key',
    url: 'some-url',
    car: new Car(),
    originalCar: new OriginalCar(),
    ...details,
  };
};

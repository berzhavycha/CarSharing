import { Car, OriginalCar, LocalFile } from '@/entities';

export const makeLocalFile = (details?: Partial<LocalFile>): LocalFile => {
  return {
    id: 'av-id',
    filename: 'some-url',
    path: 'key',
    mimetype: 'some-url',
    car: new Car(),
    originalCar: new OriginalCar(),
    ...details,
  };
};

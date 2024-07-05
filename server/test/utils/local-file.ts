import { Car, LocalFile, OriginalCar } from '@/entities';

export const makeLocalFile = (details?: Partial<LocalFile>): LocalFile => {
  return {
    id: 'av-id',
    filename: 'test.jpg',
    path: 'some/path',
    mimetype: 'image/jpeg',
    car: new Car(),
    originalCar: new OriginalCar(),
    ...details,
  };
};

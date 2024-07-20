import { Car, OriginalCar, PublicFile } from '@/entities';

export const makePublicFile = (details?: Partial<PublicFile>): PublicFile => {
  return {
    id: 'av-id',
    key: 'public_key',
    url: 'some-url',
    car: new Car(),
    originalCar: new OriginalCar(),
    ...details,
  };
};

export const makeFile = (): Express.Multer.File => {
  return { buffer: Buffer.from('test') } as Express.Multer.File;
};

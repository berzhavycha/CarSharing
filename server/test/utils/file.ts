import { Car, OriginalCar, PublicFile } from '@/entities';
import { UploadedFile } from '@/types';

export const makePublicFile = (details?: Partial<PublicFile>): PublicFile => {
  return {
    id: 'av-id',
    key: 'public_key',
    publicId: null,
    url: 'some-url',
    car: new Car(),
    originalCar: new OriginalCar(),
    ...details,
  };
};

export const makeFile = (): Express.Multer.File => {
  return { buffer: Buffer.from('test') } as Express.Multer.File;
};

export const makeUploadedFile = (
  details?: Partial<UploadedFile>,
): UploadedFile => {
  return {
    key: 'public_key',
    publicId: null,
    url: 'some-url',
    ...details,
  };
};

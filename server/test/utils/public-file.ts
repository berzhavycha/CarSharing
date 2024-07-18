import { Car, OriginalCar, PublicFile } from '@/entities';
import { CloudinaryResponse } from '@/types';

export const makePublicFile = (details?: Partial<PublicFile>): PublicFile => {
  return {
    id: 'av-id',
    publicId: 'public_id',
    url: 'some-url',
    car: new Car(),
    originalCar: new OriginalCar(),
    ...details,
  };
};

export const makeFile = (): Express.Multer.File => {
  return { buffer: Buffer.from('test') } as Express.Multer.File;
};

export const makeCloudinaryFile = (
  details?: Partial<CloudinaryResponse>,
): CloudinaryResponse => {
  return {
    public_id: 'public_id',
    url: 'http://example.com',
    ...details,
  } as CloudinaryResponse;
};

import { BadRequestException } from '@nestjs/common';
import { MulterOptions } from '@nestjs/platform-express/multer/interfaces/multer-options.interface';

export const defaultFileFilter: MulterOptions['fileFilter'] = (
  _request,
  file,
  callback,
): void => {
  if (!file.mimetype.includes('image')) {
    return callback(new BadRequestException('Provide a valid image'), false);
  }
  callback(null, true);
};

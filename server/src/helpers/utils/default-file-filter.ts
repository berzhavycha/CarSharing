import { BadRequestException } from '@nestjs/common';
import { MulterOptions } from '@nestjs/platform-express/multer/interfaces/multer-options.interface';

import { filesErrors } from '../errors';

export const defaultFileFilter: MulterOptions['fileFilter'] = (
  _request,
  file,
  callback,
): void => {
  if (!file.mimetype.includes('image')) {
    return callback(new BadRequestException(filesErrors.INVALID_IMAGE), false);
  }
  callback(null, true);
};

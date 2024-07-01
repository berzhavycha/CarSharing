import { BadRequestException } from '@nestjs/common';
import { MulterOptions } from '@nestjs/platform-express/multer/interfaces/multer-options.interface';

import { localFilesErrors } from '../errors';

export const defaultFileFilter: MulterOptions['fileFilter'] = (
  request,
  file,
  callback,
): void => {
  if (!file.mimetype.includes('image')) {
    return callback(
      new BadRequestException(localFilesErrors.INVALID_IMAGE),
      false,
    );
  }
  callback(null, true);
};

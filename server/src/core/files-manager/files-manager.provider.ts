import { Provider } from '@nestjs/common';

import { NODE_ENV } from '@/helpers';
import {
  AwsFilesService,
  CloudinaryFilesService,
  FilesManagerService,
} from '@/services';

export const FilesManagerProvider: Provider = {
  provide: FilesManagerService,
  useClass:
    process.env.NODE_ENV === NODE_ENV.production
      ? AwsFilesService
      : CloudinaryFilesService,
};

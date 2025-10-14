import { Provider } from '@nestjs/common';

import { CloudinaryFilesService } from '../../services/cloudinary-files.service';
import { FilesManagerService } from '../../services/files-manager.service';

// import { LocalFileService } from '../../services/local-file.service';
// import { NODE_ENV } from '@app/shared';

export const FilesManagerProvider: Provider = {
  provide: FilesManagerService,
  useClass: CloudinaryFilesService,
  // process.env.NODE_ENV === NODE_ENV.production
  //     ? CloudinaryFilesService
  //     : LocalFileService,
};

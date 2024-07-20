import { Injectable } from '@nestjs/common';

import { UploadedFile } from '@/types';

@Injectable()
export abstract class FilesManagerService {
  abstract uploadPublicFile(file: Express.Multer.File): Promise<UploadedFile>;
  abstract removeFile(id: string): Promise<void>;
}

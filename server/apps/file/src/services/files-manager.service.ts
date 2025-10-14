import { Injectable } from '@nestjs/common';

import { UploadedFile } from '../types/file';

@Injectable()
export abstract class FilesManagerService {
  abstract uploadFile(file: Express.Multer.File): Promise<UploadedFile>;
  abstract removeFile(id: string): Promise<void>;
}

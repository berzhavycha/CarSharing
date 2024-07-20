import { UploadedFile } from '@/types';
import { Injectable } from '@nestjs/common';

@Injectable()
export abstract class FilesManagerService {
  abstract uploadPublicFile(file: Express.Multer.File): Promise<UploadedFile>;
  abstract removeFile(id: string): Promise<void>;
}


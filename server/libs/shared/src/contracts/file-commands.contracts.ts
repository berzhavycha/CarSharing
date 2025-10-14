import { ContractMetadata } from '../types/contracts';

interface UploadedFile extends Omit<Express.Multer.File, 'buffer'> {
  buffer: string;
}

export type FileCommands = {
  UPLOAD_FILES: {
    files: UploadedFile[];
    metadata: ContractMetadata;
  };
  DELETE_FILES: {
    filesToDelete: { id: string }[];
    metadata?: ContractMetadata;
  };
};

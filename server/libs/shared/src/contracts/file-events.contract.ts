import { ContractMetadata } from '../types/contracts';

export type FileEvents = {
  FILES_UPLOADED: {
    files: { id: string; url: string }[];
    error?: string;
    metadata?: ContractMetadata;
  };
};

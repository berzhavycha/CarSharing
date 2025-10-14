import { ContractMetadata } from '../types/contracts';

export type NotificationCommands = {
  SEND_EMAIL: {
    to: string;
    subject: string;
    text: string;
    metadata?: ContractMetadata;
  };
};

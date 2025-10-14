import { ContractMetadata } from '../types/contracts';

export type PaymentCommands = {
  CREATE_PAYMENT: {
    email: string;
    userId: string;
    amount: number;
    metadata?: ContractMetadata;
  };

  REFUND_PAYMENT: {
    amount: number;
    metadata?: ContractMetadata;
  };
};

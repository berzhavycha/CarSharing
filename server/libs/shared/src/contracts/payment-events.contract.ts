import { ContractMetadata } from '../types/contracts';

export type PaymentEvents = {
  PAYMENT_PROCESSED: {
    paymentId: string;
    metadata: ContractMetadata;
  };
  PAYMENT_FAILED: {
    reason?: string;
    metadata: ContractMetadata;
  };
};

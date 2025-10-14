import { ContractMetadata } from '../types/contracts';

export type UserEvents = {
  USER_BALANCE_CHECKED: {
    metadata: ContractMetadata;
    status: 'sufficient' | 'insufficient';
  };

  USER_BALANCE_DEDUCTED: {
    userId: string;
    amount: number;
    newBalance: number;
    email: string;
    metadata: ContractMetadata;
  };

  USER_BALANCE_DEDUCTION_FAILED: {
    userId: string;
    amount: number;
    reason: string;
    metadata: ContractMetadata;
  };

  USER_BALANCE_TOPPED_UP: {
    userId: string;
    amount: number;
    newBalance: number;
    email: string;
    metadata: ContractMetadata;
  };

  USER_BALANCE_TOPUP_FAILED: {
    userId: string;
    amount: number;
    reason: string;
    metadata: ContractMetadata;
  };
};

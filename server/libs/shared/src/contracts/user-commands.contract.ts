import { ContractMetadata } from '../types/contracts';

export type UserCommands = {
  CHECK_USER_BALANCE: {
    required_balance: number;
    userId: string;
    metadata: ContractMetadata;
  };

  DEDUCT_USER_BALANCE: {
    userId: string;
    amount: number;
    metadata: ContractMetadata;
  };

  TOP_UP_USER_BALANCE: {
    userId: string;
    amount: number;
    metadata: ContractMetadata;
  };
};

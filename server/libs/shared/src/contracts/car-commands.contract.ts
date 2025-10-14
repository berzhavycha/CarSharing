import { ContractMetadata } from '../types/contracts';

export type CarCommands = {
  CHECK_CAR_AVAILABILITY: {
    carId: string;
    metadata: ContractMetadata;
  };

  BOOK_CAR: {
    carId: string;
    metadata: ContractMetadata;
  };
  
  RELEASE_CAR: {
    carId: string;
    metadata: ContractMetadata;
  };
};

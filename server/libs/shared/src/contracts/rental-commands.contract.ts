import { ContractMetadata } from '../types/contracts';

export type RentalCommands = {
  CONFIRM_RENTAL: {
    rentalId: string;
    metadata?: ContractMetadata;
  };

  CANCEL_RENTAL: {
    rentalId: string;
    reason: string;
    metadata?: ContractMetadata;
  };

  RETURN_CAR: {
    rentalId: string;
    refund: number;
    penalty: number;
    userId: string;
    carId: string;
    metadata?: ContractMetadata;
  };

  CLOSE_RENTAL: {
    rentalId: string;
    metadata?: ContractMetadata;
  };
};

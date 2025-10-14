import { ContractMetadata } from '../types/contracts';

export type RentalEvents = {
  RENTAL_CREATED: {
    id: string;
    carId: string;
    userId: string;
    totalPrice: number;
    requestedHours: number;
    pickUpLocation?: string;
    dropOffLocation?: string;
    metadata: ContractMetadata;
  };

  RENTAL_CONFIRMED: {
    rentalId: string;
    metadata: ContractMetadata;
  };

  RENTAL_CANCELLED: {
    rentalId: string;
    reason?: string;
    metadata: ContractMetadata;
  };

  RENTAL_RETURN_MARK_FAILED: {
    rentalId: string;
    metadata: ContractMetadata;
  };

  RENTAL_COMPLETED: {
    rentalId: string;
    penalty: number;
    refund: number;
    carId: string;
    userId: string;
    metadata: ContractMetadata;
  };
};

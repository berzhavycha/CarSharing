import { ContractMetadata } from '../types/contracts';

export type CarEvents = {
  CAR_AVAILABILITY_CHECKED: {
    carId: string;
    available: boolean;
    reason?: string;
    metadata: ContractMetadata;
  };

  CAR_BOOKED: {
    carId: string;
    metadata: ContractMetadata;
  };

  CAR_BOOKING_REJECTED: {
    reason?: string;
    carId: string;
    metadata: ContractMetadata;
  };

  CAR_RELEASED: {
    carId: string;
    metadata: ContractMetadata;
  };

  CAR_RELEASE_FAILED: {
    reason?: string;
    carId: string;
    metadata: ContractMetadata;
  };
};

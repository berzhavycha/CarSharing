import { ChangeEvent, Dispatch, SetStateAction, useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

import { useStore } from '@/context';
import { createRental } from '@/services';
import { PaymentDto, RentalDto } from '@/types';

type HookReturn = {
  onSubmit: (rentalDto: RentalDto & PaymentDto) => Promise<void>;
  isRentSuccessful: boolean;
  setIsRentSuccessful: Dispatch<SetStateAction<boolean>>;
  isLoading: boolean;
  errorMessage: string;
  setErrorMessage: Dispatch<SetStateAction<string>>;
  onRequestedHoursChange: (event: ChangeEvent<HTMLInputElement>) => void;
};

export const useRental = (): HookReturn => {
  const [isRentSuccessful, setIsRentSuccessful] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false)

  const location = useLocation();
  const rentedCar = location.state.car;

  const {
    rentalStore: { rentalPayment },
    currentUserStore: { user, updateBalance },
  } = useStore();

  useEffect(() => {
    rentalPayment.setPotentialRentalPrice(rentedCar.pricePerHour);
  }, []);

  const onSubmit = async (rentalDto: RentalDto & PaymentDto): Promise<void> => {
    setIsLoading(true)
    const { rental: createdRental, error } = await createRental({
      carId: rentedCar.id,
      ...rentalDto,
    });

    setIsLoading(false)
    if (createdRental && user?.balance && rentalPayment.potentialRentalPrice) {
      updateBalance(user.balance - rentalPayment.potentialRentalPrice);
      setIsRentSuccessful(true);
    } else if (error) {
      rentalPayment.setPotentialRentalPrice(rentedCar.pricePerHour);
      setErrorMessage(error)
    }
  };

  const onRequestedHoursChange = (event: ChangeEvent<HTMLInputElement>): void => {
    const currentHours = +event.target.value;
    const carPricePerHour = rentedCar.pricePerHour * currentHours;
    rentalPayment.setPotentialRentalPrice(carPricePerHour);
  };

  return {
    onSubmit,
    isRentSuccessful,
    setIsRentSuccessful,
    isLoading,
    errorMessage,
    setErrorMessage,
    onRequestedHoursChange
  };
};

import { ChangeEvent, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

import { useStore } from '@/context';
import { createRental } from '@/services';
import { PaymentDto, RentalDto } from '@/types';

type HookReturn = {
  onSubmit: (rentalDto: RentalDto & PaymentDto) => Promise<void>;
  onRequestedHoursChange: (event: ChangeEvent<HTMLInputElement>) => void;
};

export const useRental = (onSuccess: () => void, onError: (error: string) => void): HookReturn => {
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
    const { rental: createdRental, error } = await createRental({
      carId: rentedCar.id,
      ...rentalDto,
    });

    if (createdRental && user?.balance && rentalPayment.potentialRentalPrice) {
      updateBalance(user.balance - rentalPayment.potentialRentalPrice);
      onSuccess();
    } else if (error) {
      onError(error);
    }
  };

  const onRequestedHoursChange = (event: ChangeEvent<HTMLInputElement>): void => {
    const currentHours = +event.target.value;
    const carPricePerHour = rentedCar.pricePerHour * currentHours;
    rentalPayment.setPotentialRentalPrice(carPricePerHour);
  };

  return { onSubmit, onRequestedHoursChange };
};

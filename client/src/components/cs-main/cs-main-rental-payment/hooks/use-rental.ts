import { ChangeEvent, Dispatch, SetStateAction, useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';

import { useStore } from '@/context';
import { MAX_REQUESTED_HOURS } from '@/helpers';
import { createRental } from '@/services';
import { RentalDto } from '@/types';

type HookReturn = {
  onSubmit: (rentalDto: RentalDto) => Promise<void>;
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
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const location = useLocation();
  const rentedCar = location.state.car;

  const {
    rentalPaymentStore: { setPotentialRentalPrice },
    currentUserStore: { user, updateBalance },
  } = useStore();

  useEffect(() => {
    setPotentialRentalPrice(rentedCar.pricePerHour);
  }, []);

  // Generated once per form mount. The rental form has no amount field to
  // watch — the car and hours are the payload, but changing hours is part of
  // the same booking intent. Key is only rotated after confirmed success so
  // retries on timeout always carry the same key.
  const idempotencyKeyRef = useRef<string>(crypto.randomUUID());

  const onSubmit = async (rentalDto: RentalDto): Promise<void> => {
    setIsLoading(true);
    const { rental: createdRental, error } = await createRental(
      { carId: rentedCar.id, ...rentalDto },
      idempotencyKeyRef.current,
    );

    setIsLoading(false);
    const price = rentedCar.pricePerHour * rentalDto.hours;

    if (createdRental && user?.balance && price) {
      updateBalance(user.balance - price);
      setIsRentSuccessful(true);
      idempotencyKeyRef.current = crypto.randomUUID();
    } else if (error) {
      setPotentialRentalPrice(rentedCar.pricePerHour);
      setErrorMessage(error);
      // Key is intentionally NOT rotated on error — a retry of the same
      // booking should carry the same key so the server deduplicates it.
    }
  };

  const onRequestedHoursChange = (event: ChangeEvent<HTMLInputElement>): void => {
    const value = Number(event.target.value);
    if (value <= MAX_REQUESTED_HOURS) {
      const currentHours = +event.target.value;
      const carPricePerHour = rentedCar.pricePerHour * currentHours;
      setPotentialRentalPrice(carPricePerHour);
    } else {
      event.target.value = MAX_REQUESTED_HOURS.toString();
    }
  };

  return {
    onSubmit,
    isRentSuccessful,
    setIsRentSuccessful,
    isLoading,
    errorMessage,
    setErrorMessage,
    onRequestedHoursChange,
  };
};
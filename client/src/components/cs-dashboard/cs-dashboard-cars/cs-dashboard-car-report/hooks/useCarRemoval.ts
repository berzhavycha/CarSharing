import { useState } from 'react';

import { DEFAULT_PAGINATION_PAGE, FAILED_REMOVE_CAR } from '@/helpers';
import { removeCar } from '@/services';
import { Car } from '@/types';
import { useSearchParamsWithDefaults } from '@/hooks';

type HookReturn = {
  carList: Car[];
  setCarList: (cars: Car[]) => void;
  carToRemove: Car | null;
  setCarToRemove: React.Dispatch<React.SetStateAction<Car | null>>;
  errorMessage: string | null;
  setErrorMessage: (text: string | null) => void;
  handleRemoveCar: () => Promise<void>;
};

export const useCarRemoval = (initialCars: Car[]): HookReturn => {
  const [carList, setCarList] = useState<Car[]>(initialCars);
  const [carToRemove, setCarToRemove] = useState<Car | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const { searchParams, setParams } = useSearchParamsWithDefaults()

  const handleRemoveCar = async (): Promise<void> => {
    if (carToRemove) {
      try {
        const { error } = await removeCar(carToRemove.id);
        if (error) {
          setErrorMessage(error);
        } else {
          const currentPage = +(searchParams.get('page') ?? DEFAULT_PAGINATION_PAGE)
          if (carList.length === 1 && currentPage > 1) {
            setParams({ page: `${currentPage - 1}` })
          }
          setCarList(carList.filter((car) => car.id !== carToRemove.id));
        }
      } catch (error) {
        setErrorMessage(FAILED_REMOVE_CAR);
      } finally {
        setCarToRemove(null);
      }
    }
  };

  return {
    carList,
    setCarList,
    carToRemove,
    setCarToRemove,
    errorMessage,
    setErrorMessage,
    handleRemoveCar,
  };
};

import { useState } from 'react';

import { DEFAULT_PAGINATION_PAGE, FAILED_REMOVE_CAR } from '@/helpers';
import { useSearchParamsWithDefaults } from '@/hooks';
import { removeCar } from '@/services';
import { Car } from '@/types';

type HookReturn = {
  carList: Car[];
  isLoading: boolean;
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
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const { searchParams, setParams } = useSearchParamsWithDefaults();

  const handleRemoveCar = async (): Promise<void> => {
    if (carToRemove) {
      setIsLoading(true)
      try {
        const { error } = await removeCar(carToRemove.id);
        if (error) {
          setErrorMessage(error);
        } else {
          const currentPage = +(searchParams.get('page') ?? DEFAULT_PAGINATION_PAGE);
          setCarList(carList.filter((car) => car.id !== carToRemove.id));
          if (carList.length === 1 && currentPage > 1) {
            setParams({ page: `${currentPage - 1}` });
          } else {
            setParams({ page: `${currentPage}` });
          }
        }
      } catch (error) {
        setErrorMessage(FAILED_REMOVE_CAR);
      } finally {
        setCarToRemove(null)
        setIsLoading(false)
      }
    }
  };

  return {
    carList,
    isLoading,
    setCarList,
    carToRemove,
    setCarToRemove,
    errorMessage,
    setErrorMessage,
    handleRemoveCar,
  };
};

import { useEffect, useState } from 'react';

import { Car, CarDto, FieldErrorsState, LocalFile } from '@/types';

import { onCarSubmit } from '../cs-dashboard-car-form';

type HookReturn = {
  isLoading: boolean;
  isSuccess: boolean;
  setIsSuccess: React.Dispatch<React.SetStateAction<boolean>>;
  errors: FieldErrorsState<CarDto> | undefined;
  onPreviewRemove: (removeId: string) => void;
  onSubmit: (carDto: CarDto) => Promise<void>;
  existingImagesIds: string[];
  currentCar?: Car;
};

export const useCarForm = (onFormSubmit: onCarSubmit, carDefaultValues?: Car): HookReturn => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isSuccess, setIsSuccess] = useState<boolean>(false);
  const [errors, setErrors] = useState<FieldErrorsState<CarDto>>();
  const [currentCar, setCurrentCar] = useState<Car | undefined>(carDefaultValues);
  const [existingImagesIds, setExistingImagesIds] = useState<string[]>(
    carDefaultValues ? carDefaultValues.pictures.map((item: LocalFile) => item.id) : [],
  );

  const onPreviewRemove = (removeId: string): void => {
    setExistingImagesIds((ids) => [...ids.filter((id) => id !== removeId)]);
  };

  useEffect(() => {
    setExistingImagesIds(currentCar ? currentCar.pictures.map((item: LocalFile) => item.id) : []);
  }, [currentCar]);

  const onSubmit = async (carDto: CarDto): Promise<void> => {
    setIsLoading(true);
    const dto = currentCar
      ? { ...carDto, id: currentCar.id, existingImagesIds }
      : carDto;
    const { car, errors } = await onFormSubmit(dto);
    setIsLoading(false);
    if (car) {
      setIsSuccess(true);
      if (carDefaultValues) {
        setExistingImagesIds(car.pictures.map((item: LocalFile) => item.id));
        setCurrentCar(car);
      }
    } else if (errors) {
      setErrors(errors);
    }
  };

  return {
    isLoading,
    currentCar,
    isSuccess,
    setIsSuccess,
    errors,
    onPreviewRemove,
    onSubmit,
    existingImagesIds,
  };
};

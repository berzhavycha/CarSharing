import { useEffect, useState } from 'react';

import { Car, CarDto, FieldErrorsState, PublicFile } from '@/types';

import { onCarSubmit } from '../cs-dashboard-car-form';

type HookReturn = {
  isLoading: boolean;
  isSuccess: boolean;
  setIsSuccess: React.Dispatch<React.SetStateAction<boolean>>;
  errors: FieldErrorsState<CarDto> | undefined;
  onPreviewRemove: (removeId: string) => void;
  onSubmit: (carDto: CarDto) => Promise<void>;
  existingImages: PublicFile[];
  currentCar?: Car;
};

export const useCarForm = (onFormSubmit: onCarSubmit, carDefaultValues?: Car): HookReturn => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isSuccess, setIsSuccess] = useState<boolean>(false);
  const [errors, setErrors] = useState<FieldErrorsState<CarDto>>();
  const [currentCar, setCurrentCar] = useState<Car | undefined>(carDefaultValues);
  const [existingImages, setExistingImages] = useState<PublicFile[]>(
    carDefaultValues ? carDefaultValues.pictures : [],
  );

  const onPreviewRemove = (removeId: string): void => {
    setExistingImages((imgs) => [...imgs.filter((img) => img.id !== removeId)]);
  };

  useEffect(() => {
    setExistingImages(currentCar ? currentCar.pictures : []);
  }, [currentCar]);

  const onSubmit = async (carDto: CarDto): Promise<void> => {
    setIsLoading(true);
    const dto = currentCar
      ? { ...carDto, id: currentCar.id, existingImagesIds: existingImages.map((img) => img.id) }
      : carDto;
    const { car, errors } = await onFormSubmit(dto);
    setIsLoading(false);
    if (car) {
      setIsSuccess(true);
      if (carDefaultValues) {
        setExistingImages(car.pictures);
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
    existingImages,
  };
};

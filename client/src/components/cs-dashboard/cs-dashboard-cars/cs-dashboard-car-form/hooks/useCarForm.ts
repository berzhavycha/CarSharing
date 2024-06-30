import { FieldErrorsState, CarDto, Car, LocalFile } from "@/types";
import { useState, useEffect } from "react";
import { onCarSubmit } from "../cs-dashboard-car-form";

type HookReturn = {
    isSuccess: boolean;
    setIsSuccess: React.Dispatch<React.SetStateAction<boolean>>;
    errors: FieldErrorsState<CarDto> | undefined;
    onPreviewRemove: (removeId: string) => void;
    onSubmit: (carDto: CarDto) => Promise<void>;
    existingImagesIds: string[],
    currentCar?: Car
}

export const useCarForm = (onFormSubmit: onCarSubmit, carDefaultValues?: Car): HookReturn => {
    const [isSuccess, setIsSuccess] = useState<boolean>(false);
    const [errors, setErrors] = useState<FieldErrorsState<CarDto>>();
    const [currentCar, setCurrentCar] = useState<Car | undefined>(carDefaultValues)
    const [existingImagesIds, setExistingImagesIds] = useState<string[]>(carDefaultValues ? carDefaultValues.pictures.map((item: LocalFile) => item.id) : [])

    const onPreviewRemove = (removeId: string): void => {
        setExistingImagesIds(ids => [...ids.filter(id => id !== removeId)])
    }

    useEffect(() => {
        setExistingImagesIds(currentCar ? currentCar.pictures.map((item: LocalFile) => item.id) : [])
    }, [currentCar])

    const onSubmit = async (carDto: CarDto): Promise<void> => {
        const dto = currentCar ? { ...carDto, id: currentCar.id, existingImagesIds } : carDto;
        const { car, errors } = await onFormSubmit(dto);
        if (car) {
            setIsSuccess(true);
            if (carDefaultValues) {
                setExistingImagesIds(car.pictures.map((item: LocalFile) => item.id))
                setCurrentCar(car)
            }
        } else if (errors) {
            setErrors(errors);
        }
    };

    return {
        currentCar,
        isSuccess,
        setIsSuccess,
        errors,
        onPreviewRemove,
        onSubmit,
        existingImagesIds
    }
}
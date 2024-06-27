import { useState } from 'react';
import { Car } from '@/types';
import { removeCar } from '@/services';
import { FAILED_REMOVE_CAR } from '@/helpers';

type HookReturn = {
    carList: Car[];
    setCarList: (cars: Car[]) => void
    carToRemove: Car | null;
    setCarToRemove: React.Dispatch<React.SetStateAction<Car | null>>;
    errorMessage: string | null;
    setErrorMessage: (text: string | null) => void,
    handleRemoveCar: () => Promise<void>;
}

export const useCarRemoval = (initialCars: Car[]): HookReturn => {
    const [carList, setCarList] = useState<Car[]>(initialCars);
    const [carToRemove, setCarToRemove] = useState<Car | null>(null);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    const handleRemoveCar = async (): Promise<void> => {
        if (carToRemove) {
            try {
                const { error } = await removeCar(carToRemove.id);
                if (error) {
                    setErrorMessage(error)
                } else {
                    setCarList(carList.filter(car => car.id !== carToRemove.id));
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
        handleRemoveCar
    };
};

import { axiosInstance } from "@/api";
import { Env } from "@/core";
import { Car, CarDto, FieldErrorsState } from "@/types";

type ServiceReturn = {
    car: Car | null;
    errors: FieldErrorsState<CarDto> | null;
};

export const addNewCar = async (car: CarDto): Promise<ServiceReturn> => {
    try {
        const formData = createFormData(car);

        const { data } = await axiosInstance.post(`${Env.API_BASE_URL}/cars`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });

        return {
            car: data,
            errors: null,
        };
    } catch (error) {
        // Handle errors here
        console.error('Error adding new car:', error);
        return {
            car: null,
            errors: null,
        };
    }
};

function createFormData(car: CarDto): FormData {
    const formData = new FormData();

    Object.keys(car).forEach((key) => {
        const value = car[key as keyof CarDto];
        if (value !== undefined && value !== null) {
            formData.append(key, value.toString());
        }
    });

    car.pictures?.forEach((file) => {
        formData.append('pictures', file, file.name);
    });

    return formData;
}

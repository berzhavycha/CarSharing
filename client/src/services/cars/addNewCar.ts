import { axiosInstance } from "@/api";
import { Env } from "@/core";
import { Car, CarDto, FieldErrorsState } from "@/types";

type ServiceReturn = {
    car: Car | null;
    errors: FieldErrorsState<CarDto> | null
}

export const addNewCar = async (car: CarDto): Promise<ServiceReturn> => {
    try {
        console.log(car)
        const { data } = await axiosInstance.post(`${Env.API_BASE_URL}/cars`, car, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        })

        return {
            car: data,
            errors: null
        }
    } catch (error) {
        return {
            car: null,
            errors: null
        }
    }
}
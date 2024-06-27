import { axiosInstance } from "@/api";
import { Env } from "@/core";
import { Car, QueryCarsDto } from "@/types";

type ServiceReturn = {
    cars: Car[]
}

export const fetchCars = async (queryCarsDto: QueryCarsDto): Promise<ServiceReturn> => {
    try {
        const { data } = await axiosInstance.get(`${Env.API_BASE_URL}/cars`, { params: queryCarsDto });
        return { cars: data };
    } catch (error) {
        console.log(error);
        return { cars: [] }; 
    }
};

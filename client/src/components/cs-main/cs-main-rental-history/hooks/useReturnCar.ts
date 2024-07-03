import { returnCar } from "@/services"

export const useReturnCar = () => {
    const carReturnHandler = async (id: string) => {
        const { rental, error } = await returnCar(id)
        return { rental, error }
    }

    return { carReturnHandler }
}
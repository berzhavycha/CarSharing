import { Car } from "@/types"
import { useNavigate } from "react-router-dom"

type HookReturn = {
    onRentBtnClick: (car: Car) => void;
}

export const useRentCar = (): HookReturn => {
    const navigate = useNavigate()

    const onRentBtnClick = (car: Car): void => {
        navigate('/rental-form', { state: { car } })
    }

    return { onRentBtnClick }
}
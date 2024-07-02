import { useStore } from "@/context";
import { createRental } from "@/services";
import { RentalDto, PaymentDto } from "@/types";
import { useEffect, ChangeEvent } from "react";
import { useLocation } from "react-router-dom";

type HookReturn = {
    onSubmit: (rentalDto: RentalDto & PaymentDto) => Promise<void>;
    onRequestedHoursChange: (event: ChangeEvent<HTMLInputElement>) => void;
}

export const useRental = (onSuccess: () => void, onError: (error: string) => void): HookReturn => {
    const location = useLocation();
    const rentedCar = location.state.car;

    const {
        rentalStore: { rental, updatePrice, setRental },
        currentUserStore: { user, updateBalance },
    } = useStore();


    useEffect(() => {
        setRental({ price: rentedCar.pricePerHour });
    }, []);

    const onSubmit = async (rentalDto: RentalDto & PaymentDto): Promise<void> => {
        const { rental: createdRental, error } = await createRental({
            carId: rentedCar.id,
            ...rentalDto,
        });

        if (createdRental && user?.balance && rental) {
            updateBalance(user.balance - rental.price);
            onSuccess();
        } else if (error) {
            onError(error);
        }
    };

    const onRequestedHoursChange = (event: ChangeEvent<HTMLInputElement>): void => {
        const currentHours = +event.target.value;
        const carPricePerHour = rentedCar.pricePerHour * currentHours;
        updatePrice(carPricePerHour);
    };

    return { onSubmit, onRequestedHoursChange }
}
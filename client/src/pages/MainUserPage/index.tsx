import { CarCard } from "@/components";
import { FC } from "react";

export const MainUserPage: FC = () => {
    return (
        <CarCard
            model="Koenigsegg"
            type="Sport"
            fuelCapacity={90}
            transmission="Manual"
            capacity={2}
            pricePerHour={19}
            imageUrl="../../../public/car.png"
        />
    )
}
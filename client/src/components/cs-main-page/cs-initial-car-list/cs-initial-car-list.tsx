import { CSCarCard } from "@/components/cs-car";
import { CSCommonNoData } from "@/components/cs-common";
import { Env } from "@/core";
import { Car } from "@/types";
import { FC } from "react";

type Props = {
    cars: Car[]
}

export const CSInitialCarList: FC<Props> = ({ cars }) => {
    return (
        <>
            {cars.length === 0 ? (
                <CSCommonNoData message="No cars available" />
            ) : (
                cars.map((car) => (
                    <CSCarCard
                        key={car.id}
                        model={car.model}
                        pricePerHour={car.pricePerHour}
                        type={car.type}
                        steering={car.steering}
                        capacity={car.capacity}
                        fuelCapacity={car.fuelCapacity}
                        imageUrl={`${Env.API_BASE_URL}/local-files/${car.pictures[0]?.id}`}
                    />
                ))
            )}
        </>
    )
}
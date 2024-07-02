import { Car } from "@/types";
import { FC } from "react";
import styled from "styled-components";
import { CSMainSingleCarFeature } from "./cs-main-single-car-feature";
import { CSCommonPrice, CSCommonPrimaryButton } from "@/components/cs-common";
import { useRentCar } from "@/hooks";
import { getFuelUnit, CarFuelType } from "@/helpers";

type Props = {
    car: Car
}

export const CSMainSingleCarDetails: FC<Props> = ({ car }) => {
    const { onRentBtnClick } = useRentCar()

    const onRent = (): void => onRentBtnClick(car)

    return (
        <CarDetailsWrapper>
            <Title>{car.model}</Title>
            <Description>{car.description}</Description>
            <FeaturesWrapper>
                <CSMainSingleCarFeature label="Type" text={car.type} />
                <CSMainSingleCarFeature label="Year" text={car.year} />
                <CSMainSingleCarFeature label="Capacity" text={`${car.capacity} People`} />
                <CSMainSingleCarFeature label="Steering" text={car.steering} />
                <CSMainSingleCarFeature label="Fuel Type" text={car.fuelType} />
                <CSMainSingleCarFeature label="Fuel Capacity" text={`${car.fuelCapacity} ${getFuelUnit(car.fuelType as CarFuelType)}`} />
            </FeaturesWrapper>
            <CarFooter>
                <CSCommonPrice amount={car.pricePerHour} metric="hour" />
                <CSCommonPrimaryButton content="Rent Car" onClick={onRent} />
            </CarFooter>
        </CarDetailsWrapper>
    )
}

const CarDetailsWrapper = styled.div`
    width: 50%;
    background-color: white;
    padding: 30px;
    border-radius: 20px;
    box-shadow: var(--default-box-shadow);
`

const Title = styled.h2`
  font-size: 20px;
  font-weight: 700;
  color: var(--dark);
  margin-bottom: 20px;
`;

const Description = styled.h2`
  font-size: 15px;
  font-weight: 300;
  color: var(--dark);
  margin-bottom: 30px;
`;

const FeaturesWrapper = styled.div`
    display: flex;
    flex-wrap: wrap;
    gap: 20px 0;
    margin-bottom: 30px;
`

const CarFooter = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
`
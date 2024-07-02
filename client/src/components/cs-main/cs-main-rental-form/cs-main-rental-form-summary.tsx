import { FC } from "react";
import { useLocation } from "react-router-dom";
import styled from "styled-components";
import { SectionTitle, SectionDescription } from "./cs-main-rental-form";
import { Env } from "@/core";

export const CSMainRentalFormSummary: FC = () => {
    const location = useLocation()
    const car = location.state?.car

    return (
        <SummaryWrapper>
            <SectionTitle>Rental Summary</SectionTitle>
            <SectionDescription>Prices may change depending on the length of the rental and the price of your rental car.</SectionDescription>
            <CarInfoWrapper>
                <CarImage src={`${Env.API_BASE_URL}/local-files/${car.pictures[0]?.id}`} />
                <CarDetails>
                    <CarName>{car.model}</CarName>
                    <CarType>{car.type}</CarType>
                </CarDetails>
            </CarInfoWrapper>
            <Total>
                <div>
                    <h3>Total Rental Price</h3>
                    <TotalDescription>Overall price and includes rental discount</TotalDescription>
                </div>
                <PriceWrapper>${car.pricePerHour}</PriceWrapper>
            </Total>
        </SummaryWrapper>
    )
}

const SummaryWrapper = styled.div`
    width: 100%;
    height: 50%;
    background-color: white;
    border-radius: 20px;
    padding: 25px;
    margin-bottom: 20px;
    box-shadow: var(--default-box-shadow);
`

const CarInfoWrapper = styled.div`
    display: flex;
    gap: 15px;
    align-items: center;
    margin-bottom: 40px;
`

const CarImage = styled.img`
    width: 150px;
    height: 120px;
    padding: 5px;
    object-fit: contain;
    border: 1px solid var(--gray);
    border-radius: 15px;
`

const CarDetails = styled.div`
  display: flex;
  flex-direction: column;
  gap: 5px;
`

const CarName = styled.h2`
  color: var(--dark);
`

const CarType = styled.h4`
  color: var(--dark);
  font-weight: 300;
  margin-bottom: 10px;
`

const Total = styled.div`
    display: flex;
    justify-content: space-between;
    gap: 10px;
    align-items: center;
`

const TotalDescription = styled.div`
    font-size: 14px;
    color: var(--dark);
    margin-top: 5px;
`

const PriceWrapper = styled.h1`
  font-weight: bold;
  color: var(--dark);
`;

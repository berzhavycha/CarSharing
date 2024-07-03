import { RentalStatus, uppercaseFirstLetter, formatDate } from "@/helpers";
import { Rental } from "@/types";
import { FC } from "react";
import styled from "styled-components";
import { CSMainSingleRentalTransaction } from "./cs-main-single-rental-transactions";
import { CSCommonDetailsFeature } from "@/components/cs-common";

type Props = {
    rental: Rental
}

export const CSMainSingleRentalDetails: FC<Props> = ({ rental }) => {
    return (
        <RentalDetailsWrapper>
            <FeaturesWrapper>
                <CSCommonDetailsFeature label="Car Model" text={rental.originalCar?.model} />
                <CSCommonDetailsFeature label="Rental Status" component={<StatusBadge status={rental.status as RentalStatus}>
                    {uppercaseFirstLetter(rental.status)}
                </StatusBadge>} />
                <CSCommonDetailsFeature label="Rental Start" text={formatDate(rental.rentalStart)} />
                <CSCommonDetailsFeature label="Rental End" text={rental.rentalEnd ? formatDate(rental.rentalEnd) : 'Not returned yet'} />
                <CSCommonDetailsFeature label="Requested Hours" text={rental.requestedHours} />
                <CSCommonDetailsFeature label="Total Price" text={`$${rental.totalPrice.toFixed(2)}`} />
                <CSCommonDetailsFeature label="Pick-up Location" text={rental.pickUpLocation} />
                <CSCommonDetailsFeature label="Drop-off Location" text={rental.dropOffLocation} />
            </FeaturesWrapper>
            <CSMainSingleRentalTransaction rental={rental} />
        </RentalDetailsWrapper>
    )
}

const RentalDetailsWrapper = styled.div`
  width: 50%;
  background-color: white;
  padding: 30px;
  border-radius: 20px;
  box-shadow: var(--default-box-shadow);
`;

const FeaturesWrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 20px 0;
  margin-bottom: 30px;
`;


const StatusBadge = styled.span<{ status: RentalStatus }>`
  display: inline-block;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: bold;
  text-transform: uppercase;

  ${({ status }): string => {
        switch (status) {
            case RentalStatus.ACTIVE:
                return `
          color: #155724;
          background-color: #d4edda;
        `;
            case RentalStatus.CLOSED:
                return `
          color: #1b1e21;
          background-color: #d6d8d9;
        `;
            case RentalStatus.CANCELLED:
                return `
          color: #721c24;
          background-color: #f8d7da;
        `;
            default:
                return `
          color: #856404;
          background-color: #fff3cd;
        `;
        }
    }}
`;
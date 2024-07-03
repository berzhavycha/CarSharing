import { RentalStatus, uppercaseFirstLetter, formatDate } from "@/helpers";
import { Rental } from "@/types";
import { FC } from "react";
import styled from "styled-components";
import { CSMainSingleRentalTransaction } from "./cs-main-single-rental-transactions";
import { CSCommonDetailsFeature, CSCommonTitle } from "@/components/cs-common";

type Props = {
    rental: Rental
}

export const CSMainSingleRentalDetails: FC<Props> = ({ rental }) => {
    return (
        <RentalDetailsWrapper>
            <CSCommonTitle>Rental Details</CSCommonTitle>
            <FeaturesWrapper>
                <CSCommonDetailsFeature label="Car Model" text={rental.originalCar?.model} />
                <CSCommonDetailsFeature label="Rental Status" component={
                    <StatusBadge $status={rental.status as RentalStatus}>
                        {uppercaseFirstLetter(rental.status)}
                    </StatusBadge>
                } />
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


const StatusBadge = styled.div<{ $status: RentalStatus }>`
  width: 100px;
  display: inline-block;
  padding: 4px 10px;
  border-radius: 5px;
  font-size: 12px;
  font-weight: bold;
  text-align: center;
  text-transform: capitalize;

   color: ${(props): string => {
        switch (props.$status) {
            case RentalStatus.ACTIVE:
                return 'var(--green-status-text)';
            case RentalStatus.CLOSED:
                return 'var(--yellow-status-text)';
            case RentalStatus.CANCELLED:
                return 'var(--red-status-text)';
            default:
                return 'var(--default-text)';
        }
    }};
  background-color: ${(props): string => {
        switch (props.$status) {
            case RentalStatus.ACTIVE:
                return 'var(--green-status-bg)';
            case RentalStatus.CLOSED:
                return 'var(--yellow-status-bg)';
            case RentalStatus.CANCELLED:
                return 'var(--red-status-bg)';
            default:
                return 'var(--default-bg)';
        }
    }};
  border: 2px solid
    ${(props): string => {
        switch (props.$status) {
            case RentalStatus.ACTIVE:
                return 'var(--green-status-border)';
            case RentalStatus.CLOSED:
                return 'var(--yellow-status-border)';
            case RentalStatus.CANCELLED:
                return 'var(--red-status-border)';
            default:
                return 'var(--default-border)';
        }
    }};
`;
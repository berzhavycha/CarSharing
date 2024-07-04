import { RentalStatus, uppercaseFirstLetter, formatDate } from "@/helpers";
import { Rental } from "@/types";
import { FC, useEffect } from "react";
import styled from "styled-components";
import { CSMainSingleRentalTransaction } from "./cs-main-single-rental-transactions";
import { CSCommonDetailsFeature, CSCommonPrimaryButton, CSCommonTitle } from "@/components/cs-common";
import { useStore } from "@/context";
import { observer } from "mobx-react-lite";
import { useParams } from "react-router-dom";

type Props = {
    rental: Rental
}

export const CSMainSingleRentalDetails: FC<Props> = observer(({ rental }) => {
    const { rentalStore: { singleRental, setSingleRental, fetchSingleRental, returnCar } } = useStore()
    const { rentalId } = useParams() as { rentalId: string }

    useEffect(() => {
        setSingleRental(rental)
    }, [])

    const onCarReturn = async (): Promise<void> => {
        await returnCar(rentalId)
        await fetchSingleRental(rentalId)
    }

    const usedRental = singleRental ?? rental

    return (
        <RentalDetailsWrapper>
            <CSCommonTitle>Rental Details</CSCommonTitle>
            <FeaturesWrapper>
                <CSCommonDetailsFeature label="Car Model" text={usedRental.originalCar?.model} />
                <CSCommonDetailsFeature label="Rental Status" component={
                    <StatusBadge $status={usedRental.status as RentalStatus}>
                        {uppercaseFirstLetter(usedRental.status)}
                    </StatusBadge>
                } />
                <CSCommonDetailsFeature label="Rental Start" text={formatDate(usedRental.rentalStart)} />
                <CSCommonDetailsFeature label="Rental End" text={usedRental.rentalEnd ? formatDate(usedRental.rentalEnd) : 'Not returned yet'} />
                <CSCommonDetailsFeature label="Requested Hours" text={usedRental.requestedHours} />
                <CSCommonDetailsFeature label="Total Price" text={`$${usedRental.totalPrice.toFixed(2)}`} />
                <CSCommonDetailsFeature label="Pick-up Location" text={usedRental.pickUpLocation} />
                <CSCommonDetailsFeature label="Drop-off Location" text={usedRental.dropOffLocation} />
            </FeaturesWrapper>
            <CSMainSingleRentalTransaction rental={usedRental} />
            {rental.status === RentalStatus.ACTIVE && (
                <ReturnCarWrapper>
                    <CSCommonPrimaryButton content="Return Car" onClick={onCarReturn} />
                </ReturnCarWrapper>
            )}
        </RentalDetailsWrapper>
    )
})

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

const ReturnCarWrapper = styled.div`
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
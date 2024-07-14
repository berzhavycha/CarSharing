import { observer } from 'mobx-react-lite';
import { FC, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import styled from 'styled-components';

import {
  BaseSection,
  CSCommonDetailsFeature,
  CSCommonPrimaryButton,
  CSCommonRentalStatusBadge,
  SectionTitle,
} from '@/components/cs-common';
import { useStore } from '@/context';
import { formatDate, RentalStatus, uppercaseFirstLetter } from '@/helpers';
import { device } from '@/styles';
import { Rental } from '@/types';

import { CSMainSingleRentalTransaction } from './cs-main-single-rental-transactions';
import { CSMainRentalReturnConfirmModal } from '../cs-main-rental-history';

type Props = {
  rental: Rental;
};

export const CSMainSingleRentalDetails: FC<Props> = observer(({ rental }) => {
  const { singleRental, carReturn } = useStore();
  const { rentalId } = useParams() as { rentalId: string };

  useEffect(() => {
    singleRental.setRental(rental);
  }, [rentalId]);

  const onCarReturn = async (): Promise<void> => {
    carReturn.setRentalToReturn(singleRental.rental as Rental)
  };

  const onSuccessReturn = async (): Promise<void> => await singleRental.fetchSingleRental(rentalId)
  const usedRental = singleRental.rental ?? rental;

  return (
    <RentalDetailsWrapper>
      <Title>Rental Details</Title>
      <FeaturesWrapper>
        <CSCommonDetailsFeature label="Car Model" text={usedRental.originalCar?.model} />
        <CSCommonDetailsFeature
          label="Rental Status"
          component={
            <StatusBadge $status={usedRental.status as RentalStatus}>
              {uppercaseFirstLetter(usedRental.status)}
            </StatusBadge>
          }
        />
        <CSCommonDetailsFeature label="Rental Start" text={formatDate(usedRental.rentalStart)} />
        <CSCommonDetailsFeature
          label="Rental End"
          text={usedRental.rentalEnd ? formatDate(usedRental.rentalEnd) : 'Not returned yet'}
        />
        <CSCommonDetailsFeature label="Requested Hours" text={usedRental.requestedHours} />
        <CSCommonDetailsFeature label="Total Price" text={`$${usedRental.totalPrice.toFixed(2)}`} />
        <CSCommonDetailsFeature label="Pick-up Location" text={usedRental.pickUpLocation} />
        <CSCommonDetailsFeature label="Drop-off Location" text={usedRental.dropOffLocation} />
      </FeaturesWrapper>
      <CSMainSingleRentalTransaction rental={usedRental} />
      {usedRental.status === RentalStatus.ACTIVE && (
        <ReturnCarWrapper>
          <CSCommonPrimaryButton content="Return Car" onClick={onCarReturn} />
        </ReturnCarWrapper>
      )}
      <CSMainRentalReturnConfirmModal onSuccessReturn={onSuccessReturn} />
    </RentalDetailsWrapper>
  );
});

export const Title = styled(SectionTitle)`
  margin-bottom: 25px;

  @media ${device.sm} {
    font-size: 20px;
  }

  @media ${device.xs} {
    font-size: 16px;
  }
`;

const RentalDetailsWrapper = styled(BaseSection)`
  width: 70%;
  padding: 30px;
  border-radius: 20px;

  @media ${device.lg} {
    width: 100%;
  }

  @media ${device.sm} {
    padding: 20px;
  }
`;

const FeaturesWrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 20px 0;
  margin-bottom: 30px;
`;

const ReturnCarWrapper = styled.div`
  margin-top: 30px;

  @media ${device.sm} {
    margin-top: 20px;
  }
`;

const StatusBadge = styled(CSCommonRentalStatusBadge)`
  width: auto;

  @media ${device.sm} {
    font-size: 12px;
    padding: 4px 10px;
  }

  @media ${device.xs} {
    font-size: 10px;
    padding: 4px 10px;
  }
`;

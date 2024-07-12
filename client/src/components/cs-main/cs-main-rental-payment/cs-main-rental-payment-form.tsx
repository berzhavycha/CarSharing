import { FC } from 'react';
import styled from 'styled-components';

import {
  BaseSection,
  CSCommonForm,
  CSCommonPaymentForm,
  SectionDescription,
  SectionTitle,
} from '@/components/cs-common';
import { rentalSchema } from '@/helpers';
import { device } from '@/styles';
import { PaymentDto, RentalDto } from '@/types';

import { useRental } from './hooks';
import { useNonNegativeInput } from '@/hooks';

type Props = {
  onSuccess: () => void;
  onError: (error: string) => void;
};

export const CSMainRentalPaymentForm: FC<Props> = ({ onSuccess, onError }) => {
  const { onSubmit, onRequestedHoursChange } = useRental(onSuccess, onError);
  const { preventNegativeInput } = useNonNegativeInput()

  return (
    <FormWrapper>
      <CSCommonForm<RentalDto & PaymentDto> validationSchema={rentalSchema} onSubmit={onSubmit}>
        <FormInfoWrapper>
          <SectionTitle>Rental Info</SectionTitle>
          <SectionDescription>Please enter your rental info</SectionDescription>
          <RentalFormBlocks>
            <CSCommonForm.Input name="pickUpLocation" label="Pick Up Location" />
            <CSCommonForm.Input name="dropOffLocation" label="Drop Off Location" />
            <CSCommonForm.Input
              name="hours"
              label="Requested Hours"
              type="number"
              onChange={onRequestedHoursChange}
              onKeyDown={preventNegativeInput}
              min={0}
            />
          </RentalFormBlocks>
        </FormInfoWrapper>
        <CSCommonPaymentForm
          title="Payment Details"
          description="Please enter your payment details"
          submitButtonContent="Rent Now"
        />
      </CSCommonForm>
    </FormWrapper>
  );
};

const FormWrapper = styled.div`
  width: 65%;

  @media ${device.md} {
    width: 100%;
  }
`;

const FormInfoWrapper = styled(BaseSection)`
  padding: 35px 35px 10px 35px;

  margin-bottom: 20px;
`;

const RentalFormBlocks = styled.div`
  display: grid;
  grid-column: span 3;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 0px 40px;

  @media ${device.lg} {
    grid-column: span 2;
    grid-template-columns: 1fr 1fr;
  }

  @media ${device.sm} {
    grid-column: span 1;
    grid-template-columns: 1fr;
  }
`;

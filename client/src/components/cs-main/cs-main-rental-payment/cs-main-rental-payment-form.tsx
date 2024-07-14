import { ChangeEvent, FC } from 'react';
import styled from 'styled-components';

import {
  BaseSection,
  BtnSpinner,
  CSCommonForm,
  CSCommonModal,
  CSCommonPaymentForm,
  SectionDescription,
  SectionTitle,
} from '@/components/cs-common';
import { MAX_REQUESTED_HOURS, rentalSchema } from '@/helpers';
import { useNonNegativeInput } from '@/hooks';
import { device } from '@/styles';
import { PaymentDto, RentalDto } from '@/types';

import { useRental } from './hooks';

export const CSMainRentalPaymentForm: FC = () => {
  const {
    onSubmit,
    isRentSuccessful,
    setIsRentSuccessful,
    isLoading,
    errorMessage,
    setErrorMessage,
    onRequestedHoursChange,
  } = useRental();
  const { preventNegativeInput } = useNonNegativeInput();

  const rentBtnContent = isLoading ? <BtnSpinner /> : 'Rent';

  const onCloseSuccessModal = (): void => setIsRentSuccessful(false);
  const onCloseErrorWindow = (): void => setErrorMessage('');

  const handleRequestedHoursChange = (e: ChangeEvent<HTMLInputElement>): void => {
    const value = Number(e.target.value);
    if (value <= MAX_REQUESTED_HOURS) {
      onRequestedHoursChange(e);
    } else {
      e.target.value = MAX_REQUESTED_HOURS.toString();
    }
  };

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
              onChange={handleRequestedHoursChange}
              onKeyDown={preventNegativeInput}
              min={0}
              max={MAX_REQUESTED_HOURS}
            />
          </RentalFormBlocks>
        </FormInfoWrapper>
        <CSCommonPaymentForm
          title="Payment Details"
          description="Please enter your payment details"
          submitButtonContent={rentBtnContent}
        />
      </CSCommonForm>

      {isRentSuccessful && (
        <CSCommonModal
          type="confirm"
          title="Success"
          message="Your rental was successfully created."
          onClose={onCloseSuccessModal}
          onOk={onCloseSuccessModal}
        />
      )}

      {errorMessage && (
        <CSCommonModal
          type="error"
          title="Error"
          message={errorMessage}
          onClose={onCloseErrorWindow}
        />
      )}
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

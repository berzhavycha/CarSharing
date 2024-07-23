import { FC } from 'react';
import styled from 'styled-components';

import {
  BaseSection,
  BtnSpinner,
  CSCommonForm,
  CSCommonModal,
  SectionDescription,
  SectionTitle,
} from '@/components/cs-common';
import { MAX_REQUESTED_HOURS, rentalFormSchema } from '@/helpers';
import { useNonNegativeInput } from '@/hooks';
import { device } from '@/styles';
import { RentalDto } from '@/types';

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

  return (
    <FormWrapper>
      <CSCommonForm<RentalDto> validationSchema={rentalFormSchema} onSubmit={onSubmit}>
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
              max={MAX_REQUESTED_HOURS}
            />
          </RentalFormBlocks>
          <CSCommonForm.SubmitButton buttonContent={rentBtnContent} />
        </FormInfoWrapper>
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
  padding: 35px;
  margin-bottom: 20px;
`;

const RentalFormBlocks = styled.div`
  display: flex;
  flex-direction: column;
`;

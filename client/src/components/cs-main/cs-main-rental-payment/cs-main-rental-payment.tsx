import { observer } from 'mobx-react-lite';
import { FC, useState } from 'react';
import styled from 'styled-components';

import { CSCommonContainer, CSCommonModal } from '@/components/cs-common';

import { CSMainRentalPaymentForm } from './cs-main-rental-payment-form';
import { CSMainRentalPaymentSummary } from './cs-main-rental-payment-summary';

export const CSMainRentalPayment: FC = observer(() => {
  const [isRentSuccessful, setIsRentSuccessful] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>('');

  const onCloseSuccessModal = (): void => setIsRentSuccessful(false);
  const onCloseErrorWindow = (): void => setErrorMessage('');

  const onSuccess = (): void => setIsRentSuccessful(true);
  const onError = (error: string): void => setErrorMessage(error);

  return (
    <CSCommonContainer>
      <RentalForm>
        <CSMainRentalPaymentForm onSuccess={onSuccess} onError={onError} />
        <CSMainRentalPaymentSummary />
      </RentalForm>

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
    </CSCommonContainer>
  );
});

const RentalForm = styled.div`
  width: 100%;
  display: flex;
  gap: 40px;
  margin-top: 50px;
`;

export const SectionTitle = styled.h3`
  color: var(--dark);
  margin-bottom: 10px;
`;

export const SectionDescription = styled.p`
  color: var(--dark);
  font-size: 14px;
  font-weight: 300;
  margin-bottom: 30px;
`;

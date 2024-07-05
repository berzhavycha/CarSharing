import { FC } from 'react';
import styled from 'styled-components';

import {
  CSCommonContainer,
  CSCommonErrorMessage,
  CSCommonForm,
  CSCommonModal,
  CSCommonPaymentForm,
} from '@/components/cs-common';
import { useStore } from '@/context';
import { updateUserBalanceSchema } from '@/helpers';
import { UpdateUserBalanceDto } from '@/types';

import { useTopUp } from './hooks';

export const CSMainUserTopUp: FC = () => {
  const {
    currentUserStore: { topUpErrors },
  } = useStore();
  const { onSubmit, isTopUpSuccessful, setIsTopUpSuccessful, unexpectedError, setUnexpectedError } =
    useTopUp();

  const onCloseSuccessModal = (): void => setIsTopUpSuccessful(false);
  const onCloseErrorModal = (): void => setUnexpectedError('');

  return (
    <CSCommonContainer>
      <CSCommonForm<UpdateUserBalanceDto>
        validationSchema={updateUserBalanceSchema}
        onSubmit={onSubmit}
      >
        <FormInfoWrapper>
          <SectionTitle>Balance Form</SectionTitle>
          <CSCommonErrorMessage>{topUpErrors?.unexpectedError ?? ''}</CSCommonErrorMessage>
          <CSCommonForm.Input
            label="Amount"
            name="amount"
            error={topUpErrors?.amount ?? ''}
            type="number"
          />
        </FormInfoWrapper>
        <CSCommonPaymentForm
          title="Top Up Details"
          description="Please enter your payment details"
          submitButtonContent="Top Up"
        />
      </CSCommonForm>

      {isTopUpSuccessful && (
        <CSCommonModal
          type="confirm"
          title="Success"
          message="You have successfully updated your balance!"
          onClose={onCloseSuccessModal}
          onOk={onCloseSuccessModal}
        />
      )}

      {unexpectedError && (
        <CSCommonModal
          type="error"
          title="Error"
          message={unexpectedError}
          onClose={onCloseErrorModal}
        />
      )}
    </CSCommonContainer>
  );
};

const FormInfoWrapper = styled.div`
  width: 100%;
  background-color: white;
  border-radius: 20px;
  padding: 35px 35px 10px 35px;
  margin: 50px 0;
  box-shadow: var(--default-box-shadow);
`;

const SectionTitle = styled.h3`
  color: var(--dark);
  margin-bottom: 10px;
`;

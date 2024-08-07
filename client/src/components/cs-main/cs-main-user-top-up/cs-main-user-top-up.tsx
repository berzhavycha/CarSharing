import { observer } from 'mobx-react-lite';
import { FC } from 'react';
import styled from 'styled-components';

import {
  BaseSection,
  BtnSpinner,
  CSCommonContainer,
  CSCommonErrorMessage,
  CSCommonForm,
  CSCommonModal,
  CSCommonPaymentForm,
  SectionTitle,
} from '@/components/cs-common';
import { useStore } from '@/context';
import { updateUserBalanceSchema } from '@/helpers';
import { useNonNegativeInput } from '@/hooks';
import { device } from '@/styles';
import { UpdateUserBalanceDto } from '@/types';

import { useTopUp } from './hooks';

export const CSMainUserTopUp: FC = observer(() => {
  const {
    currentUserStore: { errors, isLoading },
  } = useStore();
  const { onSubmit, isTopUpSuccessful, setIsTopUpSuccessful, unexpectedError, setUnexpectedError } =
    useTopUp();
  const { preventNegativeInput } = useNonNegativeInput();

  const onCloseSuccessModal = (): void => setIsTopUpSuccessful(false);
  const onCloseErrorModal = (): void => setUnexpectedError('');

  const topUpBtnContent = isLoading ? <BtnSpinner /> : 'Top Up';

  return (
    <>
      <CSCommonContainer>
        <TopUpContainer>
          <CSCommonForm<UpdateUserBalanceDto>
            validationSchema={updateUserBalanceSchema}
            onSubmit={onSubmit}
          >
            <FormInfoWrapper>
              <SectionTitle>Balance Form</SectionTitle>
              <CSCommonErrorMessage>{errors?.topUp?.unexpectedError ?? ''}</CSCommonErrorMessage>
              <CSCommonForm.Input
                label="Amount"
                name="amount"
                error={errors.topUp?.amount ?? ''}
                type="number"
                onKeyDown={preventNegativeInput}
                min={0}
              />
            </FormInfoWrapper>
            <CSCommonPaymentForm
              title="Top Up Details"
              description="Please enter your payment details"
              submitButtonContent={topUpBtnContent}
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
        </TopUpContainer>
      </CSCommonContainer>
    </>
  );
});

const TopUpContainer = styled.div`
  margin-bottom: 50px;
`;

const FormInfoWrapper = styled(BaseSection)`
  padding: 35px 35px 10px 35px;
  margin: 50px 0;

  @media ${device.sm} {
    padding: 25px 35px 5px 25px;
  }
`;

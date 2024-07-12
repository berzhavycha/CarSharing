import { observer } from 'mobx-react-lite';
import { FC } from 'react';
import styled from 'styled-components';

import { CSCommonContainer } from '@/components/cs-common';
import { device } from '@/styles';

import { CSMainRentalPaymentForm } from './cs-main-rental-payment-form';
import { CSMainRentalPaymentSummary } from './cs-main-rental-payment-summary';

export const CSMainRentalPayment: FC = observer(() => {
  return (
    <CSCommonContainer>
      <RentalForm>
        <CSMainRentalPaymentForm />
        <CSMainRentalPaymentSummary />
      </RentalForm>
    </CSCommonContainer>
  );
});

const RentalForm = styled.div`
  display: flex;
  gap: 20px;
  margin: 50px 0;

  @media ${device.md} {
    flex-direction: column;
    gap: 20px;
    margin: 50px 0;
  }
`;

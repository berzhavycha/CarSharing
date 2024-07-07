import { FC } from 'react';
import styled from 'styled-components';

import { CSCommonForm } from '@/components/cs-common';
import { device } from '@/styles';
import { BaseSection, SectionDescription, SectionTitle } from '../cs-common-section';

type Props = {
  title: string;
  description: string;
  submitButtonContent: string;
};

export const CSCommonPaymentForm: FC<Props> = ({ title, description, submitButtonContent }) => {
  return (
    <FormInfoWrapper>
      <SectionTitle>{title}</SectionTitle>
      <SectionDescription>{description}</SectionDescription>
      <PaymentFormBlocks>
        <CSCommonForm.Input name="cardNumber" label="Card Number" />
        <CSCommonForm.Input name="expirationDate" label="Expiration Date" />
        <CSCommonForm.Input name="cardHolder" label="Card Holder" />
        <CSCommonForm.Input name="CVC" label="CVC" type="number" />
      </PaymentFormBlocks>
      <CSCommonForm.SubmitButton content={submitButtonContent} />
    </FormInfoWrapper>
  );
};

const FormInfoWrapper = styled(BaseSection)`
  @media ${device.sm} {
    padding: 25px 35px 25px 25px;
  }
`;

const PaymentFormBlocks = styled.div`
  display: grid;
  grid-column: span 2;
  grid-template-columns: 1fr 1fr;
  gap: 0px 40px;

  @media ${device.sm} {
    grid-column: span 1;
    grid-template-columns: 1fr;
  }
`;

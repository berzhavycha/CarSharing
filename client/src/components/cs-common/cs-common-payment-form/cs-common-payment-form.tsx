import { FC } from 'react';
import styled from 'styled-components';

import { CSCommonForm } from '@/components/cs-common';

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

const FormInfoWrapper = styled.div`
  width: 100%;
  background-color: white;
  border-radius: 20px;
  padding: 35px;
  margin: 50px 0;
  box-shadow: var(--default-box-shadow);
`;

const SectionTitle = styled.h3`
  color: var(--dark);
  margin-bottom: 10px;
`;

const SectionDescription = styled.p`
  color: var(--dark);
  font-size: 14px;
  font-weight: 300;
  margin-bottom: 30px;
`;

const PaymentFormBlocks = styled.div`
  display: grid;
  grid-column: span 2;
  grid-template-columns: 1fr 1fr;
  gap: 0px 40px;
`;

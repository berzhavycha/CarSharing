import { FC, useState } from 'react';
import styled from 'styled-components';

import { CSCommonForm } from '@/components/cs-common';
import { device } from '@/styles';

import Cards, { Focused } from 'react-credit-cards-2';
import 'react-credit-cards-2/dist/es/styles-compiled.css';
import { BaseSection, SectionDescription, SectionTitle } from '../cs-common-section';

type Props = {
  title: string;
  description: string;
  submitButtonContent: string;
};

export const CSCommonPaymentForm: FC<Props> = ({ title, description, submitButtonContent }) => {
  const [cardDetails, setCardDetails] = useState({
    cardNumber: '',
    cardHolder: '',
    expirationDate: '',
    CVC: '',
  });

  const [focused, setFocused] = useState<string>('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setCardDetails({
      ...cardDetails,
      [e.target.name]: e.target.value,
    });
  };

  const handleInputFocus = (e: React.FocusEvent<HTMLInputElement>): void => {
    setFocused(e.target.name);
  };

  return (
    <FormInfoWrapper>
      <SectionTitle>{title}</SectionTitle>
      <SectionDescription>{description}</SectionDescription>
      <Cards
        number={cardDetails.cardNumber}
        name={cardDetails.cardHolder}
        expiry={cardDetails.expirationDate}
        cvc={cardDetails.CVC}
        focused={focused as Focused}
      />
      <PaymentFormBlocks>
        <CSCommonForm.Input
          name="cardNumber"
          label="Card Number"
          onChange={handleInputChange}
          onFocus={handleInputFocus}
        />
        <CSCommonForm.Input
          name="expirationDate"
          label="Expiration Date"
          onChange={handleInputChange}
          onFocus={handleInputFocus}
        />
        <CSCommonForm.Input
          name="cardHolder"
          label="Card Holder"
          onChange={handleInputChange}
          onFocus={handleInputFocus}
        />
        <CSCommonForm.Input
          name="CVC"
          label="CVC"
          type="number"
          onChange={handleInputChange}
          onFocus={handleInputFocus}
        />
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

import { FC } from 'react';
import styled from 'styled-components';

import { CSCommonForm } from '@/components/cs-common';
import { device } from '@/styles';

import Cards, { Focused } from 'react-credit-cards-2';
import 'react-credit-cards-2/dist/es/styles-compiled.css';
import { BaseSection, SectionDescription, SectionTitle } from '../cs-common-section';
import { useNonNegativeInput } from '@/hooks';
import { useFormCard } from './hooks';

type Props = {
  title: string;
  description: string;
  submitButtonContent: string | JSX.Element;
};

export const CSCommonPaymentForm: FC<Props> = ({ title, description, submitButtonContent }) => {
  const { preventNegativeInput } = useNonNegativeInput()
  const { cardDetails, focused, handleInputChange, handleInputFocus } = useFormCard()

  return (
    <FormInfoWrapper>
      <SectionTitle>{title}</SectionTitle>
      <SectionDescription>{description}</SectionDescription>
      <FormContent>
        <CardsWrapper>
          <Cards
            number={cardDetails.cardNumber}
            name={cardDetails.cardHolder}
            expiry={cardDetails.expirationDate}
            cvc={cardDetails.cvc}
            focused={focused as Focused}
          />
        </CardsWrapper>
        <PaymentFormBlocks>
          <CSCommonForm.Input
            name="cardNumber"
            label="Card Number"
            onChange={handleInputChange}
            onFocus={handleInputFocus}
          />
          <CSCommonForm.Input
            name="cardHolder"
            label="Card Holder"
            onChange={handleInputChange}
            onFocus={handleInputFocus}
          />
          <FormRow>
            <CSCommonForm.Input
              name="expirationDate"
              label="Expiration Date"
              onChange={handleInputChange}
              onFocus={handleInputFocus}
            />
            <CSCommonForm.Input
              name="cvc"
              label="CVC"
              type="number"
              onChange={handleInputChange}
              onFocus={handleInputFocus}
              onKeyDown={preventNegativeInput}
              min={0}
            />
          </FormRow>
        </PaymentFormBlocks>
      </FormContent>
      <CSCommonForm.SubmitButton buttonContent={submitButtonContent} />
    </FormInfoWrapper>
  );
};

const FormInfoWrapper = styled(BaseSection)`
  @media ${device.sm} {
    padding: 25px 35px 25px 25px;
  }
`;

const FormContent = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  flex-wrap: wrap;
`;

const CardsWrapper = styled.div`
  flex: 0 0 30%;
  margin-right: 20px;
  margin-bottom: 20px;
`;

const PaymentFormBlocks = styled.div`
  flex: 1 1 auto;
  display: grid;
  grid-template-rows: repeat(3, auto);
  grid-gap: 20px;

  @media ${device.sm} {
    grid-template-columns: 1fr;
  }
`;

const FormRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-gap: 40px;
`;


import { FC } from 'react';
import Cards, { Focused } from 'react-credit-cards-2';
import 'react-credit-cards-2/dist/es/styles-compiled.css';
import styled from 'styled-components';

import { CSCommonForm } from '@/components/cs-common';
import { useNonNegativeInput } from '@/hooks';
import { CreditCardStyles, device } from '@/styles';

import { BaseSection, SectionDescription, SectionTitle } from '../cs-common-section';

import { useFormCard } from './hooks';

type Props = {
  title: string;
  description: string;
  submitButtonContent: string | JSX.Element;
};

export const CSCommonPaymentForm: FC<Props> = ({ title, description, submitButtonContent }) => {
  const { preventNegativeInput } = useNonNegativeInput();
  const { cardDetails, focused, handleInputChange, handleInputFocus } = useFormCard();

  return (
    <FormInfoWrapper>
      <SectionTitle>{title}</SectionTitle>
      <SectionDescription>{description}</SectionDescription>
      <FormContent>
        <CardsWrapper>
          <CreditCardStyles />
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
      <SubmitButtonContainer>
        <CSCommonForm.SubmitButton buttonContent={submitButtonContent} />
      </SubmitButtonContainer>
    </FormInfoWrapper>
  );
};

const FormInfoWrapper = styled(BaseSection)`
  width: 100%;

  @media ${device.sm} {
    padding: 25px 35px 25px 25px;
  }
`;

const FormContent = styled.div`
  display: flex;
  gap: 20px;
  flex-wrap: wrap;
  align-items: center;

  @media ${device.sm} {
    justify-content: center;
  }
`;

const CardsWrapper = styled.div`
  flex: 0 0 30%;
  margin-bottom: 20px;

  @media ${device.sm} {
    width: 100%;
  }

  @media ${device.md} {
    max-width: 400px;
  }
`;

const PaymentFormBlocks = styled.div`
  flex: 1;
  display: grid;
  grid-template-rows: repeat(3, auto);
  grid-gap: 10px;

  @media ${device.sm} {
    grid-template-columns: 1fr;
  }

  @media ${device.md} {
    grid-gap: 0px;
  }
`;

const FormRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-gap: 0 40px;

  @media ${device.sm} {
    grid-template-columns: 1fr;
    grid-gap: 0 0;
  }
`;

const SubmitButtonContainer = styled.div`
  text-align: right;
`
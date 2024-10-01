import { observer } from 'mobx-react-lite';
import { FC } from 'react';
import styled from 'styled-components';

import { CSCommonErrorMessage, CSCommonSpinner } from '@/components/cs-common';

import { useConfirmEmail } from './hooks';

export const CSAuthConfirmEmail: FC = observer(() => {
  const { expectedErrorMessage, isLoading } = useConfirmEmail();

  console.log(expectedErrorMessage);

  return (
    <Container>
      <FormWrapper>
        <Heading>Email Confirmation</Heading>
        {isLoading && <Subtitle>We are confirming your email. Please wait...</Subtitle>}

        {expectedErrorMessage && (
          <CSCommonErrorMessage>{expectedErrorMessage}</CSCommonErrorMessage>
        )}

        <SpinnerContainer>{isLoading ? <CSCommonSpinner /> : null}</SpinnerContainer>
      </FormWrapper>
    </Container>
  );
});

const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: #f9f9f9;
`;

const FormWrapper = styled.div`
  background-color: #fff;
  padding: 40px;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
  border-radius: 8px;
  max-width: 400px;
  width: 100%;
  text-align: center;
`;

const Heading = styled.h1`
  font-size: 24px;
  margin-bottom: 10px;
  color: #333;
`;

const Subtitle = styled.p`
  font-size: 14px;
  margin-bottom: 20px;
  color: #666;
`;

const SpinnerContainer = styled.p`
  display: flex;
  justify-content: center;
  align-items: center;
`;

import { observer } from 'mobx-react-lite';
import { FC } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import styled from 'styled-components';

import { BtnSpinner, CSCommonErrorMessage, CSCommonForm } from '@/components/cs-common';
import { useStore } from '@/context';
import { authRedirectPages, AuthType, getUserSchema, Roles } from '@/helpers';
import { device } from '@/styles';
import { SignInUserDto } from '@/types';

import { BaseFormInner, ErrorMessageWrapper, FormContainer, RedirectLink, Span, Title } from '../cs-auth-sign-up';

export const CSAuthSignIn: FC = observer(() => {
  const { currentUserStore } = useStore();

  const navigate = useNavigate();
  const location = useLocation();
  const errorMessage = location.state?.errorMessage ?? '';

  const onSubmit = async (data: SignInUserDto): Promise<void> => {
    await currentUserStore.signIn(data);
    if (currentUserStore.user) {
      navigate(authRedirectPages[currentUserStore.user.role as Roles]);
    }
  };

  const btnContent = currentUserStore.isLoading ? <BtnSpinner /> : 'Sign In'

  return (
    <FormContainer>
      <FormInner>
        <Title>Login</Title>
        <Span>
          Don't Have an Account?
          <RedirectLink to="/sign-up">Register here</RedirectLink> instead
        </Span>
        <ErrorMessageWrapper>
          <CSCommonErrorMessage>
            {currentUserStore.errors.signIn?.unexpectedError ?? errorMessage}
          </CSCommonErrorMessage>
        </ErrorMessageWrapper>
        <CSCommonForm<SignInUserDto>
          validationSchema={getUserSchema(AuthType.SIGN_IN)}
          onSubmit={onSubmit}
          shouldReset={false}
        >
          <FormBlocks>
            <CSCommonForm.Input
              label="Email"
              name="email"
              error={currentUserStore.errors.signIn?.email}
            />
            <CSCommonForm.Input
              label="Password"
              name="password"
              error={currentUserStore.errors.signIn?.password}
              isSecured
            />
          </FormBlocks>
          <CSCommonForm.SubmitButton
            buttonContent={btnContent}
            disabled={currentUserStore.isLoading} />
        </CSCommonForm>
      </FormInner>
    </FormContainer>
  );
});

const FormInner = styled(BaseFormInner)`
  width: 35%;

  @media ${device.lg} {
    width: 40%;
  }

  @media ${device.md} {
    width: 60%;
  }

  @media ${device.sm} {
    width: 90%;
  }
`;



const FormBlocks = styled.div`
  display: flex;
  flex-direction: column;
`;

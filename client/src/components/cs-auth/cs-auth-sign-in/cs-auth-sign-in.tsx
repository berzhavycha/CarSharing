import { observer } from 'mobx-react-lite';
import { FC } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import styled from 'styled-components';

import { CSCommonErrorMessage, CSCommonForm } from '@/components/cs-common';
import { useStore } from '@/context';
import { authCedirectPages, AuthType, getUserSchema, Roles } from '@/helpers';
import { SignInUserDto } from '@/types';

import { ErrorMessageWrapper, Span, Title } from '../cs-auth-sign-up';
import { device } from '@/styles';

export const CSAuthSignIn: FC = observer(() => {
  const { currentUserStore } = useStore();

  const navigate = useNavigate();
  const location = useLocation();
  const errorMessage = location.state?.errorMessage;

  const onSubmit = async (data: SignInUserDto): Promise<void> => {
    await currentUserStore.signIn(data);
    if (currentUserStore.user) {
      navigate(authCedirectPages[currentUserStore.user.role as Roles]);
    }
  };

  return (
    <FormInner>
      <Title>Login</Title>
      <Span>
        Don't Have an Account?
        <Link to="/sign-up">
          Register here
        </Link>{' '}
        instead
      </Span>
      <ErrorMessageWrapper>
        <CSCommonErrorMessage>
          {currentUserStore.signInErrors?.unexpectedError ?? errorMessage ?? ''}
        </CSCommonErrorMessage>
      </ErrorMessageWrapper>
      <CSCommonForm<SignInUserDto>
        validationSchema={getUserSchema(AuthType.SIGN_IN, 'none')}
        onSubmit={onSubmit}
      >
        <FormBlocks>
          <CSCommonForm.Input
            label="Email"
            name="email"
            error={currentUserStore.signInErrors?.email}
          />
          <CSCommonForm.Input
            label="Password"
            name="password"
            error={currentUserStore.signInErrors?.password}
            isSecured
          />
        </FormBlocks>
        <CSCommonForm.SubmitButton content="Log In" />
      </CSCommonForm>
    </FormInner>
  );
});

const FormInner = styled.div`
  width: 35%;
  padding: 40px;
  position: absolute;
  border-radius: 10px;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: white;
  box-shadow: var(--default-box-shadow);

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

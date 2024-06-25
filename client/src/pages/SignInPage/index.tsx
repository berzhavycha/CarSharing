import { observer } from 'mobx-react-lite';
import { FC } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

import { CustomForm, ErrorMessage } from '@/components';
import { useStore } from '@/context';
import { AuthType, getUserSchema } from '@/helpers';
import { SignInUserDto } from '@/types';

import { ErrorMessageWrapper, Span, Title } from '../SignUpPage';

export const SignInPage: FC = observer(() => {
  const { currentUserStore } = useStore();

  const onSubmit = async (data: SignInUserDto): Promise<void> => {
    await currentUserStore.signIn(data);
  };

  return (
    <FormInner>
      <Title>Login</Title>
      <Span>
        Don't Have an Account?
        <Link to="/sign-up">Register here</Link> instead
      </Span>
      <ErrorMessageWrapper>
        <ErrorMessage>{currentUserStore.signInErrors?.unexpectedError ?? ''}</ErrorMessage>
      </ErrorMessageWrapper>
      <CustomForm<SignInUserDto>
        validationSchema={getUserSchema(AuthType.SIGN_IN, 'none')}
        onSubmit={onSubmit}
      >
        <FormBlocks>
          <CustomForm.Input
            label="Email"
            name="email"
            error={currentUserStore.signInErrors?.email}
          />
          <CustomForm.Input
            label="Password"
            name="password"
            error={currentUserStore.signInErrors?.password}
            isSecured
          />
        </FormBlocks>
        <CustomForm.SubmitButton content="Log In" />
      </CustomForm>
    </FormInner>
  );
});

const FormInner = styled.div`
  width: 400px;
  padding: 40px;
  position: absolute;
  border-radius: 10px;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: white;
  box-shadow: var(--default-box-shadow);
`;

const FormBlocks = styled.div`
  display: flex;
  flex-direction: column;
`;

import { FC, useState } from 'react';
import { Link } from 'react-router-dom';

import { AuthForm, ErrorMessage } from '@/components';
import { AuthType, getBaseSchema } from '@/helpers';
import { FieldErrorsState, UserDto } from '@/types';
import { useAuth } from '@/hooks';
import { ErrorMessageWrapper, Span, Title } from '../SignUpPage';
import styled from 'styled-components';

export const SignInPage: FC = () => {
  const [authError, setAuthErrors] = useState<FieldErrorsState<UserDto> | null>(null);
  const { auth } = useAuth(AuthType.SIGN_IN);

  const onSubmit = async (data: UserDto): Promise<void> => {
    const { user, errors } = await auth(data);
    console.log(errors, user)
    setAuthErrors(errors);
  };

  return (
    <FormInner>
      <Title>Login</Title>
      <Span>
        Don't Have an Account?
        <Link to="/sign-up">Register here</Link> instead
      </Span>
      <ErrorMessageWrapper>
        <ErrorMessage>{authError?.unexpectedError ?? ''}</ErrorMessage>
      </ErrorMessageWrapper>
      <AuthForm<UserDto>
        validationSchema={getBaseSchema(AuthType.SIGN_IN, 'none')}
        onSubmit={onSubmit}
      >
        <FormBlocks>
          <AuthForm.Input label="Email" name="email" error={authError?.email} />
          <AuthForm.Input label="Password" name="password" error={authError?.password} isSecured />
        </FormBlocks>
        <AuthForm.SubmitButton content="Log In" />
      </AuthForm>
    </FormInner>
  );
};


const FormInner = styled.div`
  width: 400px;
  padding: 40px;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: white;
`;

const FormBlocks = styled.div`
  display: flex;
  flex-direction: column;
`;
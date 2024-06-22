import { FC } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

import { AuthForm, ErrorMessage } from '@/components';
import { useCurrentUser } from '@/context';
import { AuthType, getBaseSchema } from '@/helpers';
import { useAuth } from '@/hooks';
import { UserDto } from '@/types';

import { ErrorMessageWrapper, Span, Title } from '../SignUpPage';

export const SignInPage: FC = () => {
  const { auth, errors } = useAuth(AuthType.SIGN_IN);
  const { setCurrentUser } = useCurrentUser();

  const onSubmit = async (data: UserDto): Promise<void> => {
    const { user } = await auth(data);
    setCurrentUser(user);
  };

  return (
    <FormInner>
      <Title>Login</Title>
      <Span>
        Don't Have an Account?
        <Link to="/sign-up">Register here</Link> instead
      </Span>
      <ErrorMessageWrapper>
        <ErrorMessage>{errors?.unexpectedError ?? ''}</ErrorMessage>
      </ErrorMessageWrapper>
      <AuthForm<UserDto>
        validationSchema={getBaseSchema(AuthType.SIGN_IN, 'none')}
        onSubmit={onSubmit}
      >
        <FormBlocks>
          <AuthForm.Input label="Email" name="email" error={errors?.email} />
          <AuthForm.Input label="Password" name="password" error={errors?.password} isSecured />
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

import { AuthType, regularUserSchema } from '@/helpers';
import { UserDto } from '@/types';

import { FC } from 'react';
import { FormInner, AuthForm, Container, FormBlocks, Span, Title } from '@/components/auth';
import { Link } from 'react-router-dom';

export const SignInPage: FC = () => {
  const onSubmit = (data: UserDto): void => {

    console.log('Form submitted:', data);
  };

  return (
    <Container>
      <FormInner>
        <Title>Login</Title>
        <Span>
          Don't Have an Account?
          <Link to="/sign-up">Register here</Link> instead
        </Span>
        <AuthForm<UserDto> validationSchema={regularUserSchema(AuthType.SIGN_IN)} onSubmit={onSubmit}>
          <FormBlocks>
            <AuthForm.Input label="Email" name='email' />
            <AuthForm.Input label="Password" name='password' isSecured />
          </FormBlocks>
          <AuthForm.SubmitButton content='Register' />
        </AuthForm>
      </FormInner>
    </Container>
  );
};


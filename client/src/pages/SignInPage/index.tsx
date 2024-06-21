import { FC } from 'react';
import { Link } from 'react-router-dom';

import { AuthForm, Container, FormBlocks, FormInner, Span, Title } from '@/components';
import { AuthType, getBaseSchema } from '@/helpers';
import { UserDto } from '@/types';

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
        <AuthForm<UserDto>
          validationSchema={getBaseSchema(AuthType.SIGN_IN, 'none')}
          onSubmit={onSubmit}
        >
          <FormBlocks>
            <AuthForm.Input label="Email" name="email" />
            <AuthForm.Input label="Password" name="password" isSecured />
          </FormBlocks>
          <AuthForm.SubmitButton content="Log In" />
        </AuthForm>
      </FormInner>
    </Container>
  );
};

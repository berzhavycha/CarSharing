import { FC } from 'react';
import { Link } from 'react-router-dom';

import { AuthForm, Container, FormBlocks, FormInner, Span, Title } from '@/components/auth';
import { AuthType } from '@/helpers';
import { UserDto } from '@/types';

import { regularUserSchema } from '../../helpers/validation/auth';

export const SignUpPage: FC = () => {
  const onSubmit = (data: UserDto): void => {
    console.log('Form submitted:', data);
  };

  return (
    <Container>
      <FormInner>
        <Title>Register</Title>
        <Span>
          Already have an account?
          <Link to="/sign-in">Login here</Link> instead
        </Span>
        <AuthForm<UserDto>
          validationSchema={regularUserSchema(AuthType.SIGN_UP)}
          onSubmit={onSubmit}
        >
          <FormBlocks>
            <AuthForm.Input label="First Name" name="firstName" />
            <AuthForm.Input label="Last Name" name="lastName" />
            <AuthForm.Input label="Email" name="email" />
            <AuthForm.Input label="Password" name="password" isSecured />
            <AuthForm.Input label="Confirm Password" name="confirmPassword" isSecured />
          </FormBlocks>
          <AuthForm.SubmitButton content="Register" />
        </AuthForm>
      </FormInner>
    </Container>
  );
};

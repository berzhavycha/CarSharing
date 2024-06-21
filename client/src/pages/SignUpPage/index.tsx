import { FC, useState } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { AuthForm, Container, FormInner, Span, Title } from '@/components/auth';
import { AuthType, userSchema } from '@/helpers';
import { UserDto } from '@/types';

export const SignUpPage: FC = () => {
  const [showSecretCodeInput, setShowSecretCodeInput] = useState<boolean>(false);

  const handleUserTypeChange = (event: React.ChangeEvent<HTMLSelectElement>): void => {
    setShowSecretCodeInput(event.target.value === 'admin');
  };

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
          validationSchema={userSchema(AuthType.SIGN_UP)}
          onSubmit={onSubmit}
        >
          <FormBlocks>
            <AuthForm.Input label="First Name" name="firstName" />
            <AuthForm.Input label="Last Name" name="lastName" />
            <AuthForm.Input label="Email" name="email" />
            <PasswordWrapper>
              <AuthForm.Input label="Password" name="password" isSecured />
              <AuthForm.Input label="Confirm Password" name="confirmPassword" isSecured />
            </PasswordWrapper>
            <RoleWrapper>
              <AuthForm.Select onChange={handleUserTypeChange} label="Role" name='role' options={[{ label: 'User', value: 'user' }, { label: 'Admin', value: 'admin' }]} />
              {showSecretCodeInput && (
                <AuthForm.Input label="Invitation Code" name="invitationCode" isSecured />
              )}
            </RoleWrapper>
          </FormBlocks>
          <AuthForm.SubmitButton content="Register" />
        </AuthForm>
      </FormInner>
    </Container>
  );
};

const FormBlocks = styled.div`
  margin-top: 40px;
  display: grid;
  gap: 10px 40px;
`;

const PasswordWrapper = styled.div`
  grid-column: span 3;
  display: grid;
  grid-template-columns: 2fr 2fr;
  gap: 10px 40px;
`;

const RoleWrapper = styled.div`
  grid-column: span 3;
  display: grid;
  grid-template-columns: 1fr 3fr;
  gap: 10px 40px;
`;


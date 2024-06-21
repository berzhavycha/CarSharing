import { FC, useState } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { AuthForm, Container, FormInner, Span, Title } from '@/components/auth';
import { AuthType } from '@/helpers';
import { UserDto } from '@/types';
import { regularUserSchema } from '../../helpers/validation/auth';

// Define styled components
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
  display: flex;
  align-items: center;
  gap: 10px;
  margin-top: 10px;
`;

const RoleLabel = styled.label`
  min-width: 100px;
  font-weight: bold;
`;

const RoleSelect = styled.select`
  flex: 1;
  padding: 8px;
  border-radius: 5px;
  border: 1px solid #ccc;
`;

// Inside SignUpPage component


export const SignUpPage: FC = () => {
  const [userType, setUserType] = useState('regular');
  const [showSecretCodeInput, setShowSecretCodeInput] = useState(false);

  const handleUserTypeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setUserType(event.target.value);
    setShowSecretCodeInput(event.target.value === 'admin');
  };

  const onSubmit = (data: UserDto): void => {
    console.log('Form submitted:', data);
    // Perform your submit logic here, including handling admin code if needed
    if (userType === 'admin') {
      // Check admin code logic here
      // Example: if (data.secretCode === 'youradmincode') { ... }
    }
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
            <PasswordWrapper>
              <AuthForm.Input label="Password" name="password" isSecured />
              <AuthForm.Input label="Confirm Password" name="confirmPassword" isSecured />
            </PasswordWrapper>
            <RoleWrapper>
              <RoleLabel>Role:</RoleLabel>
              <RoleSelect value={userType} onChange={handleUserTypeChange}>
                <option value="regular">Regular User</option>
                <option value="admin">Admin</option>
              </RoleSelect>
            </RoleWrapper>
            {showSecretCodeInput && (
              <RoleWrapper>
                <AuthForm.Input label="Invitation Code" name="invitationCode" isSecured />
              </RoleWrapper>
            )}
          </FormBlocks>
          <AuthForm.SubmitButton content="Register" />
        </AuthForm>
      </FormInner>
    </Container>
  );
};

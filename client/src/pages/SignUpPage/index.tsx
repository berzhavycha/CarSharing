import { FC, useState } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

import { AuthForm, ErrorMessage } from '@/components';
import { AuthType, getBaseSchema, Roles } from '@/helpers';
import { useAuth } from '@/hooks';
import { FieldErrorsState, UserDto } from '@/types';

export const SignUpPage: FC = () => {
  const [userRole, setUserRole] = useState<string>('user');
  const [showSecretCodeInput, setShowSecretCodeInput] = useState<boolean>(false);
  const [authError, setAuthErrors] = useState<FieldErrorsState<UserDto> | null>(null);
  const { auth } = useAuth(AuthType.SIGN_UP);

  const handleUserTypeChange = (event: React.ChangeEvent<HTMLSelectElement>): void => {
    setUserRole(event.target.value);
    setShowSecretCodeInput(event.target.value === Roles.ADMIN);
  };

  const onSubmit = async (data: UserDto): Promise<void> => {
    const { user, errors } = await auth({ ...data, role: userRole });
    setAuthErrors(errors);
  };

  return (
    <FormInner>
      <Title>Register</Title>
      <Span>
        Already have an account?
        <Link to="/sign-in">Login here</Link> instead
      </Span>
      <ErrorMessageWrapper>
        <ErrorMessage>{authError?.unexpectedError ?? ''}</ErrorMessage>
      </ErrorMessageWrapper>
      <AuthForm<UserDto>
        validationSchema={getBaseSchema(AuthType.SIGN_UP, userRole)}
        onSubmit={onSubmit}
      >
        <FormBlocks>
          <AuthForm.Input label="First Name" name="firstName" error={authError?.firstName} />
          <AuthForm.Input label="Last Name" name="lastName" error={authError?.lastName} />
          <AuthForm.Input label="Email" name="email" error={authError?.email} />
          <PasswordWrapper>
            <AuthForm.Input
              label="Password"
              name="password"
              isSecured
              error={authError?.password}
            />
            <AuthForm.Input
              label="Confirm Password"
              name="confirmPassword"
              isSecured
              error={authError?.confirmPassword}
            />
          </PasswordWrapper>
          <RoleWrapper>
            <AuthForm.Select
              onChange={handleUserTypeChange}
              label="Role"
              name="role"
              options={[
                { label: 'User', value: 'user' },
                { label: 'Admin', value: 'admin' },
              ]}
            />
            {showSecretCodeInput && (
              <AuthForm.Input
                label="Invitation Code"
                name="invitationCode"
                isSecured
                error={authError?.invitationCode}
              />
            )}
          </RoleWrapper>
        </FormBlocks>
        <AuthForm.SubmitButton content="Register" />
      </AuthForm>
    </FormInner>
  );
};

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

export const ErrorMessageWrapper = styled.div`
  margin: 20px 0;
`;

const FormInner = styled.div`
  width: 900px;
  padding: 40px;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: white;
`;

export const Title = styled.span`
  font-size: 24px;
  display: block;
  margin-bottom: 10px;
`;

export const Span = styled.span`
  font-size: 18px;
`;

const FormBlocks = styled.div`
  display: grid;
  gap: 10px 40px;
`;

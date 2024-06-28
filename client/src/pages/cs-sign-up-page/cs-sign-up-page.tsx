import { observer } from 'mobx-react-lite';
import { FC, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import styled from 'styled-components';

import { CSCommonErrorMessage, CSCommonForm } from '@/components';
import { useStore } from '@/context';
import { AuthType, getUserSchema, Roles } from '@/helpers';
import { SignUpUserDto } from '@/types';

export const CSSignUpPage: FC = observer(() => {
  const [userRole, setUserRole] = useState<string>('user');
  const [showSecretCodeInput, setShowSecretCodeInput] = useState<boolean>(false);
  const location = useLocation()
  const from = location.state?.from || '/';

  const navigate = useNavigate();

  const { currentUserStore } = useStore();

  const handleUserTypeChange = (event: React.ChangeEvent<HTMLSelectElement>): void => {
    const selectedRole = event.target.value;
    setUserRole(selectedRole);
    setShowSecretCodeInput(selectedRole === Roles.ADMIN);
  };

  const onSubmit = async (data: SignUpUserDto): Promise<void> => {
    await currentUserStore.signUp(data);
    if (currentUserStore.user) {
      const navigatePath = from || (currentUserStore.user.role === Roles.ADMIN ? '/dashboard' : '/')
      navigate(navigatePath);
    }
  };

  return (
    <FormInner>
      <Title>Register</Title>
      <Span>
        Already have an account?
        <Link to="/sign-in" state={{ from }}>Login here</Link> instead
      </Span>
      <ErrorMessageWrapper>
        <CSCommonErrorMessage>
          {currentUserStore.signUpErrors?.unexpectedError ?? ''}
        </CSCommonErrorMessage>
      </ErrorMessageWrapper>
      <CSCommonForm<SignUpUserDto>
        validationSchema={getUserSchema(AuthType.SIGN_UP, userRole)}
        onSubmit={onSubmit}
      >
        <FormBlocks>
          <CSCommonForm.Input
            label="First Name"
            name="firstName"
            error={currentUserStore.signUpErrors?.firstName}
          />
          <CSCommonForm.Input
            label="Last Name"
            name="lastName"
            error={currentUserStore.signUpErrors?.lastName}
          />
          <CSCommonForm.Input
            label="Email"
            name="email"
            error={currentUserStore.signUpErrors?.email}
          />
          <PasswordWrapper>
            <CSCommonForm.Input
              label="Password"
              name="password"
              isSecured
              error={currentUserStore.signUpErrors?.password}
            />
            <CSCommonForm.Input
              label="Confirm Password"
              name="confirmPassword"
              isSecured
              error={currentUserStore.signUpErrors?.confirmPassword}
            />
          </PasswordWrapper>
          <RoleWrapper>
            <CSCommonForm.Select
              onChange={handleUserTypeChange}
              label="Role"
              name="role"
              options={[
                { label: 'User', value: 'user' },
                { label: 'Admin', value: 'admin' },
              ]}
            />
            {showSecretCodeInput && (
              <CSCommonForm.Input
                label="Invitation Code"
                name="invitationCode"
                isSecured
                error={currentUserStore.signUpErrors?.invitationCode}
              />
            )}
          </RoleWrapper>
        </FormBlocks>
        <CSCommonForm.SubmitButton content="Register" />
      </CSCommonForm>
    </FormInner>
  );
});

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
  margin: 15px 0;
`;

const FormInner = styled.div`
  width: 900px;
  padding: 40px;
  position: absolute;
  border-radius: 10px;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: white;
  box-shadow: var(--default-box-shadow);
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
  gap: 0px 40px;
  margin-bottom: 30px;
`;

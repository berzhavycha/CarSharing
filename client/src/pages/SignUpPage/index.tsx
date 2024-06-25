import { FC, useState } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

import { CustomForm, ErrorMessage } from '@/components';
import { AuthType, getUserSchema, Roles } from '@/helpers';
import { SignUpUserDto } from '@/types';
import { useStore } from '@/context';
import { observer } from 'mobx-react-lite';

export const SignUpPage: FC = observer(() => {
  const [userRole, setUserRole] = useState<string>('user');
  const [showSecretCodeInput, setShowSecretCodeInput] = useState<boolean>(false);

  const { currentUserStore } = useStore()

  const handleUserTypeChange = (event: React.ChangeEvent<HTMLSelectElement>): void => {
    const selectedRole = event.target.value;
    setUserRole(selectedRole);
    setShowSecretCodeInput(selectedRole === Roles.ADMIN);
  };

  const onSubmit = async (data: SignUpUserDto): Promise<void> => {
    await currentUserStore.signUp(data)
  };

  return (
    <FormInner>
      <Title>Register</Title>
      <Span>
        Already have an account?
        <Link to="/sign-in">Login here</Link> instead
      </Span>
      <ErrorMessageWrapper>
        <ErrorMessage>{currentUserStore.signUpErrors?.unexpectedError ?? ''}</ErrorMessage>
      </ErrorMessageWrapper>
      <CustomForm<SignUpUserDto>
        validationSchema={getUserSchema(AuthType.SIGN_UP, userRole)}
        onSubmit={onSubmit}
      >
        <FormBlocks>
          <CustomForm.Input label="First Name" name="firstName" error={currentUserStore.signUpErrors?.firstName} />
          <CustomForm.Input label="Last Name" name="lastName" error={currentUserStore.signUpErrors?.lastName} />
          <CustomForm.Input label="Email" name="email" error={currentUserStore.signUpErrors?.email} />
          <PasswordWrapper>
            <CustomForm.Input label="Password" name="password" isSecured error={currentUserStore.signUpErrors?.password} />
            <CustomForm.Input
              label="Confirm Password"
              name="confirmPassword"
              isSecured
              error={currentUserStore.signUpErrors?.confirmPassword}
            />
          </PasswordWrapper>
          <RoleWrapper>
            <CustomForm.Select
              onChange={handleUserTypeChange}
              label="Role"
              name="role"
              options={[
                { label: 'User', value: 'user' },
                { label: 'Admin', value: 'admin' },
              ]}
            />
            {showSecretCodeInput && (
              <CustomForm.Input
                label="Invitation Code"
                name="invitationCode"
                isSecured
                error={currentUserStore.signUpErrors?.invitationCode}
              />
            )}
          </RoleWrapper>
        </FormBlocks>
        <CustomForm.SubmitButton content="Register" />
      </CustomForm>
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

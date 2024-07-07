import { observer } from 'mobx-react-lite';
import { FC } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styled from 'styled-components';

import { CSCommonErrorMessage, CSCommonForm } from '@/components';
import { useStore } from '@/context';
import { authCedirectPages, AuthType, getUserSchema, Roles } from '@/helpers';
import { SignUpUserDto } from '@/types';

import { useUserRole } from './hooks';
import { device } from '@/styles';

export const CSAuthSignUp: FC = observer(() => {
  const { userRole, handleUserTypeChange, showSecretCodeInput } = useUserRole();
  const navigate = useNavigate();

  const { currentUserStore } = useStore();

  const onSubmit = async (data: SignUpUserDto): Promise<void> => {
    await currentUserStore.signUp(data);
    if (currentUserStore.user) {
      navigate(authCedirectPages[currentUserStore.user.role as Roles]);
    }
  };

  return (
    <FormContainer>
      <FormInner>
        <Title>Register</Title>
        <Span>
          Already have an account?
          <Link to="/sign-in" >
            Login here
          </Link>{' '}
          instead
        </Span>
        <ErrorMessageWrapper>
          <CSCommonErrorMessage>
            {currentUserStore.errors?.signUp?.unexpectedError ?? ''}
          </CSCommonErrorMessage>
        </ErrorMessageWrapper>
        <CSCommonForm<SignUpUserDto>
          validationSchema={getUserSchema(AuthType.SIGN_UP, userRole)}
          onSubmit={onSubmit}
          showReset={false}
        >
          <FormBlocks>
            <CSCommonForm.Input
              label="First Name"
              name="firstName"
              error={currentUserStore.errors.signUp?.firstName}
            />
            <CSCommonForm.Input
              label="Last Name"
              name="lastName"
              error={currentUserStore.errors.signUp?.lastName}
            />
            <CSCommonForm.Input
              label="Email"
              name="email"
              error={currentUserStore.errors.signUp?.email}
            />
            <PasswordWrapper>
              <CSCommonForm.Input
                label="Password"
                name="password"
                isSecured
                error={currentUserStore.errors.signUp?.password}
              />
              <CSCommonForm.Input
                label="Confirm Password"
                name="confirmPassword"
                isSecured
                error={currentUserStore.errors.signUp?.confirmPassword}
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
                  error={currentUserStore.errors.signUp?.invitationCode}
                />
              )}
            </RoleWrapper>
          </FormBlocks>
          <CSCommonForm.SubmitButton content="Register" />
        </CSCommonForm>
      </FormInner>
    </FormContainer>
  );
});

const PasswordWrapper = styled.div`
  grid-column: span 3;
  display: grid;
  grid-template-columns: 2fr 2fr;
  gap: 10px 40px;

  @media ${device.md} {
    gap: 10px 30px;
  }

  @media ${device.sm} {
    display: flex;
    flex-direction: column;
  }
`;

const RoleWrapper = styled.div`
  grid-column: span 3;
  display: grid;
  grid-template-columns: 1fr 3fr;
  gap: 10px 40px;

  @media ${device.md} {
    grid-template-columns: 1fr 1fr;
    gap: 10px 30px;
  }

  @media ${device.sm} {
    display: flex;
    flex-direction: column;
  }
`;

export const ErrorMessageWrapper = styled.div`
  margin: 15px 0;
`;

const FormInner = styled.div`
  width: 70%;
  padding: 40px;
  border-radius: 10px;
  background-color: white;
  box-shadow: var(--default-box-shadow);

  @media ${device.lg} {
    width: 90%;
  }

  @media ${device.sm} {
    width: 80%;
  }
`;

const FormContainer = styled.div`
  width: 100%;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;

  @media ${device.sm} {
    min-height: 100vh;
    margin: 80px 0;
  }
`

export const Title = styled.span`
  font-size: 24px;
  display: block;
  margin-bottom: 10px;

  @media ${device.md} {
    font-size: 20px;
  }
`;

export const Span = styled.span`
  font-size: 18px;

  @media ${device.md} {
    font-size: 16px;
  }
`;

const FormBlocks = styled.div`
  display: grid;
  gap: 0px 40px;
  margin-bottom: 30px;

  @media ${device.md} {
    margin-bottom: 20px;
    gap: 0px 20px;
    display: flex;
    flex-direction: column;
  }
`;

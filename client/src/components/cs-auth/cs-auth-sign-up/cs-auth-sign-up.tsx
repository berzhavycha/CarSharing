import { observer } from 'mobx-react-lite';
import { FC, useState } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

import { BtnSpinner, CSCommonErrorMessage, CSCommonForm, CSCommonModal } from '@/components';
import { useStore } from '@/context';
import { AuthType, getUserSchema } from '@/helpers';
import { device } from '@/styles';
import { SignUpUserDto } from '@/types';

import { useUserRole } from './hooks';

export const CSAuthSignUp: FC = observer(() => {
  const { userRole, handleUserTypeChange, showSecretCodeInput } = useUserRole();

  const { currentUserStore } = useStore();

  const [isEmailConfirmationRequired, setIsEmailConfirmationRequired] = useState<boolean>(
    (currentUserStore.user && !currentUserStore.user.isEmailConfirmed) ?? false,
  );

  const onConfirmModalClose = (): void => setIsEmailConfirmationRequired(false);

  const onSubmit = async (data: SignUpUserDto): Promise<void> => {
    await currentUserStore.signUp(data);
    setIsEmailConfirmationRequired(true);
  };

  const btnContent = currentUserStore.isLoading ? <BtnSpinner /> : 'Sign Up';

  return (
    <>
      <SignUpFormContainer>
        <FormInner>
          <Title>Register</Title>
          <Span>
            Already have an account?
            <RedirectLink to="/sign-in">Sign In here</RedirectLink> instead
          </Span>
          <ErrorMessageWrapper>
            <CSCommonErrorMessage>
              {currentUserStore.errors?.signUp?.unexpectedError ?? ''}
            </CSCommonErrorMessage>
          </ErrorMessageWrapper>
          <CSCommonForm<SignUpUserDto>
            validationSchema={getUserSchema(AuthType.SIGN_UP, userRole)}
            onSubmit={onSubmit}
            shouldReset={false}
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
            <CSCommonForm.SubmitButton
              buttonContent={btnContent}
              disabled={currentUserStore.isLoading}
            />
          </CSCommonForm>
        </FormInner>
      </SignUpFormContainer>

      {isEmailConfirmationRequired && (
        <CSCommonModal
          type="warning"
          title="You need to confirm your email"
          message="We have sent you an email to confirm it. Please check your inbox."
          onClose={onConfirmModalClose}
          onOk={onConfirmModalClose}
        />
      )}
    </>
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

export const BaseFormInner = styled.div`
  padding: 40px;
  border-radius: 10px;
  background-color: white;
  box-shadow: var(--default-box-shadow);

  @media ${device.sm} {
    padding: 25px;
  }
`;

const FormInner = styled(BaseFormInner)`
  width: 70%;

  @media ${device.lg} {
    width: 90%;
  }

  @media ${device.sm} {
    width: 80%;
  }
`;

export const FormContainer = styled.div`
  width: 100%;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const SignUpFormContainer = styled(FormContainer)`
  @media ${device.sm} {
    min-height: 100vh;
    margin: 80px 0;
  }
`;

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

export const RedirectLink = styled(Link)`
  margin-left: 5px;
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

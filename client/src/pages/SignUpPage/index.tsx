import { FC, useState } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { AuthForm, Container, FormInner, Span, Title } from '@/components/auth';
import { AuthType, getBaseSchema } from '@/helpers';
import { UserDto } from '@/types';
import { useAuth } from '@/hooks';

export const SignUpPage: FC = () => {
  const [userRole, setUserRole] = useState<string>('user')
  const [showSecretCodeInput, setShowSecretCodeInput] = useState<boolean>(false);
  const [authError, setAuthErrors] = useState<{ [key: string]: string }>({});
  const { auth } = useAuth()

  const handleUserTypeChange = (event: React.ChangeEvent<HTMLSelectElement>): void => {
    setUserRole(event.target.value)
    setShowSecretCodeInput(event.target.value === 'admin');
  };

  const onSubmit = async (data: UserDto): Promise<void> => {
    const { user, errors } = await auth({ ...data, role: userRole })
    console.log(user, errors)
    setAuthErrors(errors)
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
          validationSchema={getBaseSchema(AuthType.SIGN_UP, userRole)}
          onSubmit={onSubmit}
        >
          <FormBlocks>
            <AuthForm.Input label="First Name" name="firstName" error={authError.firstName} />
            <AuthForm.Input label="Last Name" name="lastName" error={authError.lastName} />
            <AuthForm.Input label="Email" name="email" error={authError.email} />
            <PasswordWrapper>
              <AuthForm.Input label="Password" name="password" isSecured error={authError.password} />
              <AuthForm.Input label="Confirm Password" name="confirmPassword" isSecured error={authError.confirmPassword} />
            </PasswordWrapper>
            <RoleWrapper>
              <AuthForm.Select onChange={handleUserTypeChange} label="Role" name='role' options={[{ label: 'User', value: 'user' }, { label: 'Admin', value: 'admin' }]} />
              {showSecretCodeInput && (
                <AuthForm.Input label="Invitation Code" name="invitationCode" isSecured error={authError.invitationCodete} />
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


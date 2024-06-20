import { zodResolver } from '@hookform/resolvers/zod';
import { FC } from 'react';
import { useForm } from 'react-hook-form';
import styled from 'styled-components';

import { TextInput } from '@/components';
import { AuthType } from '@/helpers';
import { UserDto } from '@/types';

import { userSchema } from './validation';

export const SignUpPage: FC = () => {
  const {
    register,
    handleSubmit,
    formState: { isSubmitted, errors },
  } = useForm<UserDto>({
    mode: 'onSubmit',
    resolver: zodResolver(userSchema(AuthType.SIGN_UP)),
  });

  const onSubmit = (data: UserDto): void => {
    console.log('Form submitted:', data);
  };

  return (
    <Container>
      <FormInner>
        <form name="register" className="register" onSubmit={handleSubmit(onSubmit)}>
          <Title>Register</Title>
          <Span>
            Already have an account?
            <StyledLink href="#"> Login here</StyledLink> instead
          </Span>
          <FormBlocks>
            <TextInput
              {...register('firstName')}
              label="First Name"
              error={errors.firstName?.message ?? ''}
              formSubmitted={isSubmitted}
              autoComplete="off"
            />
            <TextInput
              {...register('lastName')}
              label="Last Name"
              error={errors.lastName?.message ?? ''}
              formSubmitted={isSubmitted}
              autoComplete="off"
            />
            <TextInput
              {...register('email')}
              label="Email"
              error={errors.email?.message ?? ''}
              formSubmitted={isSubmitted}
              autoComplete="off"
            />
            <TextInput
              {...register('password')}
              label="Password"
              error={errors.password?.message ?? ''}
              formSubmitted={isSubmitted}
              autoComplete="off"
              isSecured
            />
            <TextInput
              {...register('confirmPassword')}
              label="Confirm Password"
              error={errors.password?.message ?? ''}
              formSubmitted={isSubmitted}
              autoComplete="off"
              isSecured
            />
          </FormBlocks>
          <Button>Register</Button>
        </form>
      </FormInner>
    </Container>
  );
};

export const Container = styled.div`
  max-width: 1020px;
  margin: 0 auto;
  width: 100%;
`;

export const FormInner = styled.div`
  width: 400px;
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

export const FormBlocks = styled.div`
  margin-top: 20px;
`;

export const Button = styled.button`
  background-color: var(--main-blue);
  padding: 10px 20px;
  border: none;
  border-radius: 20px;
  color: white;
  width: 100%;
  cursor: pointer;
  transition: var(--default-transition);
  &:hover {
    background-color: var(--dark-blue);
  }
`;

export const StyledLink = styled.a`
  color: blue;
  text-decoration: none;
`;

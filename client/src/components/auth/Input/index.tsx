import { FC } from 'react';

import { InputProps, TextInput } from '@/components/common';

import { useAuthForm } from '../AuthForm';
import styled from 'styled-components';

type Props = Omit<InputProps, 'name'> & {
  name: string;
};

export const Input: FC<Props> = ({ name, label, error, ...props }) => {
  const {
    register,
    formState: { errors, isSubmitted },
  } = useAuthForm().formHandle;

  const errorMessage = errors[name]?.message as string;
  const errorText = errorMessage || error;

  return (
    <FormBlock>
      <TextInput
        {...props}
        {...register(name)}
        label={label}
        error={errorText}
        formSubmitted={isSubmitted}
        autoComplete="off"
      />
    </FormBlock>
  );
};

export const FormBlock = styled.div`
  margin-bottom: 20px;
  display: flex;
  flex-direction: column;
  position: relative;
`;
import { FC } from 'react';

import { InputProps, TextInput } from '@/components/common';

import { useAuthForm } from '../AuthForm';

type Props = Omit<InputProps, 'name'> & {
  name: string;
};

export const Input: FC<Props> = ({ name, label, ...props }) => {
  const {
    formHandle: {
      register,
      formState: { errors, isSubmitted },
    },
  } = useAuthForm();

  const errorMessage = errors[name]?.message;
  const errorText = typeof errorMessage === 'string' ? errorMessage : '';

  return (
    <TextInput
      {...props}
      {...register(name)}
      label={label}
      error={errorText}
      formSubmitted={isSubmitted}
      autoComplete="off"
    />
  );
};

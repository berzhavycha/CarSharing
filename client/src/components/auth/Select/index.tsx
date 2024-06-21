import { FC } from 'react';

import { SelectField, SelectProps } from '@/components/common/SelectField';

import { useAuthForm } from '../AuthForm';

type Props = Omit<SelectProps, 'name'> & {
  name: string;
};

export const Select: FC<Props> = ({ name, label, onChange, ...props }) => {
  const {
    formHandle: {
      register,
      formState: { errors },
    },
  } = useAuthForm();

  const errorMessage = errors[name]?.message;
  const errorText = typeof errorMessage === 'string' ? errorMessage : '';

  return (
    <SelectField
      {...props}
      {...register(name, {
        onChange,
      })}
      label={label}
      error={errorText}
      autoComplete="off"
    />
  );
};

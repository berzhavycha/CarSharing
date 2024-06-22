import { FC } from 'react';

import { SelectField, SelectProps } from '@/components/common';

import { useAuthForm } from '../AuthForm';
import { FormBlock } from '../Input';

type Props = Omit<SelectProps, 'name'> & {
  name: string;
};

export const Select: FC<Props> = ({ name, label, onChange, error, ...props }) => {
  const {
    formHandle: {
      register,
      formState: { errors },
    },
  } = useAuthForm();

  const errorMessage = errors[name]?.message as string;
  const errorText = errorMessage || error;


  return (
    <FormBlock>
      <SelectField
        {...props}
        {...register(name, {
          onChange,
        })}
        label={label}
        error={errorText}
        autoComplete="off"
      />
    </FormBlock>
  );
};

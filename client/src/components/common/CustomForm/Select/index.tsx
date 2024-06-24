import { FC } from 'react';

import { SelectField, SelectProps } from '@/components/common';

import { FormBlock } from '../Input';

import { useCustomForm } from '..';

type Props = Omit<SelectProps, 'name'> & {
  name: string;
};

export const Select: FC<Props> = ({ name, label, onChange, error, ...props }) => {
  const {
    register,
    formState: { errors },
  } = useCustomForm().formHandle;

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

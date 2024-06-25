import { FC } from 'react';
import styled from 'styled-components';

import { InputField, InputProps } from '@/components/common';

import { useCustomForm } from '..';

type Props = Omit<InputProps, 'name'> & {
  name: string;
};

export const Input: FC<Props> = ({ name, label, error, ...props }) => {
  const {
    register,
    formState: { errors, isSubmitted },
  } = useCustomForm().formHandle;

  const errorMessage = errors[name]?.message as string;
  const errorText = errorMessage || error;

  return (
    <FormBlock>
      <InputField
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
  margin-bottom: 5px;
  width: 100%;
  display: flex;
  flex-direction: column;
  position: relative;
`;

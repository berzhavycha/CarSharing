import { FC } from 'react';
import styled from 'styled-components';

import { CSCommonInputField, InputProps } from '@/components/cs-common';

import { useCommonForm } from './cs-common-form';

type Props = Omit<InputProps, 'name'> & {
  name: string;
};

export const CSCommonFormInput: FC<Props> = ({ name, label, error, onChange, ...props }) => {
  const {
    register,
    formState: { errors, isSubmitted },
  } = useCommonForm().formHandle;

  const errorMessage = errors[name]?.message as string;
  const errorText = errorMessage || error;

  return (
    <FormBlock>
      <CSCommonInputField
        {...props}
        {...register(name, {
          onChange,
        })}
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

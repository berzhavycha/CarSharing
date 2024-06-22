import React, { FC, forwardRef } from 'react';
import styled from 'styled-components';

import { ErrorMessage } from '../ErrorMessage';
import { Label } from '../InputField';

type Option = {
  value: string;
  label: string;
};

export interface SelectProps extends React.InputHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  isSecured?: boolean;
  formSubmitted?: boolean;
  options: Option[];
}

export const SelectField: FC<SelectProps> = forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, options, error, ...props }, ref) => {
    return (
      <>
        <Label>{label}</Label>
        <SelectElement ref={ref} {...props}>
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </SelectElement>
        <ErrorMessage>{error}</ErrorMessage>
      </>
    );
  },
);

const SelectElement = styled.select`
  width: 200px;
  padding: 8px;
  border-radius: 5px;
  outline: none;
  border: 1px solid #ccc;
`;

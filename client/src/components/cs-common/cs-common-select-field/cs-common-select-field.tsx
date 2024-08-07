import React, { FC, forwardRef } from 'react';
import styled from 'styled-components';

import { device } from '@/styles';

import { CSCommonCheckIcon } from '../cs-common-check-icon';
import { CSCommonErrorIcon } from '../cs-common-error-icon';
import { CSCommonErrorMessage } from '../cs-common-error-message';
import { Label } from '../cs-common-input-field';

export type Option = {
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

export const CSCommonSelectField: FC<SelectProps> = forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, options, formSubmitted, error, ...props }, ref) => {
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
        {formSubmitted &&
          (!error ? <CSCommonCheckIcon right={-25} /> : <CSCommonErrorIcon right={-25} />)}
        <CSCommonErrorMessage>{error}</CSCommonErrorMessage>
      </>
    );
  },
);

const SelectElement = styled.select`
  width: 100%;
  padding: 10px;
  border-radius: 5px;
  outline: none;
  border: var(--input-border);
  margin-top: 5px;

  @media ${device.md} {
    font-size: 14px;
    padding: 8px;
  }
`;

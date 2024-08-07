import { forwardRef, useState } from 'react';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import styled from 'styled-components';

import { device } from '@/styles';

import { CSCommonCheckIcon } from '../cs-common-check-icon';
import { CSCommonErrorIcon } from '../cs-common-error-icon';
import { CSCommonErrorMessage } from '../cs-common-error-message';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  isSecured?: boolean;
  formSubmitted?: boolean;
}

export const CSCommonInputField = forwardRef<HTMLInputElement, InputProps>(
  ({ placeholder, label, error, isSecured, formSubmitted, ...props }, ref) => {
    const [isPasswordShown, setIsPasswordShown] = useState<boolean>(Boolean(isSecured));

    const togglePasswordVisibility = (): void => {
      setIsPasswordShown((prevIsPasswordShown) => !prevIsPasswordShown);
    };

    const inputType = isPasswordShown ? 'password' : 'text';

    return (
      <InputGroup>
        <Label>{label}</Label>
        <Input
          ref={ref}
          type={inputType}
          placeholder={placeholder || `Enter ${label?.toLowerCase()}`}
          $isError={Boolean(error)}
          {...props}
        />
        {isSecured && (
          <TogglePasswordButton tabIndex={-1} type="button" onClick={togglePasswordVisibility}>
            {isPasswordShown ? <FaEyeSlash /> : <FaEye />}
          </TogglePasswordButton>
        )}
        {formSubmitted && !error && <CSCommonCheckIcon right={-25} />}
        {error && <CSCommonErrorIcon right={-25} />}
        <CSCommonErrorMessage>{error}</CSCommonErrorMessage>
      </InputGroup>
    );
  },
);

const TogglePasswordButton = styled.button`
  background: none;
  border: none;
  outline: none;
  cursor: pointer;
  font-size: 16px;
  padding-right: 10px;
  position: absolute;
  top: 50%;
  transform: translateY(-40%);
  right: 5px;
  color: #666;

  @media ${device.md} {
    top: 47%;
  }

  @media ${device.sm} {
    top: 50%;
  }
`;

const InputGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 5px;
  position: relative;
`;

export const Label = styled.label`
  font-size: 14px;
  color: #666;
  margin-bottom: 5px;

  @media ${device.md} {
    font-size: 12px;
  }
`;

const Input = styled.input<{ $isError: boolean }>`
  padding: 10px;
  border: var(--input-border);
  border-color: ${(props): string =>
    props.$isError ? 'var(--input-error-border-color)' : 'var(--input-default-border-color)'};
  border-radius: 5px;
  font-size: 16px;
  outline: none;

  @media ${device.md} {
    font-size: 14px;
    padding: 8px;
  }
`;

import { forwardRef, useState } from 'react';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import styled from 'styled-components';
import { CSCommonErrorMessage } from '../cs-common-error-message';
import { CSCommonCheckIcon } from '../cs-common-check-icon';
import { CSCommonErrorIcon } from '../cs-common-error-icon';

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
          {...props}
        />
        {isSecured && (
          <TogglePasswordButton tabIndex={-1} type="button" onClick={togglePasswordVisibility}>
            {isPasswordShown ? <FaEyeSlash /> : <FaEye />}
          </TogglePasswordButton>
        )}
        {formSubmitted && (!error ? <CSCommonCheckIcon right={-25} /> : <CSCommonErrorIcon right={-25} />)}
        <CSCommonErrorMessage>{error}</CSCommonErrorMessage>
      </InputGroup>
    );
  },
);
CSCommonInputField.displayName = 'CSCommonInputField';

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
`;

const Input = styled.input`
  padding: 10px;
  border: var(--input-border);
  border-radius: 5px;
  font-size: 16px;
  outline: none;
`;

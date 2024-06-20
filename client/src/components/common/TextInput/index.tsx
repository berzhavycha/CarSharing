import { forwardRef, useState } from 'react';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import styled from 'styled-components';

import { CheckIcon } from '../CheckIcon';
import { ErrorIcon } from '../ErrorIcon';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error: string;
  isSecured?: boolean;
  formSubmitted?: boolean;
}

export const TextInput = forwardRef<HTMLInputElement, InputProps>(
  ({ placeholder, label, error, isSecured, formSubmitted, ...props }, ref) => {
    const [isPasswordShown, setIsPasswordShown] = useState<boolean>(Boolean(isSecured));

    const togglePasswordVisibility = (): void => {
      setIsPasswordShown((prevIsPasswordShown) => !prevIsPasswordShown);
    };

    const inputType = isPasswordShown ? 'password' : 'text';

    return (
      <FormBlock>
        <Label>{label}</Label>
        <InputWrapper>
          <Input
            ref={ref}
            type={inputType}
            placeholder={placeholder || `Enter your ${label}`}
            {...props}
          />
          {isSecured && (
            <TogglePasswordButton type="button" onClick={togglePasswordVisibility}>
              {isPasswordShown ? <FaEyeSlash /> : <FaEye />}
            </TogglePasswordButton>
          )}
          {formSubmitted && (!error ? <CheckIcon /> : <ErrorIcon />)}
        </InputWrapper>
        <ErrorMessage>{error}</ErrorMessage>
      </FormBlock>
    );
  },
);
TextInput.displayName = 'TextInput';

const TogglePasswordButton = styled.button`
  background: none;
  border: none;
  outline: none;
  cursor: pointer;
  font-size: 16px;
  padding-right: 10px;
`;

export const FormBlock = styled.div`
  margin-bottom: 20px;
  display: flex;
  flex-direction: column;
  position: relative;
`;

export const Label = styled.label`
  margin-bottom: 5px;
`;

export const InputWrapper = styled.div`
  display: flex;
  align-items: center;
  border-bottom: 1px solid #000;
  position: relative;
`;

export const Input = styled.input`
  width: 100%;
  border: none;
  outline: none;
  padding: 10px;
  padding-right: 25px;
`;

export const ErrorMessage = styled.div`
  color: red;
  font-size: 12px;
  min-height: 18px;
  margin-top: 5px;
`;

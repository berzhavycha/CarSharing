import { forwardRef, useState } from 'react';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import styled from 'styled-components';

import { ErrorMessage } from '../ErrorMessage';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string;
    isSecured?: boolean;
}

export const InputField = forwardRef<HTMLInputElement, InputProps>(
    ({ placeholder, label, error, isSecured, ...props }, ref) => {
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
                    placeholder={placeholder || `Enter your ${label?.toLowerCase()}`}
                    {...props}
                />
                {isSecured && (
                    <TogglePasswordButton tabIndex={-1} type="button" onClick={togglePasswordVisibility}>
                        {isPasswordShown ? <FaEyeSlash /> : <FaEye />}
                    </TogglePasswordButton>
                )}
                <ErrorMessage>{error}</ErrorMessage>
            </InputGroup>
        );
    },
);
InputField.displayName = 'InputField';

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

const Label = styled.label`
    font-size: 14px;
    color: #666;
    margin-bottom: 5px;
`;

const Input = styled.input`
    padding: 10px;
    border: 1px solid #e0e0e0;
    border-radius: 5px;
    font-size: 16px;
    outline: none;
`;


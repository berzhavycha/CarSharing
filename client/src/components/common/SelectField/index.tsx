import React, { FC, forwardRef } from 'react';
import styled from 'styled-components';
import { Label } from '../TextInput';

type Option = {
    value: string;
    label: string;
}

export interface SelectProps extends React.InputHTMLAttributes<HTMLSelectElement> {
    label?: string;
    error?: string;
    isSecured?: boolean;
    formSubmitted?: boolean;
    options: Option[];
}

export const SelectField: FC<SelectProps> = forwardRef<HTMLSelectElement, SelectProps>(({ label, options, ...props }, ref) => {
    return (
        <RoleSelectWrapper>
            <Label>{label}</Label>
            <SelectElement ref={ref} {...props}>
                {options.map(option => (
                    <option key={option.value} value={option.value}>
                        {option.label}
                    </option>
                ))}
            </SelectElement>
        </RoleSelectWrapper>
    );
});


const RoleSelectWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  margin-top: 10px;
`;

const SelectElement = styled.select`
  flex: 1;
  padding: 8px;
  border-radius: 5px;
  border: 1px solid #ccc;
`;
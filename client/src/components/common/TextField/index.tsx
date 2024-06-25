import { forwardRef } from 'react';
import styled from 'styled-components';

import { CheckIcon } from '../CheckIcon';
import { ErrorIcon } from '../ErrorIcon';
import { ErrorMessage } from '../ErrorMessage';

export interface TextAreasProps extends React.InputHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  formSubmitted?: boolean;
}

export const TextField = forwardRef<HTMLTextAreaElement, TextAreasProps>(
  ({ placeholder, label, error, formSubmitted, ...props }, ref) => {
    return (
      <TextGroup>
        <Label>{label}</Label>
        <TextArea
          ref={ref}
          placeholder={placeholder || `Enter ${label?.toLowerCase()}`}
          {...props}
        />
        {formSubmitted && (!error ? <CheckIcon right={-25} /> : <ErrorIcon right={-25} />)}
        <ErrorMessage>{error}</ErrorMessage>
      </TextGroup>
    );
  },
);
TextField.displayName = 'TextField';

const TextGroup = styled.div`
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

const TextArea = styled.textarea`
  padding: 10px;
  border: var(--input-border);
  border-radius: 5px;
  font-size: 16px;
  outline: none;
  resize: none;
  min-height: 120px;
`;

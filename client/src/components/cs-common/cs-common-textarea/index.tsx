import { forwardRef } from 'react';
import styled from 'styled-components';
import { CSCommonErrorMessage } from '../cs-common-error-message';
import { CSCommonCheckIcon } from '../cs-common-check-icon';
import { CSCommonErrorIcon } from '../cs-common-error-icon';

export interface TextAreasProps extends React.InputHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  formSubmitted?: boolean;
}

export const CSCommonTextArea = forwardRef<HTMLTextAreaElement, TextAreasProps>(
  ({ placeholder, label, error, formSubmitted, ...props }, ref) => {
    return (
      <TextGroup>
        <Label>{label}</Label>
        <TextArea
          ref={ref}
          placeholder={placeholder || `Enter ${label?.toLowerCase()}`}
          {...props}
        />
        {formSubmitted && (!error ? <CSCommonCheckIcon right={-25} /> : <CSCommonErrorIcon right={-25} />)}
        <CSCommonErrorMessage>{error}</CSCommonErrorMessage>
      </TextGroup>
    );
  },
);
CSCommonTextArea.displayName = 'CSCommonTextArea';

const TextGroup = styled.div`
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

const TextArea = styled.textarea`
  padding: 10px;
  border: var(--input-border);
  border-radius: 5px;
  font-size: 16px;
  outline: none;
  resize: none;
  min-height: 120px;
`;

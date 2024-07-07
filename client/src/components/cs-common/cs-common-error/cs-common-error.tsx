import { FC } from 'react';
import { FaExclamationCircle } from 'react-icons/fa';
import styled from 'styled-components';

type Props = {
  errorMessage: string;
};

export const CSCommonError: FC<Props> = ({ errorMessage }) => {
  return (
    <ErrorContainer>
      <ErrorIcon>
        <FaExclamationCircle />
      </ErrorIcon>
      <span>{errorMessage}</span>
    </ErrorContainer>
  );
};

const ErrorContainer = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  padding: 8px;
  background-color: var(--red-status-bg);
  border: 1px solid var(--red-status-border);
  color: var(--red-status-text);
  border-radius: 4px;
`;

const ErrorIcon = styled.div`
  margin-right: 8px;
`;

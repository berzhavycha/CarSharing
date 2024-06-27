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
  display: flex;
  align-items: center;
  padding: 8px;
  background-color: #f8d7da;
  border: 1px solid #f5c6cb;
  color: #721c24;
  border-radius: 4px;
`;

const ErrorIcon = styled.div`
  margin-right: 8px;
`;

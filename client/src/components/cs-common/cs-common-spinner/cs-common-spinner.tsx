import { FC } from 'react';
import styled, { keyframes } from 'styled-components';

export const CSCommonSpinner: FC = () => {
  return (
    <Spinner />
  );
};

const spinAnimation = keyframes`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
`;

export const Spinner = styled.div`
  width: 80px;
  height: 80px;
  border: 3px solid var(--main-blue);
  border-radius: 50%;
  border-top-color: var(--gray);
  animation: ${spinAnimation} 1s ease-in-out infinite;
`;

export const BtnSpinner = styled(Spinner)`
  width: 20px;
  height: 20px;
  margin: 0 8px;
  border-color: var(--light-blue);
  border-top-color: white;
`;

import { FC } from 'react';
import styled from 'styled-components';

import { CSCommonSpinner } from '@/components/cs-common';

export const CSMainAvailableCarsSpinner: FC = () => {
  return (
    <SpinnerWrapper>
      <CSCommonSpinner />
    </SpinnerWrapper>
  );
};

const SpinnerWrapper = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
`;

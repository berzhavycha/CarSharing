import styled from 'styled-components';

import { device } from '@/styles';

export const CSCommonErrorMessage = styled.div`
  color: red;
  font-size: 12px;
  min-height: 18px;
  margin: 2px 0 5px;

  @media ${device.sm} {
    font-size: 10px;
    min-height: 14px;
  }
`;

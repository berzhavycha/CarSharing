import styled from 'styled-components';

import { device } from '@/styles';

export const BaseSection = styled.div`
  width: 100%;
  background-color: white;
  border-radius: 20px;
  padding: 35px;
  box-shadow: var(--default-box-shadow);
`;

export const SectionTitle = styled.h3`
  color: var(--dark);
  margin-bottom: 10px;

  @media ${device.sm} {
    font-size: 16px;
  }
`;

export const SectionDescription = styled.p`
  color: var(--dark);
  font-size: 14px;
  font-weight: 300;
  margin-bottom: 30px;

  @media ${device.sm} {
    font-size: 12px;
  }
`;

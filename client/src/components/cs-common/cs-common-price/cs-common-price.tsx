import { FC } from 'react';
import styled from 'styled-components';

import { device } from '@/styles';

type Props = {
  amount: number;
  metric: 'day' | 'hour';
};

export const CSCommonPrice: FC<Props> = ({ amount, metric }) => {
  return (
    <PriceWrapper>
      ${amount}
      <Metric> / {metric}</Metric>
    </PriceWrapper>
  );
};

const PriceWrapper = styled.span`
  font-size: 20px;
  font-weight: bold;
  color: var(--dark);

  @media ${device.xs} {
    font-size: 16px;
  }
`;

const Metric = styled.span`
  font-size: 14px;
  font-weight: normal;
  color: var(--gray);

  @media ${device.xs} {
    font-size: 12px;
  }
`;

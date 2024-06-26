import { FC } from 'react';
import styled from 'styled-components';

type Props = {
  amount: number;
  metric: 'days' | 'hours';
};

export const CSCommonPrice: FC<Props> = ({ amount, metric }) => {
  return (
    <PriceWrapper>
      ${amount}.00<Metric> / {metric}</Metric>
    </PriceWrapper>
  );
};

const PriceWrapper = styled.span`
  font-size: 20px;
  font-weight: bold;
  color: var(--dark);
`;

const Metric = styled.span`
  font-size: 14px;
  font-weight: normal;
  color: var(--gray);
`;

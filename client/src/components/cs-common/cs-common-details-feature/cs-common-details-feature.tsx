import { FC } from 'react';
import styled from 'styled-components';

import { device } from '@/styles';

type Props = {
  label: string;
  text?: string | number;
  component?: JSX.Element;
};

export const CSCommonDetailsFeature: FC<Props> = ({ label, text, component }) => {
  return (
    <FeatureWrapper>
      <FeatureLabel>{label}:</FeatureLabel>
      {text && <FeatureText>{text}</FeatureText>}
      {component}
    </FeatureWrapper>
  );
};

const FeatureWrapper = styled.div`
  display: flex;
  align-items: center;
  width: 48%;
  gap: 10px;

  @media ${device.sm} {
    width: 100%;
  }

  @media ${device.xs} {
    font-size: 14px;
  }
`;

const FeatureLabel = styled.p`
  font-weight: 300;
  color: var(--gray);
`;

const FeatureText = styled.p`
  font-weight: 700;
  color: var(--dark);
`;

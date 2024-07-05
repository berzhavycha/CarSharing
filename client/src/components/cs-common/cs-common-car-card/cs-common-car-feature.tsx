import { FC } from 'react';
import styled from 'styled-components';

type Props = {
  icon: JSX.Element;
  text: string;
};

export const CarFeature: FC<Props> = ({ icon, text }) => (
  <FeatureWrapper>
    <IconWrapper>{icon}</IconWrapper>
    <FeatureText>{text}</FeatureText>
  </FeatureWrapper>
);

const FeatureWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const IconWrapper = styled.div`
  background-color: var(--main-bg-color);
  border-radius: 50%;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 8px;

  svg {
    font-size: 18px;
    color: var(--gray);
  }
`;

const FeatureText = styled.span`
  font-size: 14px;
  color: var(--gray);
  font-weight: 500;
  text-align: center;
`;

import { FC } from 'react';
import styled from 'styled-components';

type Props = {
    label: string;
    text?: string | number;
    component?: JSX.Element
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
  width: 48%;
  gap: 10px;
`;

const FeatureLabel = styled.p`
  font-weight: 300;
  color: var(--gray);
`;

const FeatureText = styled.p`
  font-weight: 700;
  color: var(--dark);
`;

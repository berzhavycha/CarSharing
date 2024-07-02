import { FC } from "react";
import styled from "styled-components";

type Props = {
    label: string;
    text: string | number;
}

export const CSMainSingleCarFeature: FC<Props> = ({ label, text }) => {
    return (
        <CarFeatureWrapper>
            <CarFeatureLabel>{label}:</CarFeatureLabel>
            <CarFeatureText>{text}</CarFeatureText>
        </CarFeatureWrapper>
    )
}

const CarFeatureWrapper = styled.div`
    display: flex;
    width: 48%;
    gap: 10px;
`

const CarFeatureLabel = styled.p`
  font-weight: 300;
  color: var(--gray);
`

const CarFeatureText = styled.p`
 font-weight: 700;
  color: var(--dark);
`
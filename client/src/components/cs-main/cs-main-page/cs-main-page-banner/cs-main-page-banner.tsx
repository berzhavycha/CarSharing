import { CSCommonPrimaryButton } from "@/components/cs-common";
import { FC } from "react";
import styled from "styled-components";

type Props = {
    title: string;
    description: string;
    backgroundImage: string;
    carImage: string;
    buttonType: 'main' | 'light'
}

export const CSMainPageBanner: FC<Props> = ({ title, description, backgroundImage, carImage, buttonType }) => {
    return (
        <BannerWrapper $backgroundImage={backgroundImage}>
            <Title>{title}</Title>
            <Description>{description}</Description>
            <CSCommonPrimaryButton onClick={() => console.log('wow')} content="Rent Car" style={buttonType} />
            <CarImage src={carImage} />
        </BannerWrapper>
    )
}

type BannerWrapperProps = {
    $backgroundImage: string;
}

const BannerWrapper = styled.div<BannerWrapperProps>`
    position: relative;
    padding: 30px 10px 10px 30px;
    width: 48.5%;
    height: 300px;
    border-radius: 20px;
    background-image: ${(props): string => `url(${props.$backgroundImage})`}
`;

const Title = styled.h1`
    color: white;
    width: 50%;
    margin-bottom: 20px;
`

const Description = styled.p`
    color: white;
    width: 50%;
    font-weight: 200;
    margin-bottom: 20px;
`

const CarImage = styled.img`
    width: 50%;
    height: auto;
    position: absolute;
    bottom: 20px;
    right: 10%;
`



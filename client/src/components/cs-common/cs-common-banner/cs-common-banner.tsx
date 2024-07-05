import { FC } from 'react';
import styled from 'styled-components';

import { CSCommonPrimaryButton } from '@/components/cs-common';
import { Link } from 'react-router-dom';

type Props = {
  title: string;
  description: string;
  backgroundImage: string;
  image: string;
  buttonType?: 'main' | 'light';
  linkContent: string;
  onLinkRedirect: string;
};

export const CSCommonBanner: FC<Props> = ({
  title,
  description,
  backgroundImage,
  image,
  buttonType,
  linkContent,
  onLinkRedirect
}) => {
  return (
    <BannerWrapper $backgroundImage={backgroundImage}>
      <Title>{title}</Title>
      <Description>{description}</Description>
      {linkContent && (
        <CSCommonPrimaryButton as={Link} to={onLinkRedirect} content={linkContent} style={buttonType} />
      )}
      <Image src={image} />
    </BannerWrapper>
  );
};

type BannerWrapperProps = {
  $backgroundImage: string;
};

const BannerWrapper = styled.div<BannerWrapperProps>`
  position: relative;
  padding: 30px 10px 10px 30px;
  width: 48.5%;
  min-height: 320px;
  border-radius: 20px;
  background-image: ${(props): string => `url(${props.$backgroundImage})`};
`;

const Title = styled.h1`
  color: white;
  width: 50%;
  margin-bottom: 20px;
`;

const Description = styled.p`
  color: white;
  width: 50%;
  font-weight: 200;
  margin-bottom: 20px;
`;

const Image = styled.img`
  width: 50%;
  height: auto;
  position: absolute;
  bottom: 20px;
  right: 7%;
`;

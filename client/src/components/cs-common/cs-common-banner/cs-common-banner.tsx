import { FC } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

import { Button } from '@/components/cs-common';
import { device } from '@/styles';

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
  linkContent,
  onLinkRedirect,
  buttonType = 'main',
}) => {
  return (
    <BannerWrapper $backgroundImage={backgroundImage}>
      <Title>{title}</Title>
      <Description>{description}</Description>
      {linkContent && (
        <ResponsivePrimaryButton as={Link} to={onLinkRedirect} $style={buttonType}>
          {linkContent}
        </ResponsivePrimaryButton>
      )}
      <Image src={image} />
    </BannerWrapper>
  );
};

type BannerWrapperProps = {
  $backgroundImage: string;
};

const ResponsivePrimaryButton = styled(Button)`
  position: absolute;
  left: 30px;
  bottom: 30px;

  @media ${device.lg} {
    font-size: 14px;
    padding: 6px 12px;
  }

  @media ${device.md} {
    font-size: 12px;
    padding: 5px 10px;
    left: 20px;
    bottom: 20px;
  }

  @media ${device.sm} {
    font-size: 16px;
    padding: 8px 14px;
  }

  @media ${device.xs} {
    font-size: 12px;
    padding: 5px 10px;
    left: 20px;
    bottom: 20px;
  }
`;

const BannerWrapper = styled.div<BannerWrapperProps>`
  position: relative;
  padding: 30px 10px 10px 30px;
  width: 50%;
  min-height: 320px;
  height: auto;
  border-radius: 20px;
  background-image: ${(props): string => `url(${props.$backgroundImage})`};

  @media ${device.lg} {
    padding: 25px 10px 25px 25px;
    min-height: 280px;
  }

  @media ${device.md} {
    padding: 20px 8px 20px 20px;
    min-height: 200px;
  }

  @media ${device.sm} {
    width: 100%;
  }

  @media ${device.xs} {
    min-height: 200px;
  }
`;

const Title = styled.h1`
  color: white;
  width: 50%;
  margin-bottom: 20px;

  @media ${device.lg} {
    font-size: 30px;
    width: 70%;
  }

  @media ${device.md} {
    font-size: 20px;
    width: 100%;
  }
`;

const Description = styled.p`
  color: white;
  width: 50%;
  font-weight: 200;
  margin-bottom: 20px;

  @media ${device.lg} {
    font-size: 15px;
    margin-bottom: 30px;
  }

  @media ${device.md} {
    font-size: 12px;
    width: 100%;
    margin-bottom: 30px;
  }
`;

const Image = styled.img`
  width: 50%;
  height: auto;
  position: absolute;
  bottom: 20px;
  right: 7%;
`;

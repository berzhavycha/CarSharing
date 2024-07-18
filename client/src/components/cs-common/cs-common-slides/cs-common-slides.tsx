import { AdvancedImage, lazyload, placeholder, responsive } from '@cloudinary/react';
import { CloudinaryImage } from '@cloudinary/url-gen/index';
import { Quality } from '@cloudinary/url-gen/qualifiers';
import { FC, useState } from 'react';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import styled from 'styled-components';

import { cld } from '@/app/cloudinary';

type Props = {
  publicIds: string[];
  width?: string;
  height?: string;
};

export const CSCommonSlides: FC<Props> = ({ publicIds, width = '100%', height = '200px' }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const goToPrevious = (): void => {
    setCurrentIndex((prevIndex) => (prevIndex === 0 ? publicIds.length - 1 : prevIndex - 1));
  };

  const goToNext = (): void => {
    setCurrentIndex((prevIndex) => (prevIndex === publicIds.length - 1 ? 0 : prevIndex + 1));
  };

  const goToSlide = (slideIndex: number): void => {
    setCurrentIndex(slideIndex);
  };

  const getCloudinaryImage = (publicId: string): CloudinaryImage => {
    return cld.image(publicId).quality(Quality.auto());
  };

  return (
    <div>
      <SlideShowContainer width={width} height={height}>
        <SlideImage
          cldImg={getCloudinaryImage(publicIds[currentIndex])}
          plugins={[lazyload(), responsive(), placeholder()]}
          alt={`Slide ${currentIndex}`}
        />
        <PrevButton onClick={goToPrevious}>
          <FaChevronLeft />
        </PrevButton>
        <NextButton onClick={goToNext}>
          <FaChevronRight />
        </NextButton>
      </SlideShowContainer>
      <ThumbnailContainer>
        {publicIds.map((publicId, index) => (
          <ThumbnailWrapper
            key={index}
            $active={index === currentIndex}
            onClick={() => goToSlide(index)}
          >
            <AdvancedImage
              cldImg={getCloudinaryImage(publicId)}
              plugins={[lazyload(), placeholder()]}
              alt={`Thumbnail ${index}`}
            />
          </ThumbnailWrapper>
        ))}
      </ThumbnailContainer>
    </div>
  );
};

const SlideShowContainer = styled.div<{ width: string; height: string }>`
  position: relative;
  width: ${({ width }): string => width};
  height: ${({ height }): string => height};
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
`;

const SlideImage = styled(AdvancedImage)`
  width: 100%;
  height: 100%;
  object-fit: contain;
  border-radius: 10px;
`;

const NavButton = styled.button`
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  background: rgba(0, 0, 0, 0.5);
  color: white;
  border: none;
  padding: 10px;
  cursor: pointer;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.3s;

  &:hover {
    background: rgba(0, 0, 0, 0.8);
  }
`;

const PrevButton = styled(NavButton)`
  left: 10px;
`;

const NextButton = styled(NavButton)`
  right: 10px;
`;

const ThumbnailWrapper = styled.div<{ $active: boolean }>`
  width: 50px;
  height: 50px;
  margin: 0 5px;
  opacity: ${({ $active }): number => ($active ? 1 : 0.6)};
  cursor: pointer;
  border-radius: 5px;
  box-shadow: ${({ $active }): string => ($active ? '0 0 5px rgba(0, 0, 0, 0.5)' : 'none')};
  transition:
    opacity 0.3s,
    box-shadow 0.3s;

  &:hover {
    opacity: 1;
  }

  img {
    width: 100%;
    height: 100%;
    object-fit: contain;
    border-radius: 5px;
  }
`;

const ThumbnailContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 10px;
`;

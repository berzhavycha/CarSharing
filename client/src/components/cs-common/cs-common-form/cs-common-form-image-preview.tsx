import { AdvancedImage, lazyload, placeholder } from '@cloudinary/react';
import { Resize } from '@cloudinary/url-gen/actions';
import { Quality } from '@cloudinary/url-gen/qualifiers';
import { FC } from 'react';
import styled from 'styled-components';

import { cld } from '@/app/cloudinary';
import { device } from '@/styles';

import { Spinner } from '../cs-common-spinner';

type PictureWrapperProps = {
  $circled?: boolean;
  $width: number;
  $height: number;
};

type ImagePreviewProps = {
  src: string;
  publicId?: string;
  alt: string;
  circled?: boolean;
  width?: number;
  height?: number;
  onRemove?: () => void;
  onClick?: () => void;
  isPending?: boolean;
  isRemovable?: boolean;
};

export const CSCommonFormImagePreview: FC<ImagePreviewProps> = ({
  src,
  publicId,
  alt,
  circled,
  width = 100,
  height = 100,
  onRemove,
  onClick,
  isRemovable = true,
  isPending = false,
}) => {
  const onRemoveClick = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>): void => {
    e.stopPropagation();
    onRemove?.();
  };

  const cloudinaryImage = publicId
    ? cld.image(publicId).resize(Resize.fit().width(width).height(height)).quality(Quality.auto())
    : null;

  return (
    <PictureWrapper onClick={onClick} $circled={circled} $width={width} $height={height}>
      {isPending ? (
        <SpinnerWrapper $width={width} $height={height}>
          <Spinner />
        </SpinnerWrapper>
      ) : cloudinaryImage ? (
        <StyledAdvancedImage
          cldImg={cloudinaryImage}
          plugins={[lazyload(), placeholder({ mode: 'blur' })]}
          alt={alt}
        />
      ) : (
        <img src={src} alt={alt} />
      )}
      {isRemovable && (
        <RemoveButton type="button" onClick={onRemoveClick}>
          &times;
        </RemoveButton>
      )}
    </PictureWrapper>
  );
};

const SpinnerWrapper = styled.div<PictureWrapperProps>`
  display: flex;
  justify-content: center;
  align-items: center;
  width: ${(props): string => `${props.$width}`}px;
  height: ${(props): string => `${props.$height}`}px;

  @media ${device.md} {
    width: ${(props): string => `${props.$width - 20}`}px;
    height: ${(props): string => `${props.$height - 20}`}px;
  }
`;

const PictureWrapper = styled.div<PictureWrapperProps>`
  position: relative;
  border: var(--default-border);
  border-radius: ${(props): string => `${props.$circled ? '50%' : '10%'}`};
  overflow: hidden;
  background: none;
  outline: none;
  cursor: pointer;

  img {
    width: ${(props): string => `${props.$width}`}px;
    height: ${(props): string => `${props.$height}`}px;
    object-fit: contain;
  }

  @media ${device.md} {
    img {
      width: ${(props): string => `${props.$width - 20}`}px;
      height: ${(props): string => `${props.$height - 20}`}px;
    }
  }
`;

const StyledAdvancedImage = styled(AdvancedImage)`
  width: 100%;
  height: 100%;
  object-fit: contain;
`;

const RemoveButton = styled.button`
  position: absolute;
  top: 5px;
  right: 5px;
  background: rgba(0, 0, 0, 0.5);
  color: white;
  border: none;
  border-radius: 50%;
  width: 18px;
  height: 18px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
`;

import { FC } from 'react';
import styled from 'styled-components';

type PictureWrapperProps = {
    $circled?: boolean;
    $width?: number;
    $height?: number;
};

type ImagePreviewProps = {
    src: string;
    alt: string;
    circled?: boolean;
    width?: number;
    height?: number;
    onRemove?: () => void;
    onClick?: () => void;
    isRemovable?: boolean;
};

export const CSCommonFormImagePreview: FC<ImagePreviewProps> = ({
    src,
    alt,
    circled,
    width,
    height,
    onRemove,
    onClick,
    isRemovable = true,
}) => (
    <PictureWrapper
        onClick={onClick}
        $circled={circled}
        $width={width}
        $height={height}
    >
        <img src={src} alt={alt} />
        {isRemovable && (
            <RemoveButton
                type="button"
                onClick={(e) => {
                    e.stopPropagation();
                    onRemove?.();
                }}
            >
                &times;
            </RemoveButton>
        )}
    </PictureWrapper>
);

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
    object-fit: cover;
  }
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


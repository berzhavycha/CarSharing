import { ChangeEvent, FC, useRef, useState } from 'react';
import styled from 'styled-components';

import { InputProps } from '@/components/common';

import { useCustomForm } from '..';

type Props = Omit<InputProps, 'name'> & {
  name: string;
  defaultImage: string;
  circled?: boolean;
  width?: number;
  height?: number;
};

export const InputImage: FC<Props> = ({ defaultImage, label, circled, name, width, height, ...props }) => {
  const { register } = useCustomForm().formHandle;

  const hiddenInputRef = useRef<HTMLInputElement | null>(null);
  const [preview, setPreview] = useState<string>(defaultImage);

  const { ref: registerRef, onChange, ...rest } = register(name);

  const handleUploadedFile = (event: ChangeEvent<HTMLInputElement>): void => {
    const file = event.target.files?.[0];
    if (file) {
      const urlImage = URL.createObjectURL(file);
      setPreview(urlImage);
    }
  };

  const onUpload = (): void => {
    hiddenInputRef.current?.click();
  };

  const onFileChange = (e: ChangeEvent<HTMLInputElement>): void => {
    onChange(e);
    handleUploadedFile(e);
  };

  return (
    <PictureWrapper onClick={onUpload} $circled={circled} $width={width} $height={height}>
      <img src={preview} alt={name} />
      <UpdatePicture type="button">{label}</UpdatePicture>
      <input
        type="file"
        {...rest}
        onChange={onFileChange}
        ref={(e) => {
          registerRef(e);
          hiddenInputRef.current = e;
        }}
        {...props}
        hidden
      />
    </PictureWrapper>
  );
};

type PictureWrapperProps = {
  $circled?: boolean;
  $width?: number;
  $height?: number
};

const PictureWrapper = styled.div<PictureWrapperProps>`
  position: relative;
  margin-right: 20px;
  border: none;
  background: none;
  outline: none;
  cursor: pointer;

  img {
    width: ${(props): string => `${props.$width ?? 100}`}px;
    height: ${(props): string => `${props.$height ?? 100}`}px;
    border-radius: ${(props): string => `${props.$circled ? '50%' : '10%'}`};
    object-fit: cover;
  }
`;

const UpdatePicture = styled.button`
  width: 100%;
  position: absolute;
  bottom: -20px;
  cursor: pointer;
  left: 50%;
  transform: translateX(-50%);
  font-size: 12px;
  color: #007bff;
  border: none;
  background: none;
  outline: none;
`;

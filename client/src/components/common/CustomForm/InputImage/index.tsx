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
  multiple?: boolean;
};

export const InputImage: FC<Props> = ({
  defaultImage,
  label,
  circled,
  name,
  width = 100,
  height = 100,
  multiple = false,
  ...props
}) => {
  const { register } = useCustomForm().formHandle;

  const hiddenInputRef = useRef<HTMLInputElement | null>(null);
  const [previews, setPreviews] = useState<string[]>([defaultImage]);

  const { ref: registerRef, onChange, ...rest } = register(name);

  const handleUploadedFiles = (event: ChangeEvent<HTMLInputElement>): void => {
    const files = Array.from(event.target.files || []);
    const previewUrls = files.map(file => URL.createObjectURL(file));
    setPreviews(previewUrls);
  };

  const onUpload = (): void => {
    hiddenInputRef.current?.click();
  };

  const onFileChange = (e: ChangeEvent<HTMLInputElement>): void => {
    onChange(e);
    handleUploadedFiles(e);
  };

  return (
    <div>
      <PicturesContainer onClick={onUpload}>
        {previews.map((preview, index) => (
          <PictureWrapper
            key={index}
            $circled={circled}
            $width={width}
            $height={height}
          >
            <img src={preview} alt={`${name}-${index}`} />
          </PictureWrapper>
        ))}
      </PicturesContainer>
      <UpdatePicture type="button" onClick={onUpload}>
        {label}
      </UpdatePicture>
      <input
        type="file"
        multiple={multiple}
        {...rest}
        onChange={onFileChange}
        ref={(e) => {
          registerRef(e);
          hiddenInputRef.current = e;
        }}
        {...props}
        hidden
      />
    </div>
  );
};

type PictureWrapperProps = {
  $circled?: boolean;
  $width?: number;
  $height?: number;
};

const PicturesContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
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
    object-fit: cover;
  }
`;

const UpdatePicture = styled.button`
  width: 100%;
  position: relative;
  cursor: pointer;
  font-size: 12px;
  color: #007bff;
  border: none;
  background: none;
  outline: none;
  margin-top: 10px;
  text-align: center;
`;

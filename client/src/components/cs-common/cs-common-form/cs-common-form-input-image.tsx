import { ChangeEvent, FC, useRef, useState } from 'react';
import styled from 'styled-components';

import { CSCommonErrorMessage, InputProps } from '@/components/cs-common';

import { useCommonForm } from './cs-common-form';

type Props = Omit<InputProps, 'name'> & {
  name: string;
  defaultImage: string;
  actualImages?: string[];
  onRemove?: (image: string) => Promise<void> | void;
  circled?: boolean;
  width?: number;
  height?: number;
  multiple?: boolean;
};

export const CSCommonFormInputImage: FC<Props> = ({
  defaultImage,
  actualImages,
  label,
  circled,
  onRemove,
  name,
  error,
  width = 100,
  height = 100,
  multiple = false,
  ...props
}) => {
  const {
    register,
    formState: { errors },
  } = useCommonForm().formHandle;

  const errorMessage = errors[name]?.message as string;
  const errorText = errorMessage || error;

  const hiddenInputRef = useRef<HTMLInputElement | null>(null);
  const [previews, setPreviews] = useState<string[]>(() =>
    actualImages && actualImages?.length > 0 ? [...actualImages] : [defaultImage],
  );

  const { ref: registerRef, onChange, ...rest } = register(name);

  const handleUploadedFiles = (event: ChangeEvent<HTMLInputElement>): void => {
    const files = Array.from(event.target.files || []);
    const previewUrls = files.map((file) => URL.createObjectURL(file));
    setPreviews(previewUrls.length > 0 ? previewUrls : [defaultImage]);
  };

  const onUpload = (): void => {
    hiddenInputRef.current?.click();
  };

  const onFileChange = (e: ChangeEvent<HTMLInputElement>): void => {
    onChange(e);
    handleUploadedFiles(e);
  };

  const removeImage = (index: number): void => {
    setPreviews((prevPreviews) => {
      const updatedPreviews = prevPreviews.filter((_, i) => i !== index);
      return updatedPreviews.length > 0 ? updatedPreviews : [defaultImage];
    });
  };

  return (
    <InputImageContainer>
      <PicturesContainer>
        {previews.map((preview, index) => (
          <PictureWrapper
            onClick={onUpload}
            key={index}
            $circled={circled}
            $width={width}
            $height={height}
          >
            <img src={preview} alt={`${name}-${index}`} />
            {preview !== defaultImage && (
              <RemoveButton
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  removeImage(index);
                  console.log(preview);
                  if (onRemove) {
                    onRemove(preview);
                  }
                }}
              >
                &times;
              </RemoveButton>
            )}
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
      <ErrorMessageWrapper>
        <CSCommonErrorMessage>{errorText}</CSCommonErrorMessage>
      </ErrorMessageWrapper>
    </InputImageContainer>
  );
};

type PictureWrapperProps = {
  $circled?: boolean;
  $width?: number;
  $height?: number;
};

const InputImageContainer = styled.div`
  position: relative;
`;

const ErrorMessageWrapper = styled.div`
  width: 500px;
  position: absolute;
  bottom: -40px;
  left: 0;
`;

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

const RemoveButton = styled.button`
  position: absolute;
  top: 5px;
  right: 5px;
  background: rgba(0, 0, 0, 0.5);
  color: white;
  border: none;
  border-radius: 50%;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
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

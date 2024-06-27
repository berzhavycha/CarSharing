import { ChangeEvent, FC, useEffect, useRef } from 'react';
import styled from 'styled-components';

import { CSCommonErrorMessage, InputProps } from '@/components/cs-common';

import { useCommonForm } from './cs-common-form';
import { CSCommonFormImagePreview } from './cs-common-form-image-preview';
import { useImagePreviews } from './hooks';

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
    formState: { errors, isSubmitSuccessful },
  } = useCommonForm().formHandle;

  const hiddenInputRef = useRef<HTMLInputElement | null>(null);
  const { previews, handleUploadedFiles, removeImage, resetPreviews } = useImagePreviews(
    defaultImage,
    actualImages,
  );

  useEffect(() => {
    resetPreviews();
  }, [isSubmitSuccessful, actualImages]);

  const { ref: registerRef, onChange, ...rest } = register(name);

  const errorMessage = errors[name]?.message as string;
  const errorText = errorMessage || error;

  const onUpload = (): void => {
    hiddenInputRef.current?.click();
  };

  const onFileChange = (e: ChangeEvent<HTMLInputElement>): void => {
    onChange(e);
    handleUploadedFiles(e);
  };

  const onRemoveImage = (preview: string, index: number): void => {
    removeImage(index);
    if (onRemove && actualImages?.length) {
      onRemove(preview);
    }
  };

  return (
    <InputImageContainer>
      <PicturesContainer>
        {previews.map((preview, index) => (
          <CSCommonFormImagePreview
            key={index}
            src={preview}
            alt={`${name}-${index}`}
            circled={circled}
            width={width}
            height={height}
            onClick={onUpload}
            onRemove={() => onRemoveImage(preview, index)}
            isRemovable={preview !== defaultImage}
          />
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

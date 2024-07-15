import { ChangeEvent, FC, useEffect, useRef } from 'react';
import styled from 'styled-components';

import { CSCommonErrorMessage, InputProps } from '@/components/cs-common';

import { useCommonForm } from './cs-common-form';
import { CSCommonFormImagePreview } from './cs-common-form-image-preview';
import { Preview, useImagePreviews } from './hooks';

type Props = Omit<InputProps, 'name'> & {
  name: string;
  defaultImage: string;
  existingImagesIds?: string[];
  onRemove?: (id: string) => Promise<void> | void;
  circled?: boolean;
  width?: number;
  height?: number;
  multiple?: boolean;
};

export const CSCommonFormInputImage: FC<Props> = ({
  defaultImage,
  existingImagesIds,
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
    existingImagesIds,
    multiple,
  );

  useEffect(() => {
    resetPreviews();
  }, [isSubmitSuccessful, existingImagesIds]);

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

  const onRemoveImage = (preview: Preview, index: number): void => {
    removeImage(index);
    if (onRemove && existingImagesIds?.length && preview.id) {
      onRemove(preview.id);
    }
  };

  return (
    <div>
      <PicturesContainer>
        {previews.map((preview, index) => (
          <CSCommonFormImagePreview
            key={index}
            src={preview.url}
            alt={`${name}-${index}`}
            circled={circled}
            width={width}
            height={height}
            onClick={onUpload}
            onRemove={() => onRemoveImage(preview, index)}
            isRemovable={preview.url !== defaultImage}
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
      <CSCommonErrorMessage>{errorText}</CSCommonErrorMessage>
    </div>
  );
};

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
  color: var(--main-blue);
  border: none;
  background: none;
  outline: none;
  margin-top: 10px;
  text-align: center;
`;

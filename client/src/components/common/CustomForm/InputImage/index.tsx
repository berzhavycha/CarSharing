import { ChangeEvent, FC, useRef, useState } from 'react';

import { InputProps } from '@/components/common';

import { useCustomForm } from '..';
import styled from 'styled-components';

type Props = Omit<InputProps, 'name'> & {
  name: string;
  defaultImage: string;
};

export const InputImage: FC<Props> = ({ defaultImage, name, ...props }) => {
  const { register } = useCustomForm().formHandle

  const hiddenInputRef = useRef<HTMLInputElement | null>(null);
  const [preview, setPreview] = useState<string>(defaultImage);


  const { ref: registerRef, ...rest } = register(name);


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


  return (
    <ProfilePicture onClick={onUpload}>
      <img src={preview} alt={name} />
      <UpdatePicture type="button">Update Picture</UpdatePicture>
      <input
        type="file"
        {...rest}
        onChange={handleUploadedFile}
        ref={(e) => {
          registerRef(e);
          hiddenInputRef.current = e;
        }}
        {...props}
        hidden
      />
    </ProfilePicture>
  )
};

const ProfilePicture = styled.div`
  position: relative;
  margin-right: 20px;
  border: none;
  background: none;
  outline: none;
  cursor: pointer;

  img {
    width: 100px;
    height: 100px;
    border-radius: 50%;
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



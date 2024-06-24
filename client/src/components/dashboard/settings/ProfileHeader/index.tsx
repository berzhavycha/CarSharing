import { FC, useRef, useState } from 'react';
import styled from 'styled-components';

import { PrimaryButton } from '@/components/common';

import DefaultImage from '../../../../../public/avatar.webp';
import UploadingAnimation from '../../../../../public/uploading.gif';

export const ProfileHeader: FC = () => {
  const [avatarURL, setAvatarURL] = useState(DefaultImage);
  const fileUploadRef = useRef<HTMLInputElement | null>(null);

  const handleImageUpload = (): void => {
    if (fileUploadRef.current) {
      fileUploadRef.current.click();
    }
  };

  const uploadImageDisplay = async (): Promise<void> => {
    try {
      setAvatarURL(UploadingAnimation);

      const uploadedFile = fileUploadRef.current?.files?.[0];
      if (!uploadedFile) {
        throw new Error('No file selected');
      }

      const formData = new FormData();
      formData.append('file', uploadedFile);
    } catch (error) {
      console.error(error);
      setAvatarURL(DefaultImage);
    }
  };

  return (
    <ProfileHeaderWrapper>
      <ProfilePicture onClick={handleImageUpload}>
        <img src={avatarURL} alt="Profile" />
        <UpdatePicture>Update Picture</UpdatePicture>
        <input type="file" id="file" ref={fileUploadRef} onChange={uploadImageDisplay} hidden />
      </ProfilePicture>
      <UserInfo>
        <h2>Mason Wilson</h2>
        <span>Admin</span>
      </UserInfo>
      <PrimaryButton type="submit" content="Save" />
    </ProfileHeaderWrapper>
  );
};

const ProfileHeaderWrapper = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 50px;
`;

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

const UserInfo = styled.div`
  flex: 1;

  h2 {
    margin: 0;
    font-size: 24px;
  }

  span {
    font-size: 14px;
    color: #666;
  }
`;

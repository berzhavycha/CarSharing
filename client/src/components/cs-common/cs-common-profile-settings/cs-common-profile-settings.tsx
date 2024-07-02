import { observer } from 'mobx-react-lite';
import { FC } from 'react';
import styled from 'styled-components';

import { CSCommonErrorMessage, CSCommonForm, CSCommonModal } from '@/components/cs-common';
import { useStore } from '@/context';
import { updateUserSchema, uppercaseFirstLetter } from '@/helpers';
import { UpdateUserDto } from '@/types';

import DefaultImage from '../../../../public/avatar.webp';

import { useProfileUpdate } from './hooks';

export const CSCommonProfileSettings: FC = observer(() => {
  const {
    currentUserStore: { user, updateErrors, updateUser, existingImagesIds: viewImagesIds },
  } = useStore();

  const {
    isUpdateSuccessful,
    setIsUpdateSuccessful,
    existingImagesIds,
    onSubmit,
    onPreviewRemove,
  } = useProfileUpdate(updateUser, viewImagesIds, updateErrors);

  const defaultValues = {
    firstName: user?.firstName,
    lastName: user?.lastName,
    email: user?.email,
    picture: null,
  };

  const handleCloseModal = (): void => setIsUpdateSuccessful(false);

  return (
    <>
      <ProfileContainer>
        <ContentContainer>
          <CSCommonForm<UpdateUserDto>
            key={user?.id}
            defaultValues={defaultValues}
            validationSchema={updateUserSchema}
            onSubmit={onSubmit}
          >
            <ProfileHeaderWrapper>
              <CSCommonForm.InputFile
                defaultImage={DefaultImage}
                existingImageIds={existingImagesIds}
                onRemove={onPreviewRemove}
                name="picture"
                label="Update Avatar"
              />
              <UserInfo>
                <h2>
                  {user?.firstName} {user?.lastName}
                </h2>
                <span>{user?.role && uppercaseFirstLetter(user.role)}</span>
              </UserInfo>
              <CSCommonForm.SubmitButton content="Save" />
            </ProfileHeaderWrapper>

            <CSCommonErrorMessage>{updateErrors?.unexpectedError}</CSCommonErrorMessage>

            <Title>General Information</Title>
            <ProfileSection>
              <CSCommonForm.Input
                label="First Name"
                name="firstName"
                error={updateErrors?.firstName}
              />
              <CSCommonForm.Input
                label="Last Name"
                name="lastName"
                error={updateErrors?.lastName}
              />
              <CSCommonForm.Input label="Email" name="email" error={updateErrors?.email} />
            </ProfileSection>

            <Title>Change Password</Title>
            <PasswordSection>
              <CSCommonForm.Input
                label="Old Password"
                name="oldPassword"
                isSecured
                error={updateErrors?.oldPassword}
              />
              <CSCommonForm.Input
                label="New Password"
                name="newPassword"
                isSecured
                error={updateErrors?.newPassword}
              />
            </PasswordSection>
          </CSCommonForm>
        </ContentContainer>
      </ProfileContainer>

      {isUpdateSuccessful && (
        <CSCommonModal
          type="confirm"
          title="Success"
          message="Your account was successfully updated."
          onClose={handleCloseModal}
          onOk={handleCloseModal}
        />
      )}
    </>
  );
});

const ProfileContainer = styled.div`
  width: 100%;
`;

const ContentContainer = styled.div`
  max-height: calc(100vh - 40px);
  padding: 30px;
  background-color: white;
  margin: 20px;
  border-radius: 10px;
  box-shadow: var(--default-box-shadow);
`;

const Title = styled.h3`
  margin-bottom: 30px;
`;

const ProfileSection = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0 40px;
  margin-right: 10px;
`;

const PasswordSection = styled.div`
  display: flex;
  flex-direction: column;
  margin-top: 30px;
  margin-right: 10px;
`;

const ProfileHeaderWrapper = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 10px;
`;

const UserInfo = styled.div`
  flex: 1;

  margin-bottom: 25px;
  margin-left: 25px;

  h2 {
    margin: 0;
    font-size: 24px;
  }

  span {
    font-size: 14px;
    color: #666;
  }
`;

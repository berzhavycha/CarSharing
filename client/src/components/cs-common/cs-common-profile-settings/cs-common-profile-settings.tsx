import { observer } from 'mobx-react-lite';
import { FC } from 'react';
import styled from 'styled-components';

import {
  BtnSpinner,
  CSCommonErrorMessage,
  CSCommonForm,
  CSCommonModal,
} from '@/components/cs-common';
import { useStore } from '@/context';
import { updateUserSchema, uppercaseFirstLetter } from '@/helpers';
import { device } from '@/styles';
import { UpdateUserDto } from '@/types';

import DefaultImage from '../../../../public/avatar.webp';

import { useProfileUpdate } from './hooks';

export const CSCommonProfileSettings: FC = observer(() => {
  const {
    currentUserStore: { user, isLoading, errors, updateUser, existingImagesIds: viewImages },
  } = useStore();

  const { isUpdateSuccessful, setIsUpdateSuccessful, existingImagesIds, onSubmit, onPreviewRemove } =
    useProfileUpdate(updateUser, viewImages, errors?.update);

  const defaultValues = {
    firstName: user?.firstName,
    lastName: user?.lastName,
    email: user?.email,
    picture: null,
    ...(isUpdateSuccessful && { oldPassword: '', newPassword: '' }),
  };

  const handleCloseModal = (): void => setIsUpdateSuccessful(false);
  const saveBtnContent = isLoading ? <BtnSpinner /> : 'Save';

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
                existingImagesIds={existingImagesIds}
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
              <CSCommonForm.SubmitButton buttonContent={saveBtnContent} />
            </ProfileHeaderWrapper>

            <CSCommonErrorMessage>{errors.update?.unexpectedError}</CSCommonErrorMessage>

            <Title>General Information</Title>
            <ProfileSection>
              <CSCommonForm.Input
                label="First Name"
                name="firstName"
                error={errors.update?.firstName}
              />
              <CSCommonForm.Input
                label="Last Name"
                name="lastName"
                error={errors.update?.lastName}
              />
              <CSCommonForm.Input label="Email" name="email" error={errors?.update?.email} />
            </ProfileSection>

            <Title>Change Password</Title>
            <PasswordSection>
              <CSCommonForm.Input
                label="Old Password"
                name="oldPassword"
                isSecured
                error={errors.update?.oldPassword}
              />
              <CSCommonForm.Input
                label="New Password"
                name="newPassword"
                isSecured
                error={errors.update?.newPassword}
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
  padding: 30px 30px 0 30px;
  background-color: white;
  margin: 15px;
  border-radius: 10px;
  box-shadow: var(--default-box-shadow);
`;

const Title = styled.h3`
  margin-bottom: 30px;

  @media ${device.md} {
    font-size: 16px;
  }
`;

const ProfileSection = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0 40px;
  margin-right: 10px;

  @media ${device.sm} {
    display: flex;
    flex-direction: column;
  }
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
  margin-bottom: 0px;

  @media ${device.sm} {
    flex-direction: column;
    text-align: center;
  }
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

  @media ${device.md} {
    h2 {
      font-size: 20px;
    }

    span {
      font-size: 12px;
    }
  }

  @media ${device.sm} {
    h2 {
      font-size: 16px;
    }

    span {
      font-size: 10px;
    }

    margin-left: 0;
  }
`;

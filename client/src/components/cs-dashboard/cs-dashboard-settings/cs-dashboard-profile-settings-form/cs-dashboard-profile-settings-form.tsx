import { observer } from 'mobx-react-lite';
import { FC } from 'react';
import styled from 'styled-components';

import { CSCommonForm } from '@/components/cs-common';
import { useStore } from '@/context';
import { Env } from '@/core';
import { updateUserSchema, uppercaseFirstLetter } from '@/helpers';
import { UpdateUserDto } from '@/types';

import DefaultImage from '../../../../../public/avatar.webp';

export const CSDashboardProfileSettingsForm: FC = observer(() => {
  const {
    currentUserStore: { user, updateErrors, updateUser, removeAvatar },
  } = useStore();

  const onSubmit = async (user: UpdateUserDto): Promise<void> => {
    const userDtoWithoutEmptyPasswords = Object.fromEntries(
      Object.entries(user).filter(([, value]) => {
        return value !== '' && value !== null && value !== undefined;
      }),
    );

    console.log(userDtoWithoutEmptyPasswords)
    await updateUser(userDtoWithoutEmptyPasswords);
  };

  const onRemoveAvatar = async (): Promise<void> => await removeAvatar();

  const avatar = user?.avatarId ? [`${Env.API_BASE_URL}/local-files/${user.avatarId}`] : undefined;
  const defaultFormValues = {
    firstName: user?.firstName,
    lastName: user?.lastName,
    email: user?.email,
  };

  return (
    <ProfileContainer>
      <ContentContainer>
        <CSCommonForm<UpdateUserDto>
          key={user?.id}
          defaultValues={defaultFormValues}
          validationSchema={updateUserSchema}
          onSubmit={onSubmit}
        >
          <ProfileHeaderWrapper>
            <CSCommonForm.InputFile
              defaultImage={DefaultImage}
              actualImages={avatar}
              onRemove={onRemoveAvatar}
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

          <Title>General Information</Title>
          <ProfileSection>
            <CSCommonForm.Input
              label="First Name"
              name="firstName"
              error={updateErrors?.firstName}
            />
            <CSCommonForm.Input label="Last Name" name="lastName" error={updateErrors?.lastName} />
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
  );
});

const ProfileContainer = styled.div`
  width: 100%;
  max-height: 100vh;
`;

const ContentContainer = styled.div`
  padding: 30px;
  background-color: white;
  margin: 20px;
  border-radius: 10px;
  box-shadow: var(--default-box-shadow);
  height: 94%;
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
  margin-bottom: 50px;
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

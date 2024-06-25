import { observer } from 'mobx-react-lite';
import { FC } from 'react';
import styled from 'styled-components';

import { CustomForm } from '@/components/common';
import { useStore } from '@/context';
import { Env } from '@/core';
import { updateUserSchema, uppercaseFirstLetter } from '@/helpers';
import { UpdateUserDto } from '@/types';

import DefaultImage from '../../../../../public/avatar.webp';

export const ProfileSettingsForm: FC = observer(() => {
  const { currentUserStore: { user, updateErrors, updateUser } } = useStore();

  const onSubmit = async (user: UpdateUserDto): Promise<void> => {
    const userDtoWithoutEmptyPasswords = Object.fromEntries(
      Object.entries(user).filter(
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        ([_key, value]) => value !== '' && value !== null && value !== undefined
      )
    );

    await updateUser(userDtoWithoutEmptyPasswords);
  };

  const avatar = user?.avatarId ? `${Env.API_BASE_URL}/local-files/${user.avatarId}` : DefaultImage;
  const defaultFormValues = {
    firstName: user?.firstName,
    lastName: user?.lastName,
    email: user?.email,
  };

  return (
    <ProfileContainer>
      <ContentContainer>
        <CustomForm<UpdateUserDto>
          key={user?.id}
          defaultValues={defaultFormValues}
          validationSchema={updateUserSchema}
          onSubmit={onSubmit}
        >
          <ProfileHeaderWrapper>
            <CustomForm.InputFile defaultImage={avatar} name="picture" />
            <UserInfo>
              <h2>
                {user?.firstName} {user?.lastName}
              </h2>
              <span>{user?.role && uppercaseFirstLetter(user.role)}</span>
            </UserInfo>
            <CustomForm.SubmitButton content="Save" />
          </ProfileHeaderWrapper>

          <Title>General Information</Title>
          <ProfileSection>
            <CustomForm.Input
              label="First Name"
              name="firstName"
              error={updateErrors?.firstName}
            />
            <CustomForm.Input
              label="Last Name"
              name="lastName"
              error={updateErrors?.lastName}
            />
            <CustomForm.Input
              label="Email"
              name="email"
              error={updateErrors?.email}
            />
          </ProfileSection>

          <Title>Change Password</Title>
          <PasswordSection>
            <CustomForm.Input
              label="Old Password"
              name="oldPassword"
              isSecured
              error={updateErrors?.oldPassword}
            />
            <CustomForm.Input label="New Password" name="newPassword" isSecured />
          </PasswordSection>
        </CustomForm>
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

  h2 {
    margin: 0;
    font-size: 24px;
  }

  span {
    font-size: 14px;
    color: #666;
  }
`;

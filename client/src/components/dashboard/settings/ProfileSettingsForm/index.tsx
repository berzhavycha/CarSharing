import { FC } from 'react';
import styled from 'styled-components';

import { CustomForm } from '@/components/common';
import { Env } from '@/core';
import { updateUserSchema } from '@/helpers';
import { UpdateUserDto, AuthenticatedUser } from '@/types';

import DefaultImage from '../../../../../public/avatar.webp';

import { observer } from 'mobx-react-lite';
import { useStore } from '@/context';

type Props = {
  user: AuthenticatedUser | null
}

export const ProfileSettingsForm: FC<Props> = observer(({ user }) => {
  const { currentUserStore } = useStore()

  const onSubmit = async (user: UpdateUserDto): Promise<void> => {
    await currentUserStore.updateUser(user);
  };

  const avatar = user ? `${Env.API_BASE_URL}/local-files/${user.avatarId}` : DefaultImage
  const defaultFormValues = { firstName: user?.firstName, lastName: user?.lastName, email: user?.email }

  return (
    <ContentContainer>
      <CustomForm<UpdateUserDto> defaultValues={defaultFormValues} validationSchema={updateUserSchema} onSubmit={onSubmit}>
        <ProfileHeaderWrapper>
          <CustomForm.InputFile
            key={avatar}
            defaultImage={avatar}
            name="picture"
          />
          <UserInfo>
            <h2>{user?.firstName} {user?.lastName}</h2>
            <span>{user?.role}</span>
          </UserInfo>
          <CustomForm.SubmitButton content="Save" />
        </ProfileHeaderWrapper>

        <Title>General Information</Title>
        <ProfileSection>
          <CustomForm.Input label="First Name" name="firstName" error={currentUserStore.updateErrors?.firstName} />
          <CustomForm.Input label="Last Name" name="lastName" error={currentUserStore.updateErrors?.lastName} />
          <CustomForm.Input label="Email" name="email" error={currentUserStore.updateErrors?.email} />
        </ProfileSection>

        <Title>Change Password</Title>
        <PasswordSection>
          <CustomForm.Input
            label="Old Password"
            name="oldPassword"
            isSecured
            error={currentUserStore.updateErrors?.oldPassword}
          />
          <CustomForm.Input label="New Password" name="newPassword" isSecured />
        </PasswordSection>
      </CustomForm>
    </ContentContainer>
  );
});


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

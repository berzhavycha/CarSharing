import { FC } from 'react';
import styled from 'styled-components';

import { User } from '@/types';

import { ProfileHeader } from '../ProfileHeader';
import { ProfileSettingsForm } from '../ProfileSettingsForm';

type Props = {
  user: User;
};

export const ProfileContent: FC<Props> = ({ user }) => {
  return (
    <ContentContainer>
      {/* <ProfileHeader /> */}
      <ProfileSettingsForm />
    </ContentContainer>
  );
};

const ContentContainer = styled.div`
  padding: 30px;
  background-color: white;
  margin: 20px;
  border-radius: 10px;
  box-shadow: var(--default-box-shadow);
  height: 94%;
`;

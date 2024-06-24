import { FC } from 'react';
import styled from 'styled-components';

import { ProfileSettingsForm } from '../ProfileSettingsForm';
import { useCurrentUser } from '@/context';

export const UserSettings: FC = () => {
  const { currentUser } = useCurrentUser()

  return (
    <ProfileContainer>
      <ProfileSettingsForm user={currentUser} />
    </ProfileContainer>
  );
};

const ProfileContainer = styled.div`
  width: 100%;
  max-height: 100vh;
`;

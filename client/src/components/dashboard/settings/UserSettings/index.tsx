import { FC } from 'react';
import styled from 'styled-components';

import { ProfileSettingsForm } from '../ProfileSettingsForm';

export const UserSettings: FC = () => {
  return (
    <ProfileContainer>
      <ProfileSettingsForm />
    </ProfileContainer>
  );
};

const ProfileContainer = styled.div`
  width: 100%;
  max-height: 100vh;
`;

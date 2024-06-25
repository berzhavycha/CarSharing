import { observer } from 'mobx-react-lite';
import { FC } from 'react';
import styled from 'styled-components';

import { useStore } from '@/context';

import { ProfileSettingsForm } from '../ProfileSettingsForm';

export const UserSettings: FC = observer(() => {
  const { currentUserStore } = useStore();

  return (
    <ProfileContainer>
      <ProfileSettingsForm user={currentUserStore.user} />
    </ProfileContainer>
  );
});

const ProfileContainer = styled.div`
  width: 100%;
  max-height: 100vh;
`;

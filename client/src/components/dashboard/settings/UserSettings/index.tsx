import { FC } from 'react';
import styled from 'styled-components';

import { ProfileSettingsForm } from '../ProfileSettingsForm';
import { useStore } from '@/context';
import { observer } from 'mobx-react-lite';

export const UserSettings: FC = observer(() => {
  const { currentUserStore } = useStore()

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

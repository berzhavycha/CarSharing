import { FC } from 'react';
import styled from 'styled-components';

import { ProfileContent } from '../ProfileContent';

export const UserSettings: FC = () => {
  return (
    <ProfileContainer>
      <ProfileContent />
    </ProfileContainer>
  );
};

const ProfileContainer = styled.div`
  width: 100%;
  max-height: 100vh;
`;

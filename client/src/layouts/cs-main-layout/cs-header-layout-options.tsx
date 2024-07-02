import { observer } from 'mobx-react-lite';
import { FC } from 'react';
import { FaDollarSign, FaSignOutAlt } from 'react-icons/fa';
import { FaGear } from 'react-icons/fa6';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';

import { useStore } from '@/context';
import { Env } from '@/core';
import { useSignOut } from '@/hooks';

import DefaultImage from '../../../public/avatar.webp';

export const CSHeaderLayoutOptions: FC = observer(() => {
  const navigate = useNavigate();
  const {
    currentUserStore: { user },
  } = useStore();
  const { onSignOut } = useSignOut();

  const onTopUp = (): void => navigate('/top-up');
  const onProfileSettings = (): void => navigate('/profile-settings');
  const profilePicture = user?.avatarId
    ? `${Env.API_BASE_URL}/local-files/${user?.avatarId}`
    : DefaultImage;

  return (
    <IconGroup>
      <IconWrapper onClick={onProfileSettings}>
        <FaGear />
      </IconWrapper>
      <IconWrapper onClick={onTopUp}>
        <FaDollarSign />
      </IconWrapper>
      <UserInfo>
        <UserAvatar src={profilePicture} alt="User Avatar" />
        {user && (
          <UserDetails>
            <p>
              {user?.firstName} {user?.lastName}
            </p>
            <Balance>Balance: ${user?.balance}</Balance>
          </UserDetails>
        )}
        <IconWrapper onClick={onSignOut}>
          <FaSignOutAlt />
        </IconWrapper>
      </UserInfo>
    </IconGroup>
  );
});

const Balance = styled.h4`
  font-size: 14px;
`;

const IconGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 20px;
`;

const UserInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 20px;
`;

const UserDetails = styled.div`
  display: flex;
  flex-direction: column;
  gap: 5px;
`;

const IconWrapper = styled.div`
  width: 40px;
  height: 40px;
  font-size: 18px;
  color: var(--gray-blue);
  cursor: pointer;
  border: var(--default-border);
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  transition: var(--default-transition);

  &:hover {
    color: #1e3a8a;
    border-color: #1e3a8a;
  }
`;

const UserAvatar = styled.img`
  width: 50px;
  height: 50px;
  border-radius: 50%;
`;

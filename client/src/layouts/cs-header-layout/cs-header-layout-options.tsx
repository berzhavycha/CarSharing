import { FC } from 'react';
import { FaGear } from 'react-icons/fa6';
import styled from 'styled-components';

import DefaultImage from '../../../public/avatar.webp'
import { useStore } from '@/context';
import { useSignOut } from '@/hooks';
import { FaSignOutAlt } from 'react-icons/fa';

export const CSHeaderLayoutOptions: FC = () => {
  const { currentUserStore: { user } } = useStore()
  const { onSignOut } = useSignOut()

  return (
    <IconGroup>
      <IconWrapper>
        <FaGear />
      </IconWrapper>
      <UserInfo>
        <UserAvatar src={user?.avatarId ?? DefaultImage} alt="User Avatar" />
        {user && (
          <UserDetails>
            <p>{user?.firstName} {user?.lastName}</p>
            <Balance>Balance: ${user?.balance}</Balance>
          </UserDetails>
        )}
        <IconWrapper onClick={onSignOut}>
          <FaSignOutAlt />
        </IconWrapper>
      </UserInfo>
    </IconGroup>
  );
};

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

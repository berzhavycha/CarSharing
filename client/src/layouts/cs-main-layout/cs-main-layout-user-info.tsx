import { observer } from 'mobx-react-lite';
import { FC } from 'react';
import styled from 'styled-components';

import { useStore } from '@/context';

import DefaultImage from '../../../public/avatar.webp';

export const CSMainLayoutUserInfo: FC = observer(() => {
  const {
    currentUserStore: { user },
  } = useStore();

  const avatar = user?.avatar ? user.avatar.url : DefaultImage

  return (
    <>
      <UserAvatarWrapper>
        <img src={avatar} alt="User Avatar" />
      </UserAvatarWrapper>
      {user && (
        <UserDetails>
          <p>
            {user?.firstName} {user?.lastName}
          </p>
          <Balance>Balance: ${user?.balance?.toFixed(2)}</Balance>
        </UserDetails>
      )}
    </>
  );
});

const UserAvatarWrapper = styled.div`
  width: 50px;
  height: 50px;
  border-radius: 50%;
  overflow: hidden;

  img,
  .cloudinary-image {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const UserDetails = styled.div`
  display: flex;
  flex-direction: column;
  gap: 5px;
`;

const Balance = styled.h4`
  font-size: 14px;
  margin: 0;
`;

import { observer } from 'mobx-react-lite';
import { FC, useRef, useState } from 'react';
import { FaBars, FaSignOutAlt } from 'react-icons/fa';
import styled from 'styled-components';

import { CSCommonCloseButton } from '@/components';
import { useStore } from '@/context';
import { useClickOutside, useSignOut } from '@/hooks';
import { device } from '@/styles';

import DefaultImage from '../../../public/avatar.webp';

import { menuItems } from './constants';
import { IconWrapper, NavItem } from './cs-main-layout-nav-item';

export const CSMainLayoutHeaderOptions: FC = observer(() => {
  const {
    currentUserStore: { user },
  } = useStore();
  const { onSignOut } = useSignOut();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuButtonRef = useRef<HTMLButtonElement>(null);

  const profilePicture = user?.avatarId
    ? user?.avatar?.url
    : DefaultImage;

  const ref = useClickOutside(() => setIsMenuOpen(false), menuButtonRef);
  const toggleMenu = (): void => setIsMenuOpen(!isMenuOpen);
  const closeMenu = (): void => setIsMenuOpen(false);

  const signOutHandler = async (): Promise<void> => {
    onSignOut();
    closeMenu();
  };

  return (
    <Container>
      <MenuButton onClick={toggleMenu} ref={menuButtonRef}>
        <FaBars />
      </MenuButton>
      <NavOptions $isOpen={isMenuOpen} ref={ref}>
        {isMenuOpen && <CSCommonCloseButton onClose={closeMenu} />}
        <UserInfoMobile>
          <UserAvatar src={profilePicture} alt="User Avatar" />
          {user && (
            <UserDetails>
              <p>
                {user?.firstName} {user?.lastName}
              </p>
              <Balance>Balance: ${user?.balance?.toFixed(2)}</Balance>
            </UserDetails>
          )}
        </UserInfoMobile>
        {menuItems.map((item) => (
          <NavItem
            key={item.label}
            to={item.path}
            icon={item.icon}
            text={item.label}
            onClick={closeMenu}
          />
        ))}
        <SignOutButton onClick={signOutHandler}>
          <IconWrapper>
            <FaSignOutAlt />
          </IconWrapper>
          <span>Sign Out</span>
        </SignOutButton>
      </NavOptions>
      <UserInfoDesktop>
        <UserAvatar src={profilePicture} alt="User Avatar" />
        {user && (
          <UserDetails>
            <p>
              {user?.firstName} {user?.lastName}
            </p>
            <Balance>Balance: ${user?.balance?.toFixed(2)}</Balance>
          </UserDetails>
        )}
      </UserInfoDesktop>
    </Container>
  );
});

const Container = styled.div`
  display: flex;
  align-items: center;
  gap: 20px;
`;

const MenuButton = styled.button`
  display: none;
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
  color: var(--gray-blue);

  @media ${device.lg} {
    display: flex;
  }

  @media ${device.sm} {
    font-size: 20px;
  }
`;

const NavOptions = styled.div<{ $isOpen: boolean }>`
  display: flex;
  align-items: center;
  gap: 20px;

  @media ${device.lg} {
    position: absolute;
    z-index: 100;
    top: 100px;
    right: 20px;
    background-color: white;
    padding: 20px 50px 20px 20px;
    border-radius: 8px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    flex-direction: column;
    text-align: left;
    align-items: start;

    opacity: ${({ $isOpen }): number => ($isOpen ? 1 : 0)};
    visibility: ${({ $isOpen }): string => ($isOpen ? 'visible' : 'hidden')};
    transform: ${({ $isOpen }): string => ($isOpen ? 'translateY(0)' : 'translateY(-20px)')};
    transition:
      opacity 0.3s ease,
      visibility 0.3s ease,
      transform 0.3s ease;
  }

  @media ${device.md} {
    top: 80px;
  }
`;

const SignOutButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 10px;
  color: var(--gray-blue);

  span {
    font-size: 16px;
    display: none;

    @media ${device.lg} {
      display: flex;
    }
  }

  &:hover {
    color: #1e3a8a;
  }
`;

const UserInfoDesktop = styled.div`
  display: flex;
  align-items: center;
  gap: 20px;

  @media (max-width: 900px) {
    display: none;
  }
`;

const UserInfoMobile = styled.div`
  display: none;
  align-items: center;
  gap: 20px;
  margin-bottom: 20px;
  width: 100%;

  @media ${device.md} {
    display: flex;
  }
`;

const UserDetails = styled.div`
  display: flex;
  flex-direction: column;
  gap: 5px;
`;

const UserAvatar = styled.img`
  width: 50px;
  height: 50px;
  border-radius: 50%;
`;

const Balance = styled.h4`
  font-size: 14px;
  margin: 0;
`;

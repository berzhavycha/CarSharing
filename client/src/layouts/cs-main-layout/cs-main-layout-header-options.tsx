import { observer } from 'mobx-react-lite';
import { FC, useRef, useState } from 'react';
import { FaBars } from 'react-icons/fa';
import styled from 'styled-components';

import { CSCommonCloseButton } from '@/components';
import { useStore } from '@/context';
import { useClickOutside, useSignOut } from '@/hooks';
import { device } from '@/styles';

import DefaultImage from '../../../public/avatar.webp';

import { menuItems, searchEnabledRoutes } from './constants';
import { NavItem } from './cs-main-layout-nav-item';
import { CSMainLayoutSignOutBtn } from './cs-main-layout-sign-out-btn';
import { Env } from '@/core';
import { useLocation } from 'react-router-dom';

export const CSMainLayoutHeaderOptions: FC = observer(() => {
  const {
    currentUserStore: { user },
  } = useStore();
  const { onSignOut } = useSignOut();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuButtonRef = useRef<HTMLButtonElement>(null);

  const { pathname } = useLocation();
  const isSearchBarEnabled = searchEnabledRoutes.includes(pathname);

  const profilePicture = user?.avatarId
    ? `${Env.API_BASE_URL}/local-files/${user?.avatarId}`
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
      <NavOptions $isOpen={isMenuOpen} $isSearchBarEnabled={isSearchBarEnabled} ref={ref}>
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
        <CSMainLayoutSignOutBtn signOutHandler={signOutHandler} />
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

const NavOptions = styled.div<{ $isOpen: boolean, $isSearchBarEnabled: boolean }>`
  display: flex;
  align-items: center;
  gap: 20px;

  @media ${device.lg} {
    position: absolute;
    z-index: 1001;
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
    top: 90px;
  }

  @media ${device.sm} {
    top: ${({ $isSearchBarEnabled }): string => ($isSearchBarEnabled ? '120px' : '80px')};
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
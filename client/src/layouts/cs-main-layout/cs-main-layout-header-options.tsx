import { observer } from 'mobx-react-lite';
import { FC, useRef, useState } from 'react';
import { FaBars } from 'react-icons/fa';
import styled from 'styled-components';

import { CSCommonCloseButton } from '@/components';
import { useClickOutside, useSignOut } from '@/hooks';
import { device } from '@/styles';

import { menuItems } from './constants';
import { NavItem } from './cs-main-layout-nav-item';
import { CSMainLayoutSignOutBtn } from './cs-main-layout-sign-out-btn';
import { CSMainLayoutUserInfo } from './cs-main-layout-user-info';

export const CSMainLayoutHeaderOptions: FC = observer(() => {
  const { onSignOut } = useSignOut();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuButtonRef = useRef<HTMLButtonElement>(null);

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
          <CSMainLayoutUserInfo />
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
        <CSMainLayoutUserInfo />
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
    top: 80px;
  }

  @media ${device.sm} {
    top: 120px;
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


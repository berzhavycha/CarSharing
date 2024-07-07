import { observer } from 'mobx-react-lite';
import { FC, useRef, useState } from 'react';
import { FaDollarSign, FaSignOutAlt, FaHistory, FaBars } from 'react-icons/fa';
import { FaGear } from 'react-icons/fa6';
import { NavLink } from 'react-router-dom';
import styled from 'styled-components';

import { useStore } from '@/context';
import { Env } from '@/core';
import { useClickOutside, useSignOut } from '@/hooks';

import DefaultImage from '../../../public/avatar.webp';
import { device } from '@/styles';
import { CSCommonCloseButton } from '@/components';

export const CSHeaderLayoutOptions: FC = observer(() => {
  const {
    currentUserStore: { user },
  } = useStore();
  const { onSignOut } = useSignOut();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuButtonRef = useRef<HTMLButtonElement>(null);

  const profilePicture = user?.avatarId
    ? `${Env.API_BASE_URL}/local-files/${user?.avatarId}`
    : DefaultImage;

  const ref = useClickOutside(() => setIsMenuOpen(false), menuButtonRef);
  const toggleMenu = (): void => setIsMenuOpen(!isMenuOpen);
  const closeMenu = (): void => setIsMenuOpen(false);

  const signOutHandler = async (): Promise<void> => {
    onSignOut();
    closeMenu();
  }

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
        <StyledNavLink to="/profile-settings" onClick={closeMenu}>
          <IconWrapper>
            <FaGear />
          </IconWrapper>
          <span>Settings</span>
        </StyledNavLink>
        <StyledNavLink to="/top-up" onClick={closeMenu}>
          <IconWrapper>
            <FaDollarSign />
          </IconWrapper>
          <span>Top Up</span>
        </StyledNavLink>
        <StyledNavLink to="/rental-history" onClick={closeMenu}>
          <IconWrapper>
            <FaHistory />
          </IconWrapper>
          <span>History</span>
        </StyledNavLink>
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
    transition: opacity 0.3s ease, visibility 0.3s ease, transform 0.3s ease;
  }

  @media ${device.md} {
    top: 80px;
  }
`;

const StyledNavLink = styled(NavLink)`
  text-decoration: none;
  display: flex;
  align-items: center;
  gap: 10px;
  color: var(--gray-blue);

  &.active {
    color: #1e3a8a;

    span {
      color: #1e3a8a;
    }
  }

  span {
    display: none;
 
    @media ${device.lg} {
      display: flex;
    }
  }

   &:hover {
    color: #1e3a8a;
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

const IconWrapper = styled.div`
  width: 40px;
  height: 40px;
  font-size: 18px;
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

  @media ${device.md}  {
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


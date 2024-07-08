import { FC, ReactNode } from 'react';
import { NavLink } from 'react-router-dom';
import styled from 'styled-components';

import { device } from '@/styles';

type Props = {
  to: string;
  icon: ReactNode;
  text: string;
  onClick: () => void;
};

export const NavItem: FC<Props> = ({ to, icon, text, onClick }) => (
  <StyledNavLink to={to} onClick={onClick}>
    <IconWrapper>{icon}</IconWrapper>
    <span>{text}</span>
  </StyledNavLink>
);

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

export const IconWrapper = styled.div`
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

import React, { FC, useRef, useState } from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { FaEllipsisV } from 'react-icons/fa';
import { useClickOutside } from '@/hooks';
import { device } from '@/styles';

type Action = {
  label: string;
  icon: React.ReactNode;
  onClick?: () => void;
  to?: string;
};

type Props = {
  actions: Action[];
};

export const CSCommonTableActions: FC<Props> = ({ actions }) => {
  const [showActions, setShowActions] = useState<boolean>(false);
  const actionButtonRef = useRef<HTMLButtonElement>(null)

  const toggleActions = (): void => {
    setShowActions(!showActions);
  };

  const ref = useClickOutside(() => setShowActions(false), actionButtonRef);

  return (
    <ActionsWrapper>
      <DesktopActions>
        {actions.map((action, index) => (
          action.to ? (
            <ActionButton key={index} as={Link} to={action.to}>{action.label}</ActionButton>
          ) : (
            <ActionButton key={index} onClick={action.onClick}>{action.label}</ActionButton>
          )
        ))}
      </DesktopActions>
      <MobileActions>
        <ActionToggle onClick={toggleActions} ref={actionButtonRef}>
          <FaEllipsisV />
        </ActionToggle>
        <ActionMenu $show={showActions} ref={ref}>
          {actions.map((action, index) => (
            action.to ? (
              <ActionMenuItem key={index} to={action.to} onClick={toggleActions}>
                {action.icon} {action.label}
              </ActionMenuItem>
            ) : (
              <ActionMenuButton key={index} onClick={() => {
                action.onClick?.();
                toggleActions();
              }}>
                {action.icon} {action.label}
              </ActionMenuButton>
            )
          ))}
        </ActionMenu>
      </MobileActions>
    </ActionsWrapper>
  );
};

const ActionsWrapper = styled.div`
  position: relative;
`;

const DesktopActions = styled.div`
  display: flex;
  align-items: center;

  @media ${device.md} {
    display: none;
  }
`;

const MobileActions = styled.div`
  display: none;

  @media ${device.md} {
    display: flex;
    justify-content: center;
  }
`;

const ActionToggle = styled.button`
  background: none;
  border: none;
  color: var(--main-blue);
  font-size: 18px;
  cursor: pointer;
  transition: color 0.3s ease;

  &:hover {
    color: var(--dark-blue);
  }

  @media ${device.sm} {
    font-size: 14px;
  }
`;

const ActionMenu = styled.div<{ $show: boolean }>`
  position: absolute;
  right: 50%;
  top: 80%;
  background-color: white;
  border-radius: 4px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  opacity: ${({ $show }): number => ($show ? 1 : 0)};
  transform: ${({ $show }): string => ($show ? 'translateY(0)' : 'translateY(-10px)')};
  visibility: ${({ $show }): string => ($show ? 'visible' : 'hidden')};
  transition: opacity 0.3s ease, transform 0.3s ease, visibility 0.3s ease;
  z-index: 10;
`;

const ActionMenuItem = styled(Link)`
  display: flex;
  align-items: center;
  padding: 10px 15px;
  color: var(--main-blue);
  text-decoration: none;
  font-size: 12px;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #f0f0f0;
  }

  svg {
    margin-right: 8px;
  }

  &:not(:last-child) {
    border-bottom: 1px solid #eee;
  }
`;

const ActionMenuButton = styled.button`
  display: flex;
  align-items: center;
  width: 100%;
  padding: 10px 15px;
  color: var(--main-blue);
  background: none;
  border: none;
  font-size: 12px;
  text-align: left;
  cursor: pointer;
  transition: background-color 0.3s ease;
  
  &:hover {
    background-color: #f0f0f0;
  }

  svg {
    margin-right: 8px;
  }

  &:not(:last-child) {
    border-bottom: 1px solid #eee;
  }
`;

const ActionButton = styled.button`
  font-size: 14px;
  padding: 6px 12px;
  border: none;
  border-radius: 4px;
  background-color: var(--main-blue);
  color: white;
  cursor: pointer;
  margin-right: 5px;
  transition: var(--default-transition);
  text-decoration: none;

  &:hover {
    background-color: var(--dark-blue);
  }

  @media ${device.lg} {
    font-size: 12px;
  }

  @media ${device.md} {
    font-size: 11px;
  }
`;
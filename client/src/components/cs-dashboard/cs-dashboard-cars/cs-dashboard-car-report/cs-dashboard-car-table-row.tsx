import { FC, useState } from 'react';
import styled from 'styled-components';

import { TableCell, TableRow } from '@/components/cs-common';
import { Env } from '@/core';
import { uppercaseFirstLetter } from '@/helpers';
import { Car } from '@/types';
import { Link } from 'react-router-dom';
import { device, HideOnMDScreen, HideOnSMScreen, HideOnXSScreen } from '@/styles';
import { FaEllipsisV, FaInfoCircle, FaTrash } from 'react-icons/fa';
import { useClickOutside } from '@/hooks';

type Props = {
  car: Car;
  index: number;
  onRemoveClick: (car: Car) => void;
};

export const CSDashboardCarTableRow: FC<Props> = ({
  car,
  index,
  onRemoveClick,
}) => {
  const [showActions, setShowActions] = useState<boolean>(false);

  const toggleActions = (): void => {
    setShowActions(!showActions);
  };

  const ref = useClickOutside(() => setShowActions(false))

  return (
    <TableRow key={car.id}>
      <TableCell>{index + 1}</TableCell>
      <HideOnXSScreen>
        <TableCell>
          <img src={`${Env.API_BASE_URL}/local-files/${car.pictures[0]?.id}`} alt="Car Image" />
        </TableCell>
      </HideOnXSScreen>
      <TableCell>{car.model}</TableCell>
      <HideOnMDScreen>
        <TableCell>{car.year}</TableCell>
      </HideOnMDScreen>
      <TableCell>${car.pricePerHour}</TableCell>
      <HideOnMDScreen>
        <TableCell>{car.type}</TableCell>
      </HideOnMDScreen>
      <HideOnSMScreen>
        <TableCell>
          <StatusBadge $status={car.status}>{uppercaseFirstLetter(car.status)}</StatusBadge>
        </TableCell>
      </HideOnSMScreen>
      <ActionsCell>
        <DesktopActions>
          <DetailsButton to={`/dashboard/edit-car?carId=${car.id}`}>Details</DetailsButton>
          <RemoveButton onClick={() => onRemoveClick(car)}>Remove</RemoveButton>
        </DesktopActions>
        <MobileActions>
          <ActionToggle onClick={toggleActions}>
            <FaEllipsisV />
          </ActionToggle>
          <ActionMenu $show={showActions} ref={ref}>
            <ActionMenuItem to={`/dashboard/edit-car?carId=${car.id}`}>
              <FaInfoCircle /> Details
            </ActionMenuItem>
            <ActionMenuButton onClick={() => {
              onRemoveClick(car);
              toggleActions();
            }}>
              <FaTrash /> Remove
            </ActionMenuButton>
          </ActionMenu>
        </MobileActions>
      </ActionsCell>
    </TableRow>
  );
};

const ActionsCell = styled(TableCell)`
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

const StatusBadge = styled.div<{ $status: string }>`
  width: 100%;
  display: inline-block;
  padding: 6px 10px;
  border-radius: 5px;
  font-size: 12px;
  font-weight: bold;
  text-align: center;
  color: ${(props): string => {
    switch (props.$status) {
      case 'available':
        return 'var(--green-status-text)';
      case 'booked':
        return 'var(--yellow-status-text)';
      case 'maintained':
        return 'var(--red-status-text)';
      default:
        return 'var(--default-text)';
    }
  }};
  background-color: ${(props): string => {
    switch (props.$status) {
      case 'available':
        return 'var(--green-status-bg)';
      case 'booked':
        return 'var(--yellow-status-bg)';
      case 'maintained':
        return 'var(--red-status-bg)';
      default:
        return 'var(--default-bg)';
    }
  }};
  border: 2px solid
    ${(props): string => {
    switch (props.$status) {
      case 'available':
        return 'var(--green-status-border)';
      case 'booked':
        return 'var(--yellow-status-border)';
      case 'maintained':
        return 'var(--red-status-border)';
      default:
        return 'var(--default-border)';
    }
  }};

  @media ${device.lg} {
    font-size: 12px;
    padding: 5px 10px;
  }

  @media ${device.md} {
    font-size: 11px;
  }

  @media ${device.sm} {
    font-size: 10px;
    padding: 4px 8px;
  }
`;


const DetailsButton = styled(Link)`
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

const RemoveButton = styled.button`
  padding: 7px 12px;
  border: none;
  border-radius: 4px;
  background-color: var(--red-status-text);
  color: white;
  cursor: pointer;
  margin-right: 5px;
  transition: var(--default-transition);

  &:hover {
    background-color: #aa2633;
  }

  @media ${device.lg} {
    font-size: 12px;
  }

  @media ${device.md} {
    font-size: 11px;
  }
`;

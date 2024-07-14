import { FC } from 'react';
import { FaInfoCircle, FaTrash } from 'react-icons/fa';
import styled from 'styled-components';

import {
  CSCommonBaseStatusBadge,
  CSCommonTableActions,
  HiddenMDTableCell,
  HiddenSMTableCell,
  HiddenXSTableCell,
  TableCell,
  TableRow,
} from '@/components/cs-common';
import { uppercaseFirstLetter } from '@/helpers';
import { Car } from '@/types';

type Props = {
  car: Car;
  index: number;
  onRemoveClick: (car: Car) => void;
};

export const CSDashboardCarTableRow: FC<Props> = ({ car, index, onRemoveClick }) => {
  const actions = [
    {
      label: 'Details',
      icon: <FaInfoCircle />,
      to: `/dashboard/edit-car?carId=${car.id}`,
    },
    {
      label: 'Remove',
      icon: <FaTrash />,
      onClick: (): void => onRemoveClick(car),
    },
  ];

  return (
    <TableRow key={car.id}>
      <TableCell>{index + 1}</TableCell>
      <HiddenXSTableCell>
        <img
          //src={car.pictures[0]?.url}
          src=""
          alt="Car Image"
        />
      </HiddenXSTableCell>
      <TableCell>{car.model}</TableCell>
      <HiddenMDTableCell>{car.year} </HiddenMDTableCell>
      <TableCell>${car.pricePerHour}</TableCell>
      <HiddenMDTableCell>{car.type}</HiddenMDTableCell>
      <HiddenSMTableCell>
        <StatusBadge $status={car.status}>{uppercaseFirstLetter(car.status)}</StatusBadge>
      </HiddenSMTableCell>
      <ActionsCell>
        <CSCommonTableActions actions={actions} />
      </ActionsCell>
    </TableRow>
  );
};

const ActionsCell = styled(TableCell)`
  position: relative;
`;

const StatusBadge = styled(CSCommonBaseStatusBadge)<{ $status: string }>`
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
`;

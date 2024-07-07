import { FC } from 'react';
import styled from 'styled-components';

import { CSCommonTableActions, HiddenMDTableCell, HiddenSMTableCell, HiddenXSTableCell, TableCell, TableRow } from '@/components/cs-common';
import { Env } from '@/core';
import { formatDate, uppercaseFirstLetter, RentalStatus } from '@/helpers';
import { observer } from 'mobx-react-lite';
import { RentalType } from '@/app/models';
import { device } from '@/styles';
import { FaCar, FaInfoCircle } from 'react-icons/fa';

type Props = {
  rental: RentalType;
  index: number;
  onCarReturn: () => Promise<void>
};

export const CSMainRentalHistoryTableRow: FC<Props> = observer(({
  rental,
  index,
  onCarReturn
}) => {
  const actions = [
    {
      label: 'Details',
      icon: <FaInfoCircle />,
      to: `/rental-history/${rental.id}`,
    },
    ...(rental.status === RentalStatus.ACTIVE ? [{
      label: 'Return',
      icon: <FaCar />,
      onClick: onCarReturn,
    }] : [])
  ];

  return (
    <TableRow key={rental.id}>
      <TableCell>{index + 1}</TableCell>
      <HiddenMDTableCell>
        <img src={`${Env.API_BASE_URL}/local-files/${rental.originalCar?.pictures?.[0]?.id}`} alt="Car Image" />
      </HiddenMDTableCell>
      <TableCell>{rental.originalCar?.model}</TableCell>
      <HiddenXSTableCell>{rental.requestedHours}</HiddenXSTableCell>
      <HiddenSMTableCell>{rental.totalPrice}</HiddenSMTableCell>
      <HiddenSMTableCell>
        {formatDate(rental.rentalStart)}
      </HiddenSMTableCell>
      <HiddenSMTableCell>{rental.rentalEnd ? formatDate(rental.rentalEnd) : '-'}</HiddenSMTableCell>
      <TableCell>
        <StatusBadge $status={rental.status as RentalStatus}>{uppercaseFirstLetter(rental.status)}</StatusBadge>
      </TableCell>
      <ActionsCell>
        <CSCommonTableActions actions={actions} />
      </ActionsCell>
    </TableRow >
  );
});

const ActionsCell = styled(TableCell)`
  position: relative;
`;

const StatusBadge = styled.div<{ $status: RentalStatus }>`
  width: 100%;
  display: inline-block;
  padding: 6px 10px;
  border-radius: 5px;
  font-size: 12px;
  font-weight: bold;
  text-align: center;
  text-transform: capitalize;

   color: ${(props): string => {
    switch (props.$status) {
      case RentalStatus.ACTIVE:
        return 'var(--green-status-text)';
      case RentalStatus.CLOSED:
        return 'var(--yellow-status-text)';
      case RentalStatus.CANCELLED:
        return 'var(--red-status-text)';
      default:
        return 'var(--default-text)';
    }
  }};
  background-color: ${(props): string => {
    switch (props.$status) {
      case RentalStatus.ACTIVE:
        return 'var(--green-status-bg)';
      case RentalStatus.CLOSED:
        return 'var(--yellow-status-bg)';
      case RentalStatus.CANCELLED:
        return 'var(--red-status-bg)';
      default:
        return 'var(--default-bg)';
    }
  }};
  border: 2px solid
    ${(props): string => {
    switch (props.$status) {
      case RentalStatus.ACTIVE:
        return 'var(--green-status-border)';
      case RentalStatus.CLOSED:
        return 'var(--yellow-status-border)';
      case RentalStatus.CANCELLED:
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
    padding: 2px 6px;
  }

  @media ${device.xs} {
    font-size: 8px;
    padding: 2px 4px;
  }
`;

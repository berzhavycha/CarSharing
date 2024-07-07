import { FC } from 'react';
import styled from 'styled-components';

import { CSCommonRentalStatusBadge, CSCommonTableActions, HiddenMDTableCell, HiddenSMTableCell, HiddenXSTableCell, TableCell, TableRow } from '@/components/cs-common';
import { Env } from '@/core';
import { formatDate, uppercaseFirstLetter, RentalStatus } from '@/helpers';
import { observer } from 'mobx-react-lite';
import { RentalType } from '@/app/models';
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
        <CSCommonRentalStatusBadge $status={rental.status as RentalStatus}>{uppercaseFirstLetter(rental.status)}</CSCommonRentalStatusBadge>
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



import { observer } from 'mobx-react-lite';
import { FC } from 'react';
import { FaCar, FaInfoCircle } from 'react-icons/fa';
import styled from 'styled-components';

import { RentalType } from '@/app/models';
import {
  CSCommonRentalStatusBadge,
  CSCommonTableActions,
  HiddenMDTableCell,
  HiddenSMTableCell,
  HiddenXSTableCell,
  TableCell,
  TableRow,
} from '@/components/cs-common';
import { formatDate, RentalStatus, uppercaseFirstLetter } from '@/helpers';
import { cld } from '@/app/cloudinary';
import { AdvancedImage, lazyload, placeholder } from '@cloudinary/react';
import { Quality } from '@cloudinary/url-gen/qualifiers';

type Props = {
  rental: RentalType;
  index: number;
  onCarReturn: () => void;
};

export const CSMainRentalHistoryTableRow: FC<Props> = observer(({ rental, index, onCarReturn }) => {
  const actions = [
    {
      label: 'Details',
      icon: <FaInfoCircle />,
      to: `/rental-history/${rental.id}`,
    },
    ...(rental.status === RentalStatus.ACTIVE
      ? [
        {
          label: 'Return',
          icon: <FaCar />,
          onClick: onCarReturn,
        },
      ]
      : []),
  ];

  const cloudinaryImage = cld.image(rental.originalCar.pictures[0].publicId).quality(Quality.auto())


  return (
    <TableRow key={rental.id}>
      <TableCell>{index + 1}</TableCell>
      <HiddenMDTableCell>
        <AdvancedImage
          cldImg={cloudinaryImage}
          plugins={[lazyload(), placeholder({ mode: 'blur' })]}
          alt={rental.originalCar.model}
        />
      </HiddenMDTableCell>
      <TableCell>{rental.originalCar?.model}</TableCell>
      <HiddenXSTableCell>{rental.requestedHours}</HiddenXSTableCell>
      <HiddenSMTableCell>{rental.totalPrice}</HiddenSMTableCell>
      <HiddenSMTableCell>{formatDate(rental.rentalStart)}</HiddenSMTableCell>
      <HiddenSMTableCell>{rental.rentalEnd ? formatDate(rental.rentalEnd) : '-'}</HiddenSMTableCell>
      <TableCell>
        <CSCommonRentalStatusBadge $status={rental.status}>
          {uppercaseFirstLetter(rental.status)}
        </CSCommonRentalStatusBadge>
      </TableCell>
      <ActionsCell>
        <CSCommonTableActions actions={actions} />
      </ActionsCell>
    </TableRow>
  );
});

const ActionsCell = styled(TableCell)`
  position: relative;
`;

import { observer } from 'mobx-react-lite';
import { FC, useEffect } from 'react';

import {
  CSCommonError,
  CSCommonNoData,
  HiddenMDTableHeader,
  HiddenSMTableHeader,
  HiddenXSTableHeader,
  Table,
  TableHeader,
} from '@/components/cs-common';
import { useStore } from '@/context';
import { Rental } from '@/types';

import { CSMainRentalHistoryModals } from './cs-main-rental-history-modals';
import { CSMainRentalHistoryTableRow } from './cs-main-rental-history-table-row';
import { useRentals } from './hooks';

type Props = {
  loadedRentals: Rental[];
  onSortChange: (sort: string) => void;
};

export const CSMainRentalHistoryTable: FC<Props> = observer(({ loadedRentals, onSortChange }) => {
  const { rentalStore } = useStore();
  const { rentals, setRentals, returnCar, errorMessage } = rentalStore;
  const { refetchRentals } = useRentals();

  useEffect(() => {
    setRentals(loadedRentals);
  }, [loadedRentals]);

  const handleReturnCar = async (id: string): Promise<void> => {
    await returnCar(id);
    await refetchRentals();
  };

  const displayedRentals = rentals ?? loadedRentals;

  return (
    <>
      {errorMessage ? <CSCommonError errorMessage={errorMessage} /> : (
        <Table>
          <thead>
            <tr>
              <TableHeader style={{ width: '1%' }}>No.</TableHeader>
              <HiddenMDTableHeader style={{ width: '8%' }}>Image</HiddenMDTableHeader>
              <TableHeader style={{ width: '15%' }}>Model</TableHeader>
              <HiddenXSTableHeader
                style={{ width: '4%' }}
                onClick={() => onSortChange('requestedHours')}
              >
                Hours
              </HiddenXSTableHeader>
              <HiddenSMTableHeader style={{ width: '8%' }} onClick={() => onSortChange('totalPrice')}>
                Total Price
              </HiddenSMTableHeader>
              <HiddenSMTableHeader
                style={{ width: '10%' }}
                onClick={() => onSortChange('rentalStart')}
              >
                Start Time
              </HiddenSMTableHeader>
              <HiddenSMTableHeader style={{ width: '10%' }} onClick={() => onSortChange('rentalEnd')}>
                End Time
              </HiddenSMTableHeader>
              <TableHeader style={{ width: '8%' }} onClick={() => onSortChange('status')}>
                Status
              </TableHeader>
              <TableHeader style={{ width: '6%' }}>Actions</TableHeader>
            </tr>
          </thead>
          <tbody>
            {displayedRentals.length === 0 ? (
              <tr>
                <td colSpan={8}>
                  <CSCommonNoData message="No history available" />
                </td>
              </tr>
            ) : (
              displayedRentals.map((rental, index) => (
                <CSMainRentalHistoryTableRow
                  key={rental.id}
                  index={index}
                  rental={rental}
                  onCarReturn={() => handleReturnCar(rental.id)}
                />
              ))
            )}
          </tbody>
        </Table>
      )}

      <CSMainRentalHistoryModals />
    </>
  );
});

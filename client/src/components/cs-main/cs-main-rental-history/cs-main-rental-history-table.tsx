import { observer } from 'mobx-react-lite';
import { FC, useEffect } from 'react';

import {
  CSCommonError,
  CSCommonNoData,
  HiddenMDTableHeader,
  HiddenSMTableHeader,
  HiddenXSTableHeader,
  SortIcon,
  Table,
  TableHeader,
} from '@/components/cs-common';
import { useStore } from '@/context';
import { RentalReturnOrigin } from '@/helpers';
import { useSortColumn } from '@/hooks';
import { Rental } from '@/types';

import { CSMainRentalHistoryModals } from './cs-main-rental-history-modals';
import { CSMainRentalHistoryTableRow } from './cs-main-rental-history-table-row';

type Props = {
  loadedRentals: Rental[];
  onSortChange: (sort: string) => void;
};

export const CSMainRentalHistoryTable: FC<Props> = observer(({ loadedRentals, onSortChange }) => {
  const {
    rentalListStore: { setRentals, rentals, errorMessage },
    carReturnStore,
  } = useStore();

  const { handleSortChange, renderSortIcon } = useSortColumn(onSortChange);

  useEffect(() => {
    setRentals(loadedRentals);
  }, [loadedRentals]);

  const displayedRentals = rentals ?? loadedRentals;

  return (
    <>
      {errorMessage ? (
        <CSCommonError errorMessage={errorMessage} />
      ) : (
        <Table>
          <thead>
            <tr>
              <TableHeader style={{ width: '1%' }}>No.</TableHeader>
              <HiddenMDTableHeader style={{ width: '8%' }}>Image</HiddenMDTableHeader>
              <TableHeader style={{ width: '15%' }}>Model</TableHeader>
              <HiddenXSTableHeader
                style={{ width: '4%' }}
                onClick={() => handleSortChange('requestedHours')}
              >
                Hours<SortIcon>{renderSortIcon('requestedHours')}</SortIcon>
              </HiddenXSTableHeader>
              <HiddenSMTableHeader
                style={{ width: '8%' }}
                onClick={() => handleSortChange('totalPrice')}
              >
                Total Price<SortIcon>{renderSortIcon('totalPrice')}</SortIcon>
              </HiddenSMTableHeader>
              <HiddenSMTableHeader
                style={{ width: '10%' }}
                onClick={() => handleSortChange('rentalStart')}
              >
                Start Time<SortIcon>{renderSortIcon('rentalStart')}</SortIcon>
              </HiddenSMTableHeader>
              <HiddenSMTableHeader
                style={{ width: '10%' }}
                onClick={() => handleSortChange('rentalEnd')}
              >
                End Time<SortIcon>{renderSortIcon('rentalEnd')}</SortIcon>
              </HiddenSMTableHeader>
              <TableHeader style={{ width: '8%' }} onClick={() => handleSortChange('status')}>
                Status<SortIcon>{renderSortIcon('status')}</SortIcon>
              </TableHeader>
              <TableHeader style={{ width: '6%' }}>Actions</TableHeader>
            </tr>
          </thead>
          <tbody>
            {displayedRentals.length === 0 ? (
              <tr>
                <td colSpan={10}>
                  <CSCommonNoData message="No history available" />
                </td>
              </tr>
            ) : (
              displayedRentals.map((rental, index) => {
                const onCarReturn = (): void => {
                  carReturnStore.setRentalToReturn(rental);
                  carReturnStore.setOrigin(RentalReturnOrigin.TABLE);
                };

                return (
                  <CSMainRentalHistoryTableRow
                    key={rental.id}
                    index={index}
                    rental={rental}
                    onCarReturn={onCarReturn}
                  />
                );
              })
            )}
          </tbody>
        </Table>
      )}

      <CSMainRentalHistoryModals />
    </>
  );
});

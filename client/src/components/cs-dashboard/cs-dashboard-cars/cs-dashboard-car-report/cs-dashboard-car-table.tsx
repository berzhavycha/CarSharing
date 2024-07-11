import { FC, useEffect } from 'react';

import {
  CSCommonModal,
  CSCommonNoData,
  HiddenMDTableHeader,
  HiddenSMTableHeader,
  HiddenXSTableHeader,
  SortIcon,
  Table,
  TableHeader,
} from '@/components/cs-common';
import { Car } from '@/types';

import { CSDashboardCarTableRow } from './cs-dashboard-car-table-row';
import { useCarRemoval } from './hooks';
import { useSortColumn } from '@/hooks';

type CarTableProps = {
  cars: Car[];
  onSortChange: (sort: string) => void;
};

export const CSDashboardCarTable: FC<CarTableProps> = ({ cars, onSortChange }) => {
  const {
    carList,
    setCarList,
    carToRemove,
    setCarToRemove,
    errorMessage,
    setErrorMessage,
    handleRemoveCar,
  } = useCarRemoval(cars);

  const { sortState, setSortState, renderSortIcon } = useSortColumn()
  
  useEffect(() => {
    setCarList(cars);
  }, [cars]);
  
  const handleSortChange = (sort: string): void => {
    const direction = sortState.sort === sort && sortState.direction === 'asc' ? 'desc' : 'asc';
    setSortState({ sort, direction });
    onSortChange(sort);
  };
  
  const onCloseConfirmWindow = (): void => setCarToRemove(null);
  const onCloseErrorWindow = (): void => setErrorMessage(null);

  return (
    <>
      <Table>
        <thead>
          <tr>
            <TableHeader style={{ width: '2%' }}>No.</TableHeader>
            <HiddenXSTableHeader style={{ width: '10%' }}>Image</HiddenXSTableHeader>
            <TableHeader style={{ width: '15%' }} onClick={() => handleSortChange('model')}>
              Model<SortIcon>{renderSortIcon('model')}</SortIcon>
            </TableHeader>
            <HiddenMDTableHeader style={{ width: '10%' }} onClick={() => handleSortChange('year')}>
              Year<SortIcon>{renderSortIcon('year')}</SortIcon>
            </HiddenMDTableHeader>
            <TableHeader style={{ width: '10%' }} onClick={() => handleSortChange('pricePerHour')}>
              Price / Hour<SortIcon>{renderSortIcon('pricePerHour')}</SortIcon>
            </TableHeader>
            <HiddenMDTableHeader style={{ width: '8%' }} onClick={() => handleSortChange('type')}>
              Type<SortIcon>{renderSortIcon('type')}</SortIcon>
            </HiddenMDTableHeader>
            <HiddenSMTableHeader style={{ width: '10%' }} onClick={() => handleSortChange('status')}>
              Status<SortIcon>{renderSortIcon('status')}</SortIcon>
            </HiddenSMTableHeader>
            <TableHeader style={{ width: '4%' }}>Actions</TableHeader>
          </tr>
        </thead>
        <tbody>
          {carList.length === 0 ? (
            <tr>
              <td colSpan={8}>
                <CSCommonNoData message="No cars available" />
              </td>
            </tr>
          ) : (
            carList.map((car, index) => (
              <CSDashboardCarTableRow
                key={car.id}
                car={car}
                index={index}
                onRemoveClick={setCarToRemove}
              />
            ))
          )}
        </tbody>
      </Table>

      {carToRemove && (
        <CSCommonModal
          type="warning"
          title="Confirm Deletion"
          message={`Are you sure you want to remove the car: ${carToRemove.model}?`}
          onClose={onCloseConfirmWindow}
          onOk={handleRemoveCar}
          onCancel={onCloseConfirmWindow}
        />
      )}

      {errorMessage && (
        <CSCommonModal
          type="error"
          title="Error"
          message={errorMessage}
          onClose={onCloseErrorWindow}
        />
      )}
    </>
  );
};

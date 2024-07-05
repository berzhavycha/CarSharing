import { FC, useEffect } from 'react';

import { CSCommonModal, CSCommonNoData, HiddenMDTableHeader, HiddenSMTableHeader, HiddenXSTableHeader, Table, TableHeader } from '@/components/cs-common';
import { Car } from '@/types';

import { CSDashboardCarTableRow } from './cs-dashboard-car-table-row';
import { useCarRemoval } from './hooks';

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

  useEffect(() => {
    setCarList(cars);
  }, [cars]);

  const onCloseConfirmWindow = (): void => setCarToRemove(null);
  const onCloseErrorWindow = (): void => setErrorMessage(null);

  return (
    <>
      <Table>
        <thead>
          <tr>
            <TableHeader style={{ width: '2%' }}>No.</TableHeader>
            <HiddenXSTableHeader style={{ width: '10%' }}>Image</HiddenXSTableHeader>
            <TableHeader style={{ width: '15%' }} onClick={() => onSortChange('model')}>
              Model
            </TableHeader>
            <HiddenMDTableHeader style={{ width: '10%' }} onClick={() => onSortChange('year')}>
              Year
            </HiddenMDTableHeader>
            <TableHeader style={{ width: '10%' }} onClick={() => onSortChange('pricePerHour')}>
              Price / Hour
            </TableHeader>
            <HiddenMDTableHeader style={{ width: '8%' }} onClick={() => onSortChange('type')}>
              Type
            </HiddenMDTableHeader>
            <HiddenSMTableHeader style={{ width: '10%' }} onClick={() => onSortChange('status')}>
              Status
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

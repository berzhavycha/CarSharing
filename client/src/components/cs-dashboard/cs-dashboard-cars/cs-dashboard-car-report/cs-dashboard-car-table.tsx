import { FC, useEffect } from 'react';

import { CSCommonModal, CSCommonNoData, Table, TableHeader } from '@/components/cs-common';
import { Car } from '@/types';

import { CSDashboardCarTableRow } from './cs-dashboard-car-table-row';
import { useCarRemoval } from './hooks';
import { device } from '@/styles';
import styled from 'styled-components';

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
            <HideOnXSScreen>
              <TableHeader style={{ width: '10%' }}>Image</TableHeader>
            </HideOnXSScreen>
            <TableHeader style={{ width: '15%' }} onClick={() => onSortChange('model')}>
              Model
            </TableHeader>
            <HideOnMDScreen>
              <TableHeader style={{ width: '10%' }} onClick={() => onSortChange('year')}>
                Year
              </TableHeader>
            </HideOnMDScreen>
            <TableHeader style={{ width: '10%' }} onClick={() => onSortChange('pricePerHour')}>
              Price / Hour
            </TableHeader>
            <HideOnMDScreen>
              <TableHeader style={{ width: '8%' }} onClick={() => onSortChange('type')}>
                Type
              </TableHeader>
            </HideOnMDScreen>
            <HideOnSMScreen>
              <TableHeader style={{ width: '10%' }} onClick={() => onSortChange('status')}>
                Status
              </TableHeader>
            </HideOnSMScreen>
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

export const HideOnMDScreen = styled.div`
  display: contents;

  @media ${device.md} {
    display: none;
  }
`;


export const HideOnSMScreen = styled.div`
  display: contents;

  @media ${device.sm} {
    display: none;
  }
`;

export const HideOnXSScreen = styled.div`
  display: contents;

  @media ${device.xs} {
    display: none;
  }
`;

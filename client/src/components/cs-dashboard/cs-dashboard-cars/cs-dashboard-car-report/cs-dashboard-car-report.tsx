import { FC, useEffect, useState } from 'react';
import styled from 'styled-components';
import { useNavigate, useSearchParams } from 'react-router-dom';
import DefaultImage from '../../../../../public/Car.png';
import { CSCommonPrimaryButton, CSCommonSearchBar } from '@/components/cs-common';
import { Car } from '@/types';
import { fetchCars } from '@/services/cars/fetch-cars';
import { uppercaseFirstLetter } from '@/helpers';

export const CSDashboardCarReport: FC = () => {
  const navigate = useNavigate();
  const [cars, setCars] = useState<Car[]>([]);
  const [searchParams, setSearchParams] = useSearchParams();

  const fetchAndSetCars = async () => {
    const page = searchParams.get('page') || 1;
    const limit = searchParams.get('limit') || 10;

    const queryCarsDto = { page: Number(page), limit: Number(limit) };
    const data = await fetchCars(queryCarsDto);
    setCars(data.cars);
  };

  useEffect(() => {
    fetchAndSetCars();
  }, [searchParams]);

  const onDetailsBtnClick = (car: Car): void => navigate('/dashboard/edit-car', { state: { car } });
  const onAddBtnClick = (): void => navigate('/dashboard/add-car');
  const onPageChange = (newPage: number) => setSearchParams({ page: String(newPage) });

  return (
    <CarsContainer>
      <ContentContainer>
        <Header>
          <h3>Cars</h3>
          <CSCommonSearchBar search={''} onSearchChange={function (text: string): void {
            throw new Error('Function not implemented.');
          }} />
          <CSCommonPrimaryButton onClick={onAddBtnClick} content='Add Car' />
        </Header>
        <Table>
          <thead>
            <tr>
              <TableHeader>No.</TableHeader>
              <TableHeader>Image</TableHeader>
              <TableHeader>Model</TableHeader>
              <TableHeader>Year</TableHeader>
              <TableHeader>Price / Hour</TableHeader>
              <TableHeader>Type</TableHeader>
              <TableHeader>Status</TableHeader>
              <TableHeader>Actions</TableHeader>
            </tr>
          </thead>
          <tbody>
            {cars.map((car, index) => (
              <TableRow key={car.id}>
                <TableCell>{index + 1}</TableCell>
                <TableCell><img src={DefaultImage} /></TableCell>
                <TableCell>{car.model}</TableCell>
                <TableCell>{car.year}</TableCell>
                <TableCell>$ {car.pricePerHour}</TableCell>
                <TableCell>{car.type}</TableCell>
                <TableCell>
                  <StatusBadge status={car.status}>{uppercaseFirstLetter(car.status)}</StatusBadge>
                </TableCell>
                <TableCell>
                  <Button onClick={() => onDetailsBtnClick(car)}>Details</Button>
                  <Button>Remove</Button>
                </TableCell>
              </TableRow>
            ))}
          </tbody>
        </Table>
        <Pagination>
          <Button onClick={() => onPageChange(Math.max(1, Number(searchParams.get('page')) - 1))}>Previous</Button>
          <Button onClick={() => onPageChange(Number(searchParams.get('page')) + 1)}>Next</Button>
        </Pagination>
      </ContentContainer>
    </CarsContainer>
  );
};

const Pagination = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 20px;
`;

const CarsContainer = styled.div`
  width: 100%;
  max-height: 100vh;
`;

const Header = styled.div`
  width: 100%;
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  margin-bottom: 30px;
`;

const ContentContainer = styled.div`
  padding: 30px;
  background-color: white;
  margin: 20px;
  border-radius: 10px;
  box-shadow: var(--default-box-shadow);
  height: 94%;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
`;

const TableHeader = styled.th`
  text-align: left;
  padding: 12px;
  background-color: #f8f9fa;
  border-bottom: 2px solid #dee2e6;
`;

const TableRow = styled.tr`
  &:nth-child(even) {
    background-color: #f8f9fa;
  }
`;

const TableCell = styled.td`
  padding: 12px;
  border-bottom: 1px solid #dee2e6;

  img {
    width: 80px;
    height: 50px;
    object-fit: contain;
    border-radius: 50%;
  }
`;

type StatusBadgeProps = {
  status: string;
}

const StatusBadge = styled.div<StatusBadgeProps>`
  width: 100%;
  background: none;
  text-align: center;
  padding: 10px 8px;
  border-radius: 5px;
  font-size: 12px;
  font-weight: bold;
  border: 1px solid;
  color: ${(props): string =>
    props.status === 'available'
      ? '#6c757d'
      : props.status === 'booked'
        ? '#dc3545'
        : '#007bff'};
  border-color: ${(props): string =>
    props.status === 'available'
      ? '#6c757d'
      : props.status === 'booked'
        ? '#dc3545'
        : '#007bff'};
`;

const Button = styled.button`
  padding: 6px 12px;
  border: none;
  border-radius: 4px;
  background-color: #007bff;
  color: white;
  cursor: pointer;
  margin-right: 5px;

  &:hover {
    background-color: #0056b3;
  }
`;

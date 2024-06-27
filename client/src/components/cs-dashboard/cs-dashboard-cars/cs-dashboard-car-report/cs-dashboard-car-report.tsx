import { FC, useEffect, useState } from 'react';
import styled from 'styled-components';
import { useNavigate, useSearchParams } from 'react-router-dom';
import DefaultImage from '../../../../../public/Car.png';
import { CSCommonPrimaryButton, CSCommonSearchBar } from '@/components/cs-common';
import { Car } from '@/types';
import { fetchCars } from '@/services/cars/fetch-cars';
import { uppercaseFirstLetter } from '@/helpers';
import { Order } from '@/types/pagination';

export const CSDashboardCarReport: FC = () => {
  const navigate = useNavigate();
  const [cars, setCars] = useState<Car[]>([]);
  const [searchParams, setSearchParams] = useSearchParams();
  const [totalPages, setTotalPages] = useState<number>(1);

  useEffect(() => {
    const page = searchParams.get('page') || '1';
    const limit = searchParams.get('limit') || '10';
    const search = searchParams.get('search') || '';
    const sort = searchParams.get('sort') || '';
    const order = (searchParams.get('order')?.toUpperCase() as Order) || 'ASC';

    if (!searchParams.get('page') || !searchParams.get('limit') || !searchParams.get('order')) {
      setSearchParams({ page, limit, search, sort, order });
    } else {
      fetchAndSetCars();
    }
  }, [searchParams]);

  const fetchAndSetCars = async (): Promise<void> => {
    const page = searchParams.get('page') || 1;
    const limit = searchParams.get('limit') || 10;
    const search = searchParams.get('search') || '';
    const sort = searchParams.get('sort') || '';
    const order = (searchParams.get('order')?.toUpperCase() as Order) || 'ASC';

    const queryCarsDto = {
      page: Number(page),
      limit: Number(limit),
      search,
      sort,
      order,
    };

    const data = await fetchCars(queryCarsDto);
    setCars(data.cars);
    setTotalPages(Math.ceil(data.total / Number(limit))); 
  };

  useEffect(() => {
    fetchAndSetCars();
  }, [searchParams]);

  const onDetailsBtnClick = (car: Car): void => navigate('/dashboard/edit-car', { state: { car } });
  const onAddBtnClick = (): void => navigate('/dashboard/add-car');
  const onPageChange = (newPage: number): void => setSearchParams({ ...Object.fromEntries(searchParams.entries()), page: String(newPage) });
  const onSearchChange = (search: string): void => setSearchParams({ ...Object.fromEntries(searchParams.entries()), search, page: '1' }); // Reset to page 1 on new search
  const onSortChange = (sort: string): void => {
    const currentOrder = searchParams.get('order') || 'ASC';
    const newOrder = currentOrder === 'ASC' ? 'DESC' : 'ASC';
    setSearchParams({ ...Object.fromEntries(searchParams.entries()), sort, order: newOrder, page: '1' }); // Reset to page 1 on new sort
  };

  return (
    <CarsContainer>
      <ContentContainer>
        <Header>
          <h3>Cars</h3>
          <CSCommonSearchBar search={searchParams.get('search') || ''} onSearchChange={onSearchChange} />
          <CSCommonPrimaryButton onClick={onAddBtnClick} content='Add Car' />
        </Header>
        <Table>
          <thead>
            <tr>
              <TableHeader>No.</TableHeader>
              <TableHeader>Image</TableHeader>
              <TableHeader onClick={() => onSortChange('model')}>Model</TableHeader>
              <TableHeader onClick={() => onSortChange('year')}>Year</TableHeader>
              <TableHeader onClick={() => onSortChange('pricePerHour')}>Price / Hour</TableHeader>
              <TableHeader onClick={() => onSortChange('type')}>Type</TableHeader>
              <TableHeader onClick={() => onSortChange('status')}>Status</TableHeader>
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
          {Array.from({ length: totalPages }, (_, i) => (
            <PageButton
              key={i + 1}
              active={Number(searchParams.get('page')) === i + 1}
              onClick={() => onPageChange(i + 1)}
            >
              {i + 1}
            </PageButton>
          ))}
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

const PageButton = styled.button<{ active: boolean }>`
  padding: 6px 12px;
  border: none;
  border-radius: 4px;
  background-color: ${({ active }): string => (active ? '#007bff' : '#e0e0e0')};
  color: ${({ active }): string => (active ? 'white' : 'black')};
  cursor: pointer;
  margin: 0 5px;

  &:hover {
    background-color: #0056b3;
    color: white;
  }
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
  cursor: pointer;
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
};

const StatusBadge = styled.div<StatusBadgeProps>`
  display: inline-block;
  width: 100%;
  padding: 6px 10px;
  border-radius: 5px;
  font-size: 12px;
  font-weight: bold;
  text-align: center;
  color: ${(props): string =>
    props.status === 'available' ? '#28a745' : '#dc3545'};
  background-color: ${(props): string =>
    props.status === 'available' ? '#d4edda' : '#f8d7da'};
  border: 2px solid ${(props): string =>
    props.status === 'available' ? '#c3e6cb' : '#f5c6cb'};
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

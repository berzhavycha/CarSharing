import { FC } from 'react';
import { useLoaderData, useNavigate } from 'react-router-dom';
import styled from 'styled-components';

import { CSCommonPrimaryButton, CSCommonSearchBar, Pagination } from '@/components/cs-common';
import { Env } from '@/core';
import { DEFAULT_PAGINATION_PAGE, OrderOptions } from '@/helpers';
import { useSearchParamsWithDefaults } from '@/hooks';
import { Car } from '@/types';

import { CarTable } from './cs-dashboard-car-table';
import { LoaderData } from './loader';

const defaultSearchParams = {
  page: DEFAULT_PAGINATION_PAGE,
  limit: Env.ADMIN_CARS_PAGINATION_LIMIT,
  search: '',
  sort: '',
  order: OrderOptions.ASC,
};

export const CSDashboardCarReport: FC = () => {
  const navigate = useNavigate();
  const { cars, totalPages } = useLoaderData() as LoaderData;
  const { searchParams, setParams } = useSearchParamsWithDefaults(defaultSearchParams);

  const onDetailsBtnClick = (car: Car): void => navigate('/dashboard/edit-car', { state: { car } });
  const onAddBtnClick = (): void => navigate('/dashboard/add-car');
  const onPageChange = (newPage: number): void => setParams({ page: String(newPage) });
  const onSearchChange = (search: string): void => setParams({ search, page: '1' });
  const onSortChange = (sort: string): void => {
    const currentOrder = searchParams.get('order') || OrderOptions.ASC;
    const newOrder = currentOrder === OrderOptions.ASC ? OrderOptions.DESC : OrderOptions.ASC;
    setParams({ sort, order: newOrder, page: '1' });
  };

  return (
    <CarsContainer>
      <ContentContainer>
        <Header>
          <h3>Cars</h3>
          <CSCommonSearchBar
            search={searchParams.get('search') || ''}
            onSearchChange={onSearchChange}
          />
          <CSCommonPrimaryButton onClick={onAddBtnClick} content="Add Car" />
        </Header>
        <CarTable cars={cars} onDetailsBtnClick={onDetailsBtnClick} onSortChange={onSortChange} />
        <Pagination
          totalPages={totalPages}
          currentPage={Number(searchParams.get('page')) || 1}
          onPageChange={onPageChange}
        />
      </ContentContainer>
    </CarsContainer>
  );
};

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

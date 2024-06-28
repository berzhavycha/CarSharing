import { FC, Suspense } from 'react';
import { Await, useLoaderData, useNavigate } from 'react-router-dom';
import styled from 'styled-components';

import {
  CSCommonError,
  CSCommonPrimaryButton,
  CSCommonSearchBar,
  CSCommonSpinner,
  Pagination,
} from '@/components/cs-common';
import { Env } from '@/core';
import { DEFAULT_PAGINATION_PAGE, OrderOptions, UNEXPECTED_ERROR_MESSAGE } from '@/helpers';
import { useSearchParamsWithDefaults } from '@/hooks';

import { CSDashboardCarTable } from './cs-dashboard-car-table';
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
  const data = useLoaderData() as { data: LoaderData };
  const { searchParams, setParams } = useSearchParamsWithDefaults(defaultSearchParams);

  const onAddBtnClick = (): void => navigate('/dashboard/add-car');
  const onPageChange = (newPage: number): void => setParams({ page: String(newPage) });
  const onSearchChange = (search: string): void => setParams({ search, page: '1' });
  const onSortChange = (sort: string): void => {
    const currentOrder = searchParams.get('order') ?? OrderOptions.ASC;
    const newOrder = currentOrder === OrderOptions.ASC ? OrderOptions.DESC : OrderOptions.ASC;
    setParams({ sort, order: newOrder, page: '1' });
  };

  return (
    <CarsContainer>
      <ContentContainer>
        <Header>
          <h3>Cars</h3>
          <CSCommonSearchBar
            search={searchParams.get('search') ?? ''}
            onSearchChange={onSearchChange}
            placeholder="Search by model name"
          />
          <CSCommonPrimaryButton onClick={onAddBtnClick} content="Add Car" />
        </Header>
        <Suspense fallback={<CSCommonSpinner />}>
          <Await
            resolve={data.data}
            errorElement={<CSCommonError errorMessage={UNEXPECTED_ERROR_MESSAGE} />}
          >
            {(data) => (
              <>
                <CSDashboardCarTable cars={data.cars} onSortChange={onSortChange} />
                <Pagination
                  totalPages={Math.ceil(
                    data.total /
                    Number(searchParams.get('limit') ?? Env.ADMIN_CARS_PAGINATION_LIMIT),
                  )}
                  currentPage={Number(searchParams.get('page')) || +DEFAULT_PAGINATION_PAGE}
                  onPageChange={onPageChange}
                />
              </>
            )}
          </Await>
        </Suspense>
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

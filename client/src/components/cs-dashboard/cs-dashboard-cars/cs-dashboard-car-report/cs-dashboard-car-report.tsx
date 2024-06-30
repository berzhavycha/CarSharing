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
import { usePagination, useSearchParamsWithDefaults } from '@/hooks';

import { CSDashboardCarTable } from './cs-dashboard-car-table';
import { CarsLoaderData } from './loader';

const defaultSearchParams = {
  page: DEFAULT_PAGINATION_PAGE,
  limit: Env.ADMIN_CARS_PAGINATION_LIMIT,
  search: '',
  sort: '',
  order: OrderOptions.ASC,
};

export const CSDashboardCarReport: FC = () => {
  const navigate = useNavigate();
  const data = useLoaderData() as { data: CarsLoaderData };

  const { searchParams } = useSearchParamsWithDefaults(defaultSearchParams)
  const { onPageChange, onSearchChange, onSortChange } = usePagination(defaultSearchParams);

  const onAddBtnClick = (): void => navigate('/dashboard/add-car');
  
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
            {(data) => {
              const totalPages = Math.ceil(
                data.total /
                Number(searchParams.get('limit') ?? Env.ADMIN_CARS_PAGINATION_LIMIT),
              )

              return (
                <>
                  <CSDashboardCarTable cars={data.cars} onSortChange={onSortChange} />
                  {totalPages > 1 && (
                    <Pagination
                      totalPages={Math.ceil(
                        data.total /
                        Number(searchParams.get('limit') ?? Env.ADMIN_CARS_PAGINATION_LIMIT),
                      )}
                      currentPage={Number(searchParams.get('page')) || +DEFAULT_PAGINATION_PAGE}
                      onPageChange={onPageChange}
                    />
                  )}
                </>
              )
            }}
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

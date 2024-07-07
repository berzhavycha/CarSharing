import { ReactNode, Suspense } from 'react';
import { Await, useLoaderData } from 'react-router-dom';
import styled from 'styled-components';

import {
  CSCommonError,
  CSCommonSearchBar,
  CSCommonSpinner,
  Pagination,
} from '@/components/cs-common';
import { DEFAULT_PAGINATION_PAGE, defaultSearchParams, UNEXPECTED_ERROR_MESSAGE } from '@/helpers';
import { usePagination, useSearchParamsWithDefaults } from '@/hooks';
import { device } from '@/styles';

type Props<T> = {
  title: string;
  searchPlaceholder: string;
  defaultSearchParams: typeof defaultSearchParams;
  paginationLimit: string;
  renderTable: (data: T, onSortChange: (sort: string) => void) => ReactNode;
  extraHeaderContent?: ReactNode;
};

export const CSCommonTableList = <T,>({
  title,
  searchPlaceholder,
  defaultSearchParams,
  paginationLimit,
  renderTable,
  extraHeaderContent,
}: Props<T>): JSX.Element => {
  const data = useLoaderData() as { data: T };
  const { searchParams } = useSearchParamsWithDefaults(defaultSearchParams);
  const { onPageChange, onSearchChange, onSortChange } = usePagination(defaultSearchParams);

  return (
    <ListViewContainer>
      <ContentContainer>
        <Header>
          <h3>{title}</h3>
          <CSCommonSearchBar
            search={searchParams.get('search') ?? ''}
            onSearchChange={onSearchChange}
            placeholder={searchPlaceholder}
          />
          {extraHeaderContent}
        </Header>
        <Suspense fallback={<CSCommonSpinner />}>
          <Await
            resolve={data.data}
            errorElement={<CSCommonError errorMessage={UNEXPECTED_ERROR_MESSAGE} />}
          >
            {(resolvedData) => {
              const totalPages = Math.ceil(
                resolvedData.total / Number(searchParams.get('limit') ?? paginationLimit),
              );

              return (
                <>
                  {renderTable(resolvedData, onSortChange)}
                  {totalPages > 1 && (
                    <Pagination
                      totalPages={totalPages}
                      currentPage={Number(searchParams.get('page')) || +DEFAULT_PAGINATION_PAGE}
                      onPageChange={onPageChange}
                    />
                  )}
                </>
              );
            }}
          </Await>
        </Suspense>
      </ContentContainer>
    </ListViewContainer>
  );
};


const ListViewContainer = styled.div`
  width: 100%;
  min-height: 100vh;
`;

const Header = styled.div`
  width: 100%;
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  margin-bottom: 30px;

  @media ${device.lg} {
    h3{
      font-size: 16px;
    }
  }

  @media ${device.sm} {
    h3{
      display: none;
    }
  }
`;

const ContentContainer = styled.div`
  padding: 30px;
  background-color: white;
  margin: 20px;
  border-radius: 10px;
  box-shadow: var(--default-box-shadow);
  height: 94%;

  @media ${device.md} {
      padding: 20px;
  }

  @media ${device.sm} {
      padding: 15px;
  }
`;

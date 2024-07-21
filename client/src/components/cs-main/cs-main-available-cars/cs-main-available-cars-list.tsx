import { FC } from 'react';
import styled from 'styled-components';

import { CSCommonCarList, Pagination } from '@/components';
import { Env } from '@/core';
import { DEFAULT_PAGINATION_PAGE, defaultSearchParams } from '@/helpers';
import { usePagination, useSearchParamsWithDefaults } from '@/hooks';
import { AvailableCarsLoaderData } from '@/pages';
import { device } from '@/styles';

type Props = {
  data: AvailableCarsLoaderData['data']['carsData'];
};

export const CSMainAvailableCarsList: FC<Props> = ({ data }) => {
  const { searchParams } = useSearchParamsWithDefaults(defaultSearchParams);
  const { onPageChange } = usePagination(defaultSearchParams);

  const totalPages = Math.ceil(
    data.total / Number(searchParams.get('limit') ?? Env.USER_CARS_PAGINATION_LIMIT),
  );

  return (
    <CarsListContainer>
      <CarsWrapper $totalPages={totalPages}>
        <CSCommonCarList cars={data.cars} />
      </CarsWrapper>
      {totalPages > 1 && (
        <Pagination
          totalPages={totalPages}
          currentPage={Number(searchParams.get('page')) || +DEFAULT_PAGINATION_PAGE}
          onPageChange={onPageChange}
        />
      )}
    </CarsListContainer>
  );
};

const CarsListContainer = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  margin-bottom: 40px;
`;

const CarsWrapper = styled.div<{ $totalPages: number }>`
  display: grid;
  grid-template-columns: repeat(
    auto-fill,
    minmax(${(props): string => (!props.$totalPages ? '1fr' : '300px')}, 1fr)
  );
  gap: 1.25rem;
  margin: 40px;
  flex: 1;

  @media ${device.sm} {
    margin: 20px;
    width: auto;
  }
`;

import { FC } from 'react';
import styled from 'styled-components';

import { CSCommonCarList, Pagination } from '@/components';
import { DEFAULT_PAGINATION_PAGE, defaultSearchParams } from '@/helpers';
import { usePagination, useSearchParamsWithDefaults } from '@/hooks';
import { AvailableCarsLoaderData } from '@/pages';

type Props = {
  data: AvailableCarsLoaderData['carsData'];
};

export const CSMainAvailableCarsList: FC<Props> = ({ data }) => {
  const { searchParams } = useSearchParamsWithDefaults(defaultSearchParams);
  const { onPageChange } = usePagination(defaultSearchParams);

  const totalPages = Math.ceil(data.total / Number(searchParams.get('limit') ?? 6));
  return (
    <CarsWrapper>
      <CSCommonCarList cars={data.cars} />
      {totalPages > 1 && (
        <Pagination
          totalPages={totalPages}
          currentPage={Number(searchParams.get('page')) || +DEFAULT_PAGINATION_PAGE}
          onPageChange={onPageChange}
        />
      )}
    </CarsWrapper>
  );
};

const CarsWrapper = styled.div`
  width: 100%;
  display: flex;
  flex-wrap: wrap;
  gap: 40px;
  margin: 40px 8% 40px 0;
`;

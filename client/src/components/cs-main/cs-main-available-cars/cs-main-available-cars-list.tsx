import { FC } from 'react';

import { AvailableCarsLoaderData, CSInitialCarList, Pagination } from '@/components';

import styled from 'styled-components';
import { DEFAULT_PAGINATION_PAGE, defaultSearchParams } from '@/helpers';
import { usePagination, useSearchParamsWithDefaults } from '@/hooks';

type Props = {
    data: AvailableCarsLoaderData['carsData']
}

export const CSMainAvailableCarsList: FC<Props> = ({ data }) => {
    const { searchParams } = useSearchParamsWithDefaults(defaultSearchParams)
    const { onPageChange } = usePagination(defaultSearchParams);

    const totalPages = Math.ceil(
        data.total / Number(searchParams.get('limit') ?? 6),
    );
    return (
        <CarsWrapper>
            <CSInitialCarList cars={data.cars} />
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
  display: flex;
  flex-wrap: wrap;
  gap: 40px;
  margin: 40px 0;
`

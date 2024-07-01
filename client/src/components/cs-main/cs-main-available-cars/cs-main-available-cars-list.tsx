import { FC, Suspense } from 'react';

import { AvailableCarsLoaderData, CSCommonError, CSCommonSpinner, CSInitialCarList, Pagination } from '@/components';

import styled from 'styled-components';
import { Await } from 'react-router-dom';
import { DEFAULT_PAGINATION_PAGE, UNEXPECTED_ERROR_MESSAGE, defaultSearchParams } from '@/helpers';
import { usePagination, useSearchParamsWithDefaults } from '@/hooks';

type Props = {
    data: { data: AvailableCarsLoaderData }
}

export const CSMainAvailableCarsList: FC<Props> = ({ data }) => {
    const { searchParams } = useSearchParamsWithDefaults(defaultSearchParams)
    const { onPageChange } = usePagination(defaultSearchParams);

    return (
        <CarsWrapper>
            <Suspense fallback={<CSCommonSpinner />}>
                <Await
                    resolve={data.data}
                    errorElement={<CSCommonError errorMessage={UNEXPECTED_ERROR_MESSAGE} />}
                >
                    {(resolvedData) => {
                        const totalPages = Math.ceil(
                            resolvedData.total / Number(searchParams.get('limit') ?? 6),
                        );

                        return (
                            <>
                                <CSInitialCarList cars={resolvedData.cars} />
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
        </CarsWrapper>
    );
};



const CarsWrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 40px;
  margin-top: 40px;
`

import { FC } from 'react';

import { Env } from '@/core';
import { defaultSearchParams } from '@/helpers';
import { Rental } from '@/types';

import { CSCommonTableList } from '../../cs-common';
import { CSMainRentalHistoryTable } from './cs-main-rental-history-table';

const rentalsDefaultSearchParams = {
    ...defaultSearchParams,
    limit: Env.USER_RENTAL_HISTORY_PAGINATION_LIMIT,
};

type LoadedData = {
    rentals: Rental[];
    count: number;
};

export const CSMainRentalHistory: FC = () => {
    return (
        <CSCommonTableList<LoadedData>
            title="Rental History"
            searchPlaceholder="Search by car name"
            defaultSearchParams={rentalsDefaultSearchParams}
            paginationLimit={Env.USER_RENTAL_HISTORY_PAGINATION_LIMIT}
            renderTable={(data, onSortChange) => (
                <CSMainRentalHistoryTable
                    rentals={data.rentals}
                    onSortChange={onSortChange}
                />
            )}
        />
    );
};

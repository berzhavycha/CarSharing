import { FC, Suspense } from 'react';

import { CSDashboardCarForm } from './cs-dashboard-car-form';
import { updateCar } from '@/services';
import { LoaderData } from './loader';
import { Await, useLoaderData } from 'react-router-dom';
import { CSCommonSpinner, CSCommonError } from '@/components/cs-common';
import { UNEXPECTED_ERROR_MESSAGE } from '@/helpers';

export const CSDashboardCarEditForm: FC = () => {
    const data = useLoaderData() as { data: LoaderData };

    return (
        <Suspense fallback={<CSCommonSpinner />}>
            <Await
                resolve={data.data}
                errorElement={<CSCommonError errorMessage={UNEXPECTED_ERROR_MESSAGE} />}
            >
                {(data) => <CSDashboardCarForm carDefaultValues={data} onFormSubmit={updateCar} />}
            </Await>
        </Suspense>
    );
};


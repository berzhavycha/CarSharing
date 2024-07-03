import React, { Suspense } from 'react';
import { observer } from 'mobx-react-lite';
import styled from 'styled-components';
import { Env } from '@/core';
import { UNEXPECTED_ERROR_MESSAGE } from '@/helpers';
import { CSCommonContainer, CSCommonError, CSCommonSlides, CSCommonSpinner } from '@/components/cs-common';
import { LocalFile, Rental } from '@/types';
import { Await, useLoaderData } from 'react-router-dom';
import { CSMainSingleRentalDetails } from './cs-main-single-rental-details';

export const CSMainSingleRental: React.FC = observer(() => {
    const data = useLoaderData() as { data: Rental };

    return (
        <CSCommonContainer>
            <Suspense fallback={<CSCommonSpinner />}>
                <Await
                    resolve={data.data}
                    errorElement={<CSCommonError errorMessage={UNEXPECTED_ERROR_MESSAGE} />}
                >
                    {(rental) => {
                        const carImages = rental.originalCar?.pictures?.map(
                            (pic: LocalFile) => `${Env.API_BASE_URL}/local-files/${pic?.id}`,
                        );

                        return (
                            <RentalDetailsContainer>
                                <CSCommonSlides images={carImages} width='600px' height='300px' />
                                <CSMainSingleRentalDetails rental={rental} />
                            </RentalDetailsContainer>
                        );
                    }}
                </Await>
            </Suspense>
        </CSCommonContainer>
    );
});


const RentalDetailsContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 60px;
  margin: 50px 0;
`


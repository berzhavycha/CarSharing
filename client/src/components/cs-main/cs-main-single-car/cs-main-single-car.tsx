import { CSCommonBanner, CSCommonContainer, CSCommonError, CSCommonSpinner } from "@/components/cs-common";
import { Env } from "@/core";
import { UNEXPECTED_ERROR_MESSAGE } from "@/helpers";
import { Car } from "@/types";
import { FC, Suspense } from "react";
import { Await, useLoaderData } from "react-router-dom";

import BackgroundImage from '../../../../public/banner 1.png'
import styled from "styled-components";
import { CSMainSingleCarDetails } from "./cs-main-single-car-details";

export const CSMainSingleCar: FC = () => {
    const data = useLoaderData() as { data: Car }

    return (
        <CSCommonContainer>
            <SingleCarWrapper>
                <Suspense fallback={<CSCommonSpinner />}>
                    <Await
                        resolve={data.data}
                        errorElement={<CSCommonError errorMessage={UNEXPECTED_ERROR_MESSAGE} />}
                    >
                        {(car) => {
                            return (
                                <>
                                    <CSCommonBanner
                                        title="Car with the best design and acceleration"
                                        description="Safety and comfort while driving a futuristic and elegant car"
                                        image={`${Env.API_BASE_URL}/local-files/${car.pictures[0].id}`}
                                        backgroundImage={BackgroundImage}
                                    />
                                    <CSMainSingleCarDetails car={car}/>
                                </>
                            )
                        }}
                    </Await>
                </Suspense>
            </SingleCarWrapper>
        </CSCommonContainer>
    )
}

const SingleCarWrapper = styled.div`
    margin-top: 50px;
    display: flex;
    gap: 30px;
`
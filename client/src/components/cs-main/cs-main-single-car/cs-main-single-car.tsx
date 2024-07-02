import { CSCommonContainer, CSCommonError, CSCommonSpinner } from "@/components/cs-common";
import { Env } from "@/core";
import { UNEXPECTED_ERROR_MESSAGE } from "@/helpers";
import { Car, LocalFile } from "@/types";
import { FC, Suspense } from "react";
import { Await, useLoaderData } from "react-router-dom";

import styled from "styled-components";
import { CSMainSingleCarDetails } from "./cs-main-single-car-details";
import { SlideShow } from "@/components/cs-common/cs-common-slides/cs-common-slides";

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
                            const carImages = car.pictures.map((pic: LocalFile) => `${Env.API_BASE_URL}/local-files/${pic?.id}`)
                            return (
                                <>
                                    <SlideShow images={carImages} width="600px" height="270px" />
                                    <CSMainSingleCarDetails car={car} />
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
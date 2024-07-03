import { CSCommonContainer, CSCommonSlides } from "@/components/cs-common";
import { Env } from "@/core";
import { LocalFile } from "@/types";
import { FC } from "react";
import { useLocation } from "react-router-dom";
import styled from "styled-components";

export const CSMainSingleRental: FC = () => {
    const location = useLocation()

    const carImages = location.state?.rental?.originalCar.pictures.map((pic: LocalFile) => `${Env.API_BASE_URL}/local-files/${pic?.id}`) ?? []
    console.log(carImages, location.state  )

    return (
        <CSCommonContainer>
            <RentalWrapper>
                <CSCommonSlides images={carImages} width="600px" height="270px" />
            </RentalWrapper>
        </CSCommonContainer>
    )
}

const RentalWrapper = styled.div`
    display: flex;
`
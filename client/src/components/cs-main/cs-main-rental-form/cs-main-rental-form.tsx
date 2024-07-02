import { CSCommonContainer, CSCommonForm, CSCommonPaymentForm } from "@/components/cs-common";
import { PaymentDto, RentalDto } from "@/types";
import { FC } from "react";
import styled from "styled-components";
import { CSMainRentalFormSummary } from "./cs-main-rental-form-summary";
import { rentalSchema } from "@/helpers";

export const CSMainRentalForm: FC = () => {
    const onSubmit = async (rentalDto: RentalDto & PaymentDto): Promise<void> => {

    }

    return (
        <CSCommonContainer>
            <RentalForm>
                <FormWrapper>
                    <CSCommonForm<RentalDto & PaymentDto>
                        validationSchema={rentalSchema}
                        onSubmit={onSubmit}
                    >
                        <FormInfoWrapper>
                            <SectionTitle>Rental Info</SectionTitle>
                            <SectionDescription>Please enter your rental info</SectionDescription>
                            <RentalFormBlocks>
                                <CSCommonForm.Input
                                    name="pickUpLocation"
                                    label="Pick Up Location"
                                />
                                <CSCommonForm.Input
                                    name="dropOffLocation"
                                    label="Drop Off Location"
                                />
                                <CSCommonForm.Input
                                    name="hours"
                                    label="Requested Hours"
                                    type="number"
                                />
                            </RentalFormBlocks>
                        </FormInfoWrapper>
                        <CSCommonPaymentForm
                            title='Payment Details'
                            description="Please enter your payment details"
                            submitButtonContent="Rent Now"
                        />
                    </CSCommonForm>
                </FormWrapper>
                <CSMainRentalFormSummary />
            </RentalForm>
        </CSCommonContainer>
    )
}

const RentalForm = styled.div`
    width: 100%;
    display: flex;
    gap: 40px;
    margin-top: 50px;
`

const FormWrapper = styled.div`
    display: flex;
    width: 65%;
`

const FormInfoWrapper = styled.div`
    width: 100%;
    background-color: white;
    border-radius: 20px;
    padding: 35px 35px 10px 35px;
    margin-bottom: 20px;
    box-shadow: var(--default-box-shadow);
`

export const SectionTitle = styled.h3`
    color: var(--dark);
    margin-bottom: 10px;
`

export const SectionDescription = styled.p`
    color: var(--dark);
    font-size: 14px;
    font-weight: 300;
    margin-bottom: 30px;
`

const RentalFormBlocks = styled.div`
  display: grid;
  grid-column: span 3;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 0px 40px;
`;

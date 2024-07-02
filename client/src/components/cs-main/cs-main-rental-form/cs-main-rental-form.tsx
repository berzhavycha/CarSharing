import { CSCommonContainer, CSCommonForm } from "@/components/cs-common";
import { PaymentDto, RentalDto } from "@/types";
import { FC } from "react";
import styled from "styled-components";
import { CSMainRentalFormSummary } from "./cs-main-rental-form-summary";

export const CSMainRentalForm: FC = () => {
    return (
        <CSCommonContainer>
            <RentalForm>
                <FormWrapper>
                    <CSCommonForm<RentalDto & PaymentDto>>
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
                        <FormInfoWrapper>
                            <SectionTitle>Payment Details</SectionTitle>
                            <SectionDescription>Please enter your payment details</SectionDescription>
                            <PaymentFormBlocks>
                                <CSCommonForm.Input
                                    name="cardNumber"
                                    label="Card Number"
                                />
                                <CSCommonForm.Input
                                    name="expirationDate"
                                    label="Expiration Date"
                                />
                                <CSCommonForm.Input
                                    name="cardHolder"
                                    label="Card Holder"
                                />
                                <CSCommonForm.Input
                                    name="CVV"
                                    label="CVV"
                                    type="number"
                                />
                            </PaymentFormBlocks>
                            <CSCommonForm.SubmitButton content="Rent Now" />
                        </FormInfoWrapper>
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
    margin: 50px 0;
`

const FormWrapper = styled.div`
    display: flex;
    width: 65%;
`

const FormInfoWrapper = styled.div`
    width: 100%;
    background-color: white;
    border-radius: 20px;
    padding: 25px 25px 10px 25px;
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

const PaymentFormBlocks = styled.div`
  display: grid;
  grid-column: span 2;
  grid-template-columns: 1fr 1fr;
  gap: 0px 40px;
`;

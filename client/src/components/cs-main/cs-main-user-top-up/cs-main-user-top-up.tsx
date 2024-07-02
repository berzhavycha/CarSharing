import { CSCommonContainer, CSCommonErrorMessage, CSCommonForm, CSCommonPaymentForm } from "@/components/cs-common";
import { useStore } from "@/context";
import { paymentFormSchema } from "@/helpers";
import { PaymentDto } from "@/types";
import { FC } from "react";
import styled from "styled-components";

export const CSMainUserTopUp: FC = () => {
    const { currentUserStore: { topUpErrors, topUp } } = useStore()

    const onSubmit = async (topUpDto: PaymentDto): Promise<void> => {
        await topUp({ amount: topUpDto.amount })
    }

    return (
        <CSCommonContainer>
            <CSCommonForm<PaymentDto>
                validationSchema={paymentFormSchema}
                onSubmit={onSubmit}
            >
                <FormInfoWrapper>
                    <SectionTitle>Balance Form</SectionTitle>
                    <CSCommonErrorMessage>{topUpErrors?.unexpectedError ?? ''}</CSCommonErrorMessage>
                    <CSCommonForm.Input
                        label="Amount"
                        name="amount"
                        error={topUpErrors?.amount ?? ''}
                        type="number"
                    />
                </FormInfoWrapper>
                <CSCommonPaymentForm
                    title="Top Up Details"
                    description="Please enter your payment details"
                    submitButtonContent="Top Up"
                />
            </CSCommonForm>
        </CSCommonContainer>
    )
}

const FormInfoWrapper = styled.div`
    width: 100%;
    background-color: white;
    border-radius: 20px;
    padding: 35px 35px 10px 35px;
    margin: 50px 0;
    box-shadow: var(--default-box-shadow);
`

const SectionTitle = styled.h3`
    color: var(--dark);
    margin-bottom: 10px;
`


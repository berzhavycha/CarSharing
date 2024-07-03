import { CSCommonModal } from "@/components/cs-common";
import { useStore } from "@/context";
import { FC } from "react";

export const CSMainRentalHistoryModals: FC = () => {
    const { rentalStore } = useStore();
    const {
        isReturnedInTime,
        refund,
        penalty,
        errorMessage,
        setRefund,
        setPenalty,
        setErrorMessage,
        setIsReturnedInTime
    } = rentalStore;

    const handleCloseRefundWindow = (): void => setRefund(undefined)
    const handleClosePenaltyWindow = (): void => setPenalty(undefined)
    const handleCloseErrorWindow = (): void => setErrorMessage('')
    const handleCloseReturnWindow = (): void => setIsReturnedInTime(false)

    return (
        <>
            {refund && (
                <CSCommonModal
                    type="confirm"
                    title="Success"
                    message={`Thank you for returning the car earlier. Here is your refund: ${refund}`}
                    onClose={handleCloseRefundWindow}
                    onOk={handleCloseRefundWindow}
                />
            )}

            {penalty && (
                <CSCommonModal
                    type="warning"
                    title="Warning"
                    message={`You have returned the car later than agreed. Here is your fine: ${penalty}`}
                    onClose={handleClosePenaltyWindow}
                    onOk={handleClosePenaltyWindow}
                />
            )}

            {errorMessage && (
                <CSCommonModal
                    type="error"
                    title="Error"
                    message={errorMessage}
                    onClose={handleCloseErrorWindow}
                />
            )}

            {isReturnedInTime && (
                <CSCommonModal
                    type="confirm"
                    title="Success"
                    message="You returned the car successfully! Thank you!"
                    onClose={handleCloseReturnWindow}
                />
            )}
        </>
    )
}
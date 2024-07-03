import { useStore } from "@/context";

type HookReturn = {
    handleCloseErrorWindow: () => void;
    handleClosePenaltyWindow: () => void;
    handleCloseRefundWindow: () => void;
    handleCloseReturnWindow: () => void;
}

export const useRentalModals = (): HookReturn => {
    const {
        rentalStore: {
            setRefund,
            setErrorMessage,
            setIsReturnedInTime,
            setPenalty,
        }
    } = useStore();


    const handleCloseRefundWindow = (): void => setRefund(undefined)
    const handleClosePenaltyWindow = (): void => setPenalty(undefined)
    const handleCloseErrorWindow = (): void => setErrorMessage('')
    const handleCloseReturnWindow = (): void => setIsReturnedInTime(false)

    return {
        handleCloseErrorWindow,
        handleClosePenaltyWindow,
        handleCloseRefundWindow,
        handleCloseReturnWindow
    }
}
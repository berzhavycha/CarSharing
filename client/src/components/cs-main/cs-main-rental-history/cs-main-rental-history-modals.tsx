import { observer } from 'mobx-react-lite';
import { FC } from 'react';

import { CSCommonModal } from '@/components/cs-common';
import { useStore } from '@/context';
import { RentalReturnOrigin } from '@/helpers';

import { CSMainRentalReturnConfirmModal } from './cs-main-rental-return-confirm-modal';
import { useRentals } from './hooks';

export const CSMainRentalHistoryModals: FC = observer(() => {
  const {
    carReturnStore: {
      rentalToReturn,
      isReturnedInTime,
      refund,
      penalty,
      errorMessage,
      setRefund,
      setPenalty,
      setErrorMessage,
      setIsReturnedInTime,
      origin,
    },
  } = useStore();

  const { refetchRentals } = useRentals();

  const handleCloseRefundWindow = (): void => setRefund(undefined);
  const handleClosePenaltyWindow = (): void => setPenalty(undefined);
  const handleCloseErrorWindow = (): void => setErrorMessage('');
  const handleCloseReturnWindow = (): void => setIsReturnedInTime(false);

  return (
    <>
      {rentalToReturn && origin === RentalReturnOrigin.TABLE && (
        <CSMainRentalReturnConfirmModal onSuccessReturn={refetchRentals} />
      )}

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
  );
});

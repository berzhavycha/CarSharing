import { observer } from 'mobx-react-lite';
import { FC, useEffect } from 'react';

import { CSCommonModal } from '@/components/cs-common';
import { useStore } from '@/context';
import { Env } from '@/core';
import { useSSE } from '@/hooks';

type Props = {
  onSuccessReturn: () => Promise<void>;
};

export const CSMainRentalReturnConfirmModal: FC<Props> = observer(({ onSuccessReturn }) => {
  const {
    carReturnStore: { rentalToReturn, setRentalToReturn, loading, returnCar },
    currentUserStore: { user }
  } = useStore();
  const update = useSSE<{ rentalId: string; status: string; reason?: string }>(
    `${Env.RENTAL_API_BASE_URL}/rentals/stream/${user?.id}`,
  );

  useEffect(() => {
    console.log(update)
    if (update?.status === 'ACTIVE') {
      console.log("error")
    } else if (update?.status === 'CLOSED') {
      onSuccessReturn();
    }
  }, [update]);

  const handleCloseConfirmReturnWindow = (): void => setRentalToReturn(null);

  const handleReturnCar = async (): Promise<void> => {
    if (rentalToReturn) {
      await returnCar(rentalToReturn.id);
    }
  };

  return (
    <>
      {rentalToReturn && (
        <CSCommonModal
          type="warning"
          title="Confirm Returning"
          message={`Are you sure you want to return the car: ${rentalToReturn.car.model}?`}
          onClose={handleCloseConfirmReturnWindow}
          onOk={handleReturnCar}
          onCancel={handleCloseConfirmReturnWindow}
          loading={loading}
        />
      )}
    </>
  );
});

import { observer } from 'mobx-react-lite';
import { FC } from 'react';

import { CSCommonModal } from '@/components/cs-common';
import { useStore } from '@/context';

type Props = {
    onSuccessReturn: () => Promise<void>
}

export const CSMainRentalReturnConfirmModal: FC<Props> = observer(({ onSuccessReturn }) => {
    const { rentalStore } = useStore();
    const {
        carReturn: {
            rentalToReturn,
            setRentalToReturnId,
            loading,
            returnCar
        },
    } = rentalStore;

    const handleCloseConfirmReturnWindow = (): void => setRentalToReturnId(null);

    const handleReturnCar = async (): Promise<void> => {
        if (rentalToReturn) {
            await returnCar(rentalToReturn.id);
            await onSuccessReturn();
        }
    };

    return (
        <>
            {rentalToReturn && (
                <CSCommonModal
                    type="warning"
                    title="Confirm Returning"
                    message={`Are you sure you want to return the car: ${rentalToReturn.originalCar.model}?`}
                    onClose={handleCloseConfirmReturnWindow}
                    onOk={handleReturnCar}
                    onCancel={handleCloseConfirmReturnWindow}
                    loading={loading}
                />
            )}
        </>
    );
});

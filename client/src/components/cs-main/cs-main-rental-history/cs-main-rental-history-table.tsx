import { FC, useEffect } from 'react';
import { CSCommonModal, CSCommonNoData, Table, TableHeader } from '@/components/cs-common';
import { Rental } from '@/types';
import { CSMainRentalHistoryTableRow } from './cs-main-rental-history-table-row';
import { useStore } from '@/context';
import { observer } from 'mobx-react-lite';
import { useRentals } from './hooks';

type Props = {
    loadedRentals: Rental[];
    onSortChange: (sort: string) => void;
};

export const CSMainRentalHistoryTable: FC<Props> = observer(({ loadedRentals, onSortChange }) => {
    const { rentalStore } = useStore();
    const {
        rentals,
        isReturnedInTime,
        refund,
        penalty,
        setRentals,
        errorMessage,
        returnCar,
        setRefund,
        setPenalty,
        setErrorMessage,
        setIsReturnedInTime
    } = rentalStore;
    const { refetchRentals } = useRentals()

    useEffect(() => {
        setRentals(loadedRentals);
    }, [loadedRentals]);

    const handleReturnCar = async (id: string): Promise<void> => {
        await returnCar(id);
        await refetchRentals();
    };

    const handleCloseRefundWindow = (): void => setRefund(undefined)
    const handleClosePenaltyWindow = (): void => setPenalty(undefined)
    const handleCloseErrorWindow = (): void => setErrorMessage('')
    const handleCloseReturnWindow = (): void => setIsReturnedInTime(false)

    const displayedRentals = rentals ?? loadedRentals;

    return (
        <>
            <Table>
                <thead>
                    <tr>
                        <TableHeader style={{ width: '5%' }}>No.</TableHeader>
                        <TableHeader style={{ width: '10%' }}>Image</TableHeader>
                        <TableHeader style={{ width: '15%' }} onClick={() => onSortChange('model')}>
                            Model
                        </TableHeader>
                        <TableHeader style={{ width: '10%' }} onClick={() => onSortChange('requestedHours')}>
                            Hours
                        </TableHeader>
                        <TableHeader style={{ width: '10%' }} onClick={() => onSortChange('totalPrice')}>
                            Total Price
                        </TableHeader>
                        <TableHeader style={{ width: '12%' }} onClick={() => onSortChange('rentalStart')}>
                            Start Time
                        </TableHeader>
                        <TableHeader style={{ width: '12%' }} onClick={() => onSortChange('rentalEnd')}>
                            End Time
                        </TableHeader>
                        <TableHeader style={{ width: '12%' }} onClick={() => onSortChange('status')}>
                            Status
                        </TableHeader>
                        <TableHeader style={{ width: '15%' }}>Actions</TableHeader>
                    </tr>
                </thead>
                <tbody>
                    {displayedRentals.length === 0 ? (
                        <tr>
                            <td colSpan={8}>
                                <CSCommonNoData message="No history available" />
                            </td>
                        </tr>
                    ) : (
                        displayedRentals.map((rental, index) => (
                            <CSMainRentalHistoryTableRow
                                key={rental.id}
                                index={index}
                                rental={rental}
                                onCarReturn={() => handleReturnCar(rental.id)}
                            />
                        ))
                    )}
                </tbody>
            </Table>

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

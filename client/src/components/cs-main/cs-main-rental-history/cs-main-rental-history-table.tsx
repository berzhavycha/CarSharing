import { FC, useEffect } from 'react';

import { CSCommonModal, CSCommonNoData, Table, TableHeader } from '@/components/cs-common';
import { Rental } from '@/types';

import { CSMainRentalHistoryTableRow } from './cs-main-rental-history-table-row';
import { useStore } from '@/context';
import { observer } from 'mobx-react-lite';
import { Env } from '@/core';
import { extractPaginationParams } from '@/helpers';

type Props = {
    loadedRentals: Rental[];
    onSortChange: (sort: string) => void;
};

export const CSMainRentalHistoryTable: FC<Props> = observer(({ loadedRentals, onSortChange }) => {
    const { rentalStore } = useStore();


    const {
        rentals,
        fetchRentals,
        isReturnedInTime,
        refund,
        penalty,
        errorMessage,
        setRefund,
        setErrorMessage,
        setIsReturnedInTime,
        setPenalty,
        returnCar
    } = rentalStore;


    useEffect(() => {
        const url = new URL(window.location.href)
        const { queryDto } = extractPaginationParams(
            url,
            Env.USER_RENTAL_HISTORY_PAGINATION_LIMIT
        );

        fetchRentals(queryDto)
    }, [])

    const handleCloseRefundWindow = (): void => setRefund(undefined)
    const handleClosePenaltyWindow = (): void => setPenalty(undefined)
    const handleCloseErrorWindow = (): void => setErrorMessage('')
    const handleCloseReturnWindow = (): void => setIsReturnedInTime(false)

    const showedRentals = rentals ?? loadedRentals

    const onCarReturn = async (id: string): Promise<void> => {
        await returnCar(id)
        const url = new URL(window.location.href)
        const { queryDto } = extractPaginationParams(
            url,
            Env.USER_RENTAL_HISTORY_PAGINATION_LIMIT
        );

        await fetchRentals(queryDto)
    }

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
                        <TableHeader style={{ width: '10%' }} onClick={() => onSortChange('amount')}>
                            Hours
                        </TableHeader>
                        <TableHeader style={{ width: '10%' }} onClick={() => onSortChange('amount')}>
                            Total Price
                        </TableHeader>
                        <TableHeader style={{ width: '12%' }} onClick={() => onSortChange('createdAt')}>
                            Start Time
                        </TableHeader>
                        <TableHeader style={{ width: '12%' }} onClick={() => onSortChange('type')}>
                            End Time
                        </TableHeader>
                        <TableHeader style={{ width: '12%' }} onClick={() => onSortChange('type')}>
                            Status
                        </TableHeader>
                        <TableHeader style={{ width: '15%' }}>Actions</TableHeader>
                    </tr>
                </thead>
                <tbody>
                    {showedRentals.length === 0 ? (
                        <tr>
                            <td colSpan={8}>
                                <CSCommonNoData message="No history available" />
                            </td>
                        </tr>
                    ) : (
                        showedRentals.map((rental, index) => (
                            <CSMainRentalHistoryTableRow
                                key={rental.id}
                                index={index}
                                rental={rental as Rental}
                                onCarReturn={() => onCarReturn(rental.id)}
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
                    message={`You have returned the car later than we agreed. Here is your fine: ${penalty}`}
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
                    message={`You returned a car successfully! Thank you!`}
                    onClose={handleCloseReturnWindow}
                />
            )}
        </>
    );
});

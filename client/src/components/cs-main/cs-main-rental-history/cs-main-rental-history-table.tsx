import { FC } from 'react';

import { CSCommonNoData, Table, TableHeader } from '@/components/cs-common';
import { Rental } from '@/types';

import { CSMainRentalHistoryTableRow } from './cs-main-rental-history-table-row';

type Props = {
    rentals: Rental[];
    onSortChange: (sort: string) => void;
};

export const CSMainRentalHistoryTable: FC<Props> = ({ rentals, onSortChange }) => {
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
                    {rentals.length === 0 ? (
                        <tr>
                            <td colSpan={8}>
                                <CSCommonNoData message="No history available" />
                            </td>
                        </tr>
                    ) : (
                        rentals.map((rental, index) => (
                            <CSMainRentalHistoryTableRow
                                key={rental.id}
                                index={index}
                                rental={rental}
                            />
                        ))
                    )}
                </tbody>
            </Table>
        </>
    );
};

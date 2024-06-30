import { FC } from 'react';

import { CSCommonNoData, Table, TableHeader } from '@/components/cs-common';
import { Transaction } from '@/types';
import { CSDashboardTransactionsTableRow } from './cs-dashboard-transactions-table-row';


type Props = {
    transactions: Transaction[];
    onSortChange: (sort: string) => void;
};

export const CSDashboardTransactionsTable: FC<Props> = ({ transactions, onSortChange }) => {
    return (
        <>
            <Table>
                <thead>
                    <tr>
                        <TableHeader style={{ width: '5%' }}>No.</TableHeader>
                        <TableHeader style={{ width: '33%' }}>Rental Id</TableHeader>
                        <TableHeader style={{ width: '23%' }}>User</TableHeader>
                        <TableHeader style={{ width: '10%' }} onClick={() => onSortChange('amount')}>
                            Amount
                        </TableHeader>
                        <TableHeader style={{ width: '12%' }} onClick={() => onSortChange('createdAt')}>
                            Date & Time
                        </TableHeader>
                        <TableHeader style={{ width: '12%' }} onClick={() => onSortChange('type')}>
                            Type
                        </TableHeader>
                    </tr>
                </thead>
                <tbody>
                    {transactions.length === 0 ? (
                        <tr>
                            <td colSpan={8}>
                                <CSCommonNoData message="No transactions available" />
                            </td>
                        </tr>
                    ) : (
                        transactions.map((transaction, index) => (
                            <CSDashboardTransactionsTableRow
                                key={transaction.id}
                                index={index}
                                transaction={transaction}
                            />
                        ))
                    )}
                </tbody>
            </Table>
        </>
    );
};

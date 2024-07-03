import { CSCommonNoData, CSCommonTitle } from "@/components/cs-common";
import { formatDate, convertToTitleCase } from "@/helpers";
import { Rental } from "@/types";
import { FC } from "react";
import styled from "styled-components";

type Props = {
    rental: Rental
}

export const CSMainSingleRentalTransaction: FC<Props> = ({ rental }) => {
    return (
        <TransactionsSection>
            <CSCommonTitle>Transactions</CSCommonTitle>
            {rental?.transactions?.length > 0 ? (
                <TransactionsList>
                    {rental.transactions.map((transaction) => (
                        <TransactionItem key={transaction.id}>
                            <TransactionType>{convertToTitleCase(transaction.type)}</TransactionType>
                            <TransactionAmount
                                $type={transaction.amount > 0 ? 'gain' : 'lose'}
                            >
                                ${transaction.amount.toFixed(2)}
                            </TransactionAmount>
                            <TransactionDate>{formatDate(transaction.createdAt)}</TransactionDate>
                        </TransactionItem>
                    ))}
                </TransactionsList>
            ) : (
                <CSCommonNoData message="No transactions" />
            )}
        </TransactionsSection>
    )
}

const TransactionsSection = styled.div`
  margin-top: 30px;
`;

const TransactionsList = styled.ul`
  list-style: none;
  padding: 0;
`;

const TransactionItem = styled.li`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px;
  background-color: var(--light-gray);
  border-radius: 10px;
  margin-bottom: 10px;
`;

const TransactionType = styled.span`
  font-weight: bold;
`;

type TransactionAmountProps = {
    $type: "lose" | "gain"
}

const TransactionAmount = styled.span<TransactionAmountProps>`
  color: ${(props): string => props.$type === 'lose' ? 'var(--default-red)' : 'var(--top-up-text)'};
`;

const TransactionDate = styled.span`
  color: #6c757d;
  font-size: 0.9em;
`;

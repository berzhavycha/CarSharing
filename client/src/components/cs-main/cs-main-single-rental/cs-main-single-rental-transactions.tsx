import { uppercaseFirstLetter, formatDate } from "@/helpers";
import { Rental } from "@/types";
import { FC } from "react";
import styled from "styled-components";

type Props = {
    rental: Rental
}

export const CSMainSingleRentalTransaction: FC<Props> = ({ rental }) => {
    return (
        <TransactionsSection>
            <SectionTitle>Transactions</SectionTitle>
            {rental?.transactions?.length > 0 ? (
                <TransactionsList>
                    {rental.transactions.map((transaction) => (
                        <TransactionItem key={transaction.id}>
                            <TransactionType>{uppercaseFirstLetter(transaction.type)}</TransactionType>
                            <TransactionAmount>${transaction.amount.toFixed(2)}</TransactionAmount>
                            <TransactionDate>{formatDate(transaction.createdAt)}</TransactionDate>
                        </TransactionItem>
                    ))}
                </TransactionsList>
            ) : (
                <NoTransactions>No transactions found for this rental.</NoTransactions>
            )}
        </TransactionsSection>
    )
}

const TransactionsSection = styled.div`
  margin-top: 30px;
`;

const SectionTitle = styled.h2`
  font-size: 20px;
  margin-bottom: 15px;
  color: var(--main-blue);
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
  background-color: #f8f9fa;
  border-radius: 4px;
  margin-bottom: 10px;
`;

const TransactionType = styled.span`
  font-weight: bold;
`;

const TransactionAmount = styled.span`
  color: #28a745;
`;

const TransactionDate = styled.span`
  color: #6c757d;
  font-size: 0.9em;
`;

const NoTransactions = styled.p`
  color: #6c757d;
  font-style: italic;
`;


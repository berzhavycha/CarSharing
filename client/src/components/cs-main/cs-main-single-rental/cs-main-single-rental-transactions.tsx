import { RentalType } from "@/app/models";
import { CSCommonDetailsFeature, CSCommonNoData } from "@/components/cs-common";
import { formatDate, convertToTitleCase } from "@/helpers";
import { device } from "@/styles";
import { Rental } from "@/types";
import { FC } from "react";
import styled from "styled-components";
import { Title } from "./cs-main-single-rental-details";

type Props = {
  rental: Rental | RentalType
}

export const CSMainSingleRentalTransaction: FC<Props> = ({ rental }) => {
  const totalSpend = rental.transactions.reduce((acc, item) => {
    return acc + item.amount
  }, 0)

  return (
    <TransactionsSection>
      <Title>Transactions</Title>
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
      <CSCommonDetailsFeature label="Total Spend" text={`$${Math.abs(Number(totalSpend.toFixed(2)))}`} />
    </TransactionsSection>
  )
}

const TransactionsSection = styled.div`
  margin-top: 30px;
`;

const TransactionsList = styled.ul`
  list-style: none;
  padding: 0;
  margin-bottom: 20px;
`;

const TransactionItem = styled.li`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px;
  background-color: var(--light-gray);
  border-radius: 10px;
  margin-bottom: 10px;

  @media ${device.sm} {
    font-size: 14px
  }

  @media ${device.xs} {
    font-size: 12px
  }
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

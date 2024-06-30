import { axiosInstance } from '@/api';
import { Env } from '@/core';
import { QueryTransactionsDto, Transaction } from '@/types';

type ServiceReturn = {
  transactions: Transaction[];
  total: number;
};

export const fetchTransactions = async (queryDto: QueryTransactionsDto): Promise<ServiceReturn> => {
  const { data } = await axiosInstance.get(`${Env.API_BASE_URL}/transactions`, {
    params: queryDto,
  });
  return { transactions: data[0], total: data[1] };
};

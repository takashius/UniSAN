import { useQuery } from '@tanstack/react-query';
import ERDEAxios from './ERDEAxios';
import { TransactionHistoryResponse } from '../types/transactions';

export const useTransactionsHistory = (page: number = 1, date: string | null = null) => {
  return useQuery<TransactionHistoryResponse, Error>({
    queryKey: ['transactionsHistory', page, date],
    queryFn: async () => {
      const response = await ERDEAxios.get<TransactionHistoryResponse>(
        `/transaction/history?page=${page}${date && '&date=' + date}`
      );
      return response.data;
    },
    staleTime: 5 * 60 * 1000,
    placeholderData: previousData => previousData,
  });
};

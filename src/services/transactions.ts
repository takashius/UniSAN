import { useQuery } from '@tanstack/react-query';
import ERDEAxios from '../services/api';
import { TransactionHistoryResponse } from '../types/transactions';

export const useTransactionsHistory = (page: number = 1) => {
  return useQuery<TransactionHistoryResponse, Error>({
    queryKey: ['transactionsHistory', page],
    queryFn: async () => {
      const response = await ERDEAxios.get<TransactionHistoryResponse>(
        `/transaction/history?page=${page}`
      );
      return response.data;
    },
  });
};

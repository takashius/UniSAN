import { useQuery, type UseQueryResult } from '@tanstack/react-query';
import ERDEAxios from './ERDEAxios';

export interface ReceivingAccount {
  _id: string;
  bankName: string;
  bankCode: string;
  holderName?: string;
  documentId: string;
  phone: string;
  accountNumber?: string;
  accountType?: 'ahorro' | 'corriente' | null;
  active: boolean;
}

interface SanSettingsResponse {
  receivingAccounts?: ReceivingAccount[];
}

export const useReceivingAccounts = (): UseQueryResult<ReceivingAccount[], Error> => {
  return useQuery({
    queryKey: ['receivingAccounts'],
    queryFn: async () => {
      const { data } = await ERDEAxios.get<SanSettingsResponse>('/setting');
      return (data.receivingAccounts ?? []).filter((item) => item.active !== false);
    },
  });
};

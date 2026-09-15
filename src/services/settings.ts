import { useQuery, type UseQueryResult } from '@tanstack/react-query';
import ERDEAxios from './ERDEAxios';
import type { ReceivingAccount, SanSettings } from '../types/settings';

export const SAN_SETTINGS_KEY = ['sanSettings'] as const;

const fetchSanSettings = async (): Promise<SanSettings> => {
  const { data } = await ERDEAxios.get<SanSettings>('/setting');
  return data;
};

export const useSanSettings = (): UseQueryResult<SanSettings, Error> => {
  return useQuery({
    queryKey: SAN_SETTINGS_KEY,
    queryFn: fetchSanSettings,
    staleTime: 5 * 60 * 1000,
  });
};

export const useReceivingAccounts = (): UseQueryResult<ReceivingAccount[], Error> => {
  return useQuery({
    queryKey: SAN_SETTINGS_KEY,
    queryFn: fetchSanSettings,
    staleTime: 5 * 60 * 1000,
    select: (data) => (data.receivingAccounts ?? []).filter((item) => item.active !== false),
  });
};

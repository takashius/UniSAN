import {
  useMutation,
  UseMutationResult,
  useQuery,
  useQueryClient,
  UseQueryResult,
} from '@tanstack/react-query';
import ERDEAxios from './ERDEAxios';
import { San, JoinSanData } from '../types';

export const useAvailableSan = (): UseQueryResult<San[], Error> => {
  return useQuery<San[], Error>({
    queryKey: ['availableSan'],
    retry: false,
    queryFn: async () => {
      const response = await ERDEAxios.get<San[]>('/san/available');
      return response.data;
    },
  });
};

export const useJoinSan = (): UseMutationResult<void, Error, JoinSanData> => {
  const queryClient = useQueryClient();

  return useMutation<void, Error, JoinSanData>({
    mutationFn: async (data: JoinSanData) => {
      await ERDEAxios.post('/san/join', data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sanJoined'] });
    },
  });
};

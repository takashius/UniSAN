import {
  useMutation,
  UseMutationResult,
  useQuery,
  useQueryClient,
  UseQueryResult,
} from '@tanstack/react-query';
import ERDEAxios from './ERDEAxios';
import { San, JoinSanData } from '../types';
import { SanDetail } from '../types/san';
import SecureStoreManager from '../components/AsyncStorageManager';

async function postPaymentRequest(url: string, data: JoinSanData) {
  const { proofImage, ...payload } = data;
  if (!proofImage?.uri) {
    await ERDEAxios.post(url, payload);
    return;
  }

  const formData = new FormData();
  Object.entries(payload).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      formData.append(key, String(value));
    }
  });
  formData.append('image', {
    uri: proofImage.uri,
    name: proofImage.name || 'payment_receipt.jpg',
    type: proofImage.type || 'image/jpeg',
  } as unknown as Blob);

  await SecureStoreManager.setItem<string>('contentType', 'true');
  try {
    await ERDEAxios.post(url, formData);
  } finally {
    await SecureStoreManager.removeItem('contentType');
  }
}

export const useAvailableSan = (): UseQueryResult<San[], Error> => {
  return useQuery<San[], Error>({
    queryKey: ['availableSan'],
    retry: false,
    staleTime: 0,
    refetchOnMount: 'always',
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
      await postPaymentRequest('/san/join', data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['availableSan'] });
      queryClient.invalidateQueries({ queryKey: ['sanDetail'] });
    },
  });
};

export const usePaymentSan = (): UseMutationResult<void, Error, JoinSanData> => {
  const queryClient = useQueryClient();

  return useMutation<void, Error, JoinSanData>({
    mutationFn: async (data: JoinSanData) => {
      await postPaymentRequest('/transaction', data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sanDetail'] });
    },
  });
};

export const useSanDetail = (sanId: string) => {
  return useQuery<SanDetail, Error>({
    queryKey: ['sanDetail', sanId],
    queryFn: async () => {
      const response = await ERDEAxios.get<SanDetail>(`/san/${sanId}`);
      return response.data;
    },
    enabled: !!sanId,
  });
};

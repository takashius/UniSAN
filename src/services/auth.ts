import {
  Register,
  useMutation,
  useQuery,
  UseQueryResult,
  UseMutationResult,
  useQueryClient,
} from '@tanstack/react-query';
import ERDEAxios from './ERDEAxios';
import {
  Account,
  LoginResponse,
  Login,
  Image,
  Recovery,
  UserProfileResponse,
  ProfileUpdateData,
} from '../types';
import SecureStoreManager from '../components/AsyncStorageManager';

export const useLogin = (): UseMutationResult<LoginResponse, unknown, Login> => {
  return useMutation<LoginResponse, unknown, Login>({
    mutationFn: async (data: Login) => {
      const response = await ERDEAxios.post('/user/login', data);
      return response.data;
    },
  });
};

export const useAccount = (): UseQueryResult<Account, Error> => {
  return useQuery<Account, Error>({
    queryKey: ['myAccount'],
    retry: false,
    enabled: false,
    queryFn: () => {
      return ERDEAxios.get<Account>('/user/account').then(response => response.data);
    },
  });
};

export const useUserProfile = () => {
  return useQuery<UserProfileResponse, Error>({
    queryKey: ['userProfile'],
    queryFn: async () => {
      const response = await ERDEAxios.get<UserProfileResponse>(`/user/profile`);
      return response.data;
    },
    staleTime: 5 * 60 * 1000,
    placeholderData: previousData => previousData,
  });
};

export const useLogout = () => {
  return useMutation({
    mutationFn: async () => {
      const response = await ERDEAxios.post('/user/logout');
      return response.data;
    },
  });
};

export const useRegister = (): UseMutationResult<any, unknown, Register> => {
  return useMutation<any, unknown, Register>({
    mutationFn: async (data: Register) => {
      const response = await ERDEAxios.post('/user/register', data);
      return response.data;
    },
  });
};

export const useRecoveryOne = () => {
  return useMutation({
    mutationFn: (email: String) => {
      return ERDEAxios.get('/user/recovery/' + email);
    },
  });
};

export const useRecoveryTwo = () => {
  return useMutation({
    mutationFn: (data: Recovery) => {
      return ERDEAxios.post('/user/recovery', data);
    },
  });
};

export const useUploadImage = () => {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: async (data: Image) => {
      await SecureStoreManager.setItem<string>('contentType', 'true');
      var formData = new FormData();
      formData.append('image', data.image);
      formData.append('imageType', data.imageType);
      return ERDEAxios.post('/user/upload', formData);
    },
    onSuccess: async () => {
      await SecureStoreManager.removeItem('contentType');
      queryClient.invalidateQueries({ queryKey: ['myAccount'] });
    },
    onError: async error => {
      console.log('error useUploadImage', error);
      await SecureStoreManager.removeItem('contentType');
    },
  });

  return mutation;
};

export const useUpdateUser = (): UseMutationResult<
  ProfileUpdateData,
  Error,
  { data: ProfileUpdateData }
> => {
  return useMutation<ProfileUpdateData, Error, { data: ProfileUpdateData }>({
    mutationFn: async ({ data }) => {
      const response = await ERDEAxios.patch(`/user/`, data);
      return response.data;
    },
  });
};

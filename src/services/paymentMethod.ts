import {
  useMutation,
  useQuery,
  UseQueryResult,
  UseMutationResult,
  useQueryClient,
} from "@tanstack/react-query";
import ERDEAxios from "./ERDEAxios";
import { PaymentMethod, PaymentMethodCreate, PaymentMethodUpdate } from "../types/paymentMethod";

export const usePaymentMethods = (): UseQueryResult<PaymentMethod[], Error> => {
  return useQuery<PaymentMethod[], Error>({
    queryKey: ["paymentMethods"],
    queryFn: () => {
      return ERDEAxios.get<PaymentMethod[]>("/paymentMethod").then(
        (response) => response.data
      );
    },
  });
};

export const usePaymentMethod = (id: string): UseQueryResult<PaymentMethod, Error> => {
  return useQuery<PaymentMethod, Error>({
    queryKey: ["paymentMethod", id],
    queryFn: () => {
      return ERDEAxios.get<PaymentMethod>(`/paymentMethod/${id}`).then(
        (response) => response.data
      );
    },
  });
};

export const useCreatePaymentMethod = (): UseMutationResult<
  PaymentMethod,
  Error,
  PaymentMethodCreate
> => {
  const queryClient = useQueryClient();
  return useMutation<PaymentMethod, Error, PaymentMethodCreate>({
    mutationFn: async (data: PaymentMethodCreate) => {
      const response = await ERDEAxios.post("/paymentMethod", data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["paymentMethods"] });
    },
  });
};

export const useUpdatePaymentMethod = (): UseMutationResult<
  PaymentMethod,
  Error,
  { id: string; data: PaymentMethodUpdate }
> => {
  const queryClient = useQueryClient();
  return useMutation<PaymentMethod, Error, { id: string; data: PaymentMethodUpdate }>({
    mutationFn: async ({ id, data }) => {
      const response = await ERDEAxios.patch(`/paymentMethod/${id}`, data);
      return response.data;
    },
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ["paymentMethods"] });
      queryClient.invalidateQueries({ queryKey: ["paymentMethod", id] });
    },
  });
};

export const useDeletePaymentMethod = (): UseMutationResult<
  void,
  Error,
  string
> => {
  const queryClient = useQueryClient();
  return useMutation<void, Error, string>({
    mutationFn: async (id: string) => {
      await ERDEAxios.delete(`/paymentMethod/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["paymentMethods"] });
    },
  });
}; 
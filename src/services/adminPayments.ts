import {
  useMutation,
  useQuery,
  useQueryClient,
  type UseQueryResult,
} from "@tanstack/react-query";
import ERDEAxios from "./ERDEAxios";
import type {
  AdminPayment,
  AdminPaymentListResponse,
  ValidatePaymentResponse,
} from "../types/adminPayments";

export const PENDING_PAYMENTS_QUERY_KEY = ["adminPendingPayments"] as const;

export const usePendingPayments = (): UseQueryResult<AdminPaymentListResponse, Error> => {
  return useQuery({
    queryKey: PENDING_PAYMENTS_QUERY_KEY,
    queryFn: async () => {
      const search = new URLSearchParams({ status: "pending", page: "1", limit: "50" });
      const response = await ERDEAxios.get<AdminPaymentListResponse>(
        `/transaction/admin?${search.toString()}`
      );
      return response.data;
    },
  });
};

export const useAdminPayment = (id: string): UseQueryResult<AdminPayment, Error> => {
  return useQuery({
    queryKey: ["adminPayment", id],
    enabled: !!id,
    queryFn: async () => {
      const response = await ERDEAxios.get<AdminPayment>(`/transaction/admin/${id}`);
      return response.data;
    },
  });
};

export const useValidateAdminPayment = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const response = await ERDEAxios.post<ValidatePaymentResponse>(
        `/transaction/admin/${id}/validate`
      );
      return response.data;
    },
    onSuccess: (_data, id) => {
      void queryClient.invalidateQueries({ queryKey: PENDING_PAYMENTS_QUERY_KEY });
      void queryClient.invalidateQueries({ queryKey: ["adminPayment", id] });
    },
  });
};

export const useRejectAdminPayment = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, reason }: { id: string; reason: string }) => {
      const response = await ERDEAxios.post<AdminPayment>(`/transaction/admin/${id}/reject`, {
        reason,
      });
      return response.data;
    },
    onSuccess: (_data, vars) => {
      void queryClient.invalidateQueries({ queryKey: PENDING_PAYMENTS_QUERY_KEY });
      void queryClient.invalidateQueries({ queryKey: ["adminPayment", vars.id] });
    },
  });
};

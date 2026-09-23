import {
  useMutation,
  useQuery,
  useQueryClient,
  type UseQueryResult,
} from "@tanstack/react-query";
import ERDEAxios from "./ERDEAxios";
import type { AdminDocument } from "../types/adminDocuments";

export const PENDING_DOCUMENTS_QUERY_KEY = ["adminPendingDocuments"] as const;

export const usePendingDocuments = (): UseQueryResult<
  AdminDocument[],
  Error
> => {
  return useQuery({
    queryKey: PENDING_DOCUMENTS_QUERY_KEY,
    queryFn: async () => {
      const response = await ERDEAxios.get<AdminDocument[]>(
        "/user/admin/documents?status=pending",
      );
      return response.data;
    },
  });
};

export const useAdminDocument = (
  userId: string,
): UseQueryResult<AdminDocument, Error> => {
  return useQuery({
    queryKey: ["adminDocument", userId],
    enabled: !!userId,
    queryFn: async () => {
      const response = await ERDEAxios.get<AdminDocument>(
        `/user/admin/documents/${userId}`,
      );
      return response.data;
    },
  });
};

export const useApproveAdminDocument = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (userId: string) => {
      const response = await ERDEAxios.post<AdminDocument>(
        `/user/admin/documents/${userId}/approve`,
      );
      return response.data;
    },
    onSuccess: (_data, userId) => {
      void queryClient.invalidateQueries({
        queryKey: PENDING_DOCUMENTS_QUERY_KEY,
      });
      void queryClient.invalidateQueries({
        queryKey: ["adminDocument", userId],
      });
    },
  });
};

export const useRejectAdminDocument = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      userId,
      reason,
    }: {
      userId: string;
      reason: string;
    }) => {
      const response = await ERDEAxios.post<AdminDocument>(
        `/user/admin/documents/${userId}/reject`,
        { reason },
      );
      return response.data;
    },
    onSuccess: (_data, vars) => {
      void queryClient.invalidateQueries({
        queryKey: PENDING_DOCUMENTS_QUERY_KEY,
      });
      void queryClient.invalidateQueries({
        queryKey: ["adminDocument", vars.userId],
      });
    },
  });
};

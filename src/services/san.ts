import { useQuery, UseQueryResult } from "@tanstack/react-query";
import ERDEAxios from "./ERDEAxios";
import { San } from "../types";

export const useAvailableSan = (): UseQueryResult<San[], Error> => {
  return useQuery<San[], Error>({
    queryKey: ["availableSan"],
    retry: false,
    queryFn: async () => {
      const response = await ERDEAxios.get<San[]>("/san/available");
      return response.data;
    },
  });
};

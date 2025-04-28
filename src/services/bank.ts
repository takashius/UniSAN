import { useQuery } from "@tanstack/react-query";
import ERDEAxios from "./ERDEAxios";

export interface Bank {
  _id: string;
  name: string;
  code: string;
  active: boolean;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export const useBanks = () => {
  return useQuery<Bank[]>({
    queryKey: ["banks"],
    queryFn: async () => {
      const response = await ERDEAxios.get("/bank");
      return response.data;
    },
  });
}; 
import { useQuery, type UseQueryResult } from "@tanstack/react-query";
import ERDEAxios from "./ERDEAxios";

export interface LegalSection {
  id: string;
  title: string;
  body: string;
}

export interface PublicTerms {
  version: number;
  updatedAt?: string;
  lang: "es" | "en";
  lateFeePercent: number;
  lateAfterDays: number;
  markdown: string;
  sections: LegalSection[];
}

export const usePublicTerms = (
  lang: string,
): UseQueryResult<PublicTerms, Error> => {
  const normalized = lang.startsWith("en") ? "en" : "es";
  return useQuery({
    queryKey: ["publicTerms", normalized],
    queryFn: async () => {
      const response = await ERDEAxios.get<PublicTerms>("/legal/terms", {
        params: { lang: normalized },
      });
      return response.data;
    },
  });
};

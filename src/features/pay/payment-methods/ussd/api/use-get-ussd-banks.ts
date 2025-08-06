import type { ApiResponse } from "@/features";
import { useHttpQuery } from "@/lib";

export interface USSDBanks {
  bankName: string;
  bankCode: string;
  ussdString: string;
}

export const useGetUSSDBanks = () => {
  return useHttpQuery<
    unknown,
    ApiResponse<USSDBanks[]>,
    ApiResponse<USSDBanks[]>["data"]
  >({
    queryKey: ["banks"],
    url: `/api/Payments/GetUSSDBanks`,
    staleTime: 0,
    gcTime: 0,
    enabled: true,
    refetchOnReconnect: false,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    retry: false,
    select: (data) => data?.data,
  });
};

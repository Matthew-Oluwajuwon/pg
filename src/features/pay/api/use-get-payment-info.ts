import { useHttpQuery } from "@/lib";
import type { ApiResponse, PaymentInfoData } from "./types";

export const useGetPaymentInfo = () => {
  const pathname = window.location.pathname;
  const reference = pathname.split("/")[1];

  return useHttpQuery<unknown, ApiResponse<PaymentInfoData>>({
    queryKey: ["categories"],
    url: `/api/Payments/GetPaymentInfo/${reference}`,
    staleTime: 0,
    gcTime: 0,
    enabled: !!reference,
    refetchOnReconnect: true,
    retry: false,
    select: (data) => data,
  });
};

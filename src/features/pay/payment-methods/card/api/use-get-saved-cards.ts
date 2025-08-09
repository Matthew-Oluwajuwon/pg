import type { ApiResponse } from "@/features";
import { useHttpQuery, useStore } from "@/lib";

export interface SavedCards {
  cardPan: string;
  expiryMonth: string;
  expiryYear: string;
  cvv: string;
  cardBrand: string;
  email: string;
  billingZip: string;
  billingCity: string;
  billingAddress: string;
  billingState: string;
  billingCountry: string;
  cardHolderName: string;
}

export const useGetSavedCards = () => {
  const { paymentInfo } = useStore((state) => state);

  return useHttpQuery<unknown, ApiResponse<SavedCards[]>>({
    queryKey: ["saved-cards"],
    url: "/api/Payments/GetSaveCard",
    staleTime: 0,
    gcTime: 0,
    enabled: !!paymentInfo?.token,
    headers: {
      Authorization: `Bearer ${paymentInfo?.token}`,
    },
    refetchOnReconnect: false,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    retry: false,
    select: (data) => data,
  });
};

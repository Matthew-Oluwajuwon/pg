import { useHttpMutation, useStore } from "@/lib";
import { App } from "antd";
import { useCallback } from "react";
import { AxiosError } from "axios";
import { useQueryClient } from "@tanstack/react-query";

export interface SavedCardRequest {
  cardPan: string;
  expiryMonth: string;
  expiryYear: string;
  cvv: string;
  cardBrand: string;
  firstname: string;
  lastname: string;
  billingZip: string;
  billingCity: string;
  billingAddress: string;
  billingState: string;
  billingCountry: string;
  cardHolderName: string;
  email: string;
}

export const useSavedCard = () => {
  const { message } = App.useApp();
  const { paymentInfo } = useStore((state) => state);
  const queryClient = useQueryClient();

  const { isPending, data, mutateAsync } = useHttpMutation<
    SavedCardRequest,
    { responseCode: string; responseMessage: string }
  >({
    url: "/api/Payments/SaveCard",
    headers: {
      Authorization: `Bearer ${paymentInfo?.token}`,
    },
    onSuccess: (data) => {
      if (data?.responseCode === "00") {
        message.success(data?.responseMessage ?? "Card saved successfully");
        queryClient.invalidateQueries({ queryKey: ["saved-cards"] });
      }
    },
  });

  const onSavedCard = useCallback(
    async (data: SavedCardRequest) => {
      try {
        const response = await mutateAsync({ data });

        return response;
      } catch (error) {
        if (error instanceof AxiosError) {
          message.error(error.response?.data?.message);
        } else if (error instanceof Error) {
          message.error(error.message);
        } else {
          message.error("Unable to save card");
        }
      }
    },
    [message, mutateAsync],
  );

  return {
    isPending,
    data,
    onSavedCard,
  };
};

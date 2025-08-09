import { useHttpMutation, useStore } from "@/lib";
import { App } from "antd";
import { useCallback } from "react";
import { AxiosError } from "axios";
import { useQueryClient } from "@tanstack/react-query";

export interface RemoveCardRequest {
  pan: string;
  email: string;
}

export const useRemoveCard = () => {
  const { message } = App.useApp();
  const { paymentInfo } = useStore((state) => state);
  const queryClient = useQueryClient();

  const { isPending, data, mutateAsync } = useHttpMutation<
    RemoveCardRequest,
    { responseCode: string; responseMessage: string }
  >({
    url: "/api/Payments/RemoveCard",
    headers: {
      Authorization: `Bearer ${paymentInfo?.token}`,
    },
    onSuccess: (data) => {
      if (data?.responseCode === "00") {
        message.success(data?.responseMessage ?? "Card removed successfully");
        queryClient.invalidateQueries({ queryKey: ["saved-cards"] });
      }
    },
  });

  const onRemoveCard = useCallback(
    async (data: RemoveCardRequest) => {
      try {
        const response = await mutateAsync({ data });

        return response;
      } catch (error) {
        if (error instanceof AxiosError) {
          message.error(
            error.response?.data?.title ?? error.response?.data?.message,
          );
        } else if (error instanceof Error) {
          message.error(error.message);
        } else {
          message.error("Unable to process transaction");
        }
      }
    },
    [message, mutateAsync],
  );

  return {
    isPending,
    data,
    onRemoveCard,
  };
};

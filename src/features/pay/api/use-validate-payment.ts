import {
  errorModalProps,
  successModalProps,
  useHttpMutation,
  useStore,
} from "@/lib";
import { AxiosError } from "axios";
import { useCallback } from "react";
import { App } from "antd";
import type { ValidatePaymentRequest, ValidatePaymentResponse } from "./types";

export const useValidatePayment = () => {
  const { modal } = App.useApp();
  const { paymentInfo } = useStore((state) => state);

  const { isPending, data, mutateAsync } = useHttpMutation<
    ValidatePaymentRequest,
    ValidatePaymentResponse
  >({
    url: "/api/Payments/ValidatePayment",
    headers: {
      Authorization: `Bearer ${paymentInfo?.token}`,
    },
    onSuccess: (data) => {
      if (data?.responseCode === "04") {
        modal.error({
          ...errorModalProps(paymentInfo?.callbackUrl, data),
          content: data?.responseMessage,
        });
      }

      if (data?.responseCode === "02") {
        modal.error({
          ...errorModalProps(paymentInfo?.callbackUrl, data),
          content: data?.responseMessage ?? "Unable to process transaction",
        });
      }

      if (data?.responseCode === "00") {
        modal.success({
          ...successModalProps(paymentInfo?.callbackUrl, data),
          content: data?.responseMessage,
        });
      }
    },
  });

  const onValidatePayment = useCallback(
    async (data: ValidatePaymentRequest) => {
      try {
        const response = await mutateAsync({
          data: { ...data, entryType: 0 },
        });
        return response;
      } catch (error) {
        if (error instanceof AxiosError) {
          modal.error({
            ...errorModalProps(paymentInfo?.callbackUrl),
            content:
              error.response?.data?.title ??
              error.response?.data?.message ??
              "Unable to process transaction at this time",
          });
        } else if (error instanceof Error) {
          modal.error({
            ...errorModalProps(paymentInfo?.callbackUrl),
            content: error.message,
          });
        } else {
          modal.error({
            ...errorModalProps(paymentInfo?.callbackUrl),
            content: "Unable to process transaction",
          });
        }
      }
    },
    [modal, mutateAsync, paymentInfo?.callbackUrl],
  );

  return {
    onValidatePayment,
    isPending,
    data,
  };
};

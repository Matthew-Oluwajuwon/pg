import { errorModalProps, useHttpMutation, useStore } from "@/lib";
import { AxiosError } from "axios";
import { useCallback } from "react";
import { App } from "antd";

export interface ValidatePaymentRequest {
  transactionId: string;
  providerReference: string;
  otp?: string;
  entryType?: number;
}

export const useValidatePayment = () => {
  const { modal } = App.useApp();
  const { paymentInfo } = useStore((state) => state);

  const { isPending, data, mutateAsync } = useHttpMutation<
    ValidatePaymentRequest,
    unknown
  >({
    url: "/api/Payments/ValidatePayment",
    headers: {
      Authorization: `Bearer ${paymentInfo?.token}`,
    },
    // onSuccess: (data) => {
    //   if (data?.responseCode === "04") {
    //     message.error(data?.responseMessage);
    //   }
    // },
  });

  const onValidatePayment = useCallback(
    async (data: ValidatePaymentRequest) => {
      try {
        const response = await mutateAsync({
          data: { ...data, entryType: 0, otp: "" },
        });
        return response;
      } catch (error) {
        if (error instanceof AxiosError) {
          modal.error({
            ...errorModalProps(paymentInfo?.callbackUrl),
            content: error.response?.data?.title,
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

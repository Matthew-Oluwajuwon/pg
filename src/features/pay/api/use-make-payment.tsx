import { errorModalProps, useHttpMutation, useStore } from "@/lib";
import { App } from "antd";
import { useCallback } from "react";
import type { MakePaymentRequest } from "./types";
import { AxiosError } from "axios";

export interface MakePaymentResponse {
  responseCode: string;
  responseMessage: string;
  authenticatePaymentResponseCode: string;
  authenticatePaymentResponseMessage: string;
  transactionId: string;
  providerReference: string;
  transactionNumber: string;
  isWebhookUrlSet: boolean;
  accountNumber: string;
  accountName: string;
  bankName: string;
}

export const useMakePayment = () => {
  const { modal } = App.useApp();
  const { paymentInfo } = useStore((state) => state);
  const { isPending, data, mutateAsync } = useHttpMutation<
    MakePaymentRequest,
    MakePaymentResponse
  >({
    url: "/api/Payments/MakePayment",
    headers: {
      Authorization: `Bearer ${paymentInfo?.token}`,
    },
    onSuccess: (data) => {
      if (data?.responseCode === "04") {
        modal.error({
          ...errorModalProps(paymentInfo?.callbackUrl),
          content: data?.responseMessage,
        });
      }
    },
  });

  const onMakePayment = useCallback(
    async (data: MakePaymentRequest) => {
      const [expiryMonth, expiryYear] = data.expiryDate?.split("/") ?? ["", ""];
      const cardNumber = data.cardNumber?.split(" ").join("");

      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { expiryDate, ...rest } = data;

      try {
        const response = await mutateAsync({
          data: {
            ...rest,
            accessCode: paymentInfo?.reference,
            amount: paymentInfo?.amount,
            ...(expiryMonth && { expiryMonth }),
            ...(expiryYear && { expiryYear }),
            ...(cardNumber && { cardNumber }),
            authenticationResend: "",
            billingAddress: "",
            billingCity: "",
            billingCountry: "",
            billingState: "",
            billingZip: "",
            bvn: "",
            callbackUrl: paymentInfo?.callbackUrl,
            country: "Nigeria",
            currency: paymentInfo?.currency,
            dateOfBirth: "",
            deviceFingerPrint: "",
            deviceInformation: {
              httpBrowserColorDepth: 0,
              httpBrowserJavaEnabled: true,
              httpBrowserJavaScriptEnabled: true,
              httpBrowserLanguage: navigator.language,
              httpBrowserScreenHeight: window.innerHeight,
              httpBrowserScreenWidth: window.innerWidth,
              httpBrowserTimeDifference: "",
              userAgentBrowserValue: navigator.userAgent,
            },
            email: paymentInfo?.email,
            encrypted: "",
            entryType: 0,
            firstName: "John",
            invoiceId: "",
            ip: "",
            isRecurring: false,
            isStaticRoute: 0,
            lastName: "Doe",
            merchantId: 0,
            merchantType: 0,
            metaData: "",
            mode: 0,
            narration: "",
            pageKey: "",
            phoneNumber: "",
            productDescription: paymentInfo?.productDescription,
            productId: paymentInfo?.productId,
            productKey: "",
            redirectUrl: paymentInfo?.callbackUrl,
            transactionId: paymentInfo?.transactionId,
            walletOption: "",
          },
        });

        return response;
      } catch (error) {
        if (error instanceof AxiosError) {
          modal.error({
            ...errorModalProps(paymentInfo?.callbackUrl),
            content: error.response?.data?.message,
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
    [
      modal,
      mutateAsync,
      paymentInfo?.amount,
      paymentInfo?.callbackUrl,
      paymentInfo?.currency,
      paymentInfo?.email,
      paymentInfo?.productDescription,
      paymentInfo?.productId,
      paymentInfo?.reference,
      paymentInfo?.transactionId,
    ],
  );

  return {
    isPending,
    data,
    onMakePayment,
  };
};

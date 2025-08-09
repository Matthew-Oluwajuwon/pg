import { errorModalProps, useHttpMutation, useStore } from "@/lib";
import { App } from "antd";
import { useCallback } from "react";
import type { MakePaymentRequest, MakePaymentResponse } from "./types";
import { AxiosError } from "axios";
import { encryptPayload } from "@/lib/utils/encryt-payload.utils";

export const useMakePayment = () => {
  const { modal } = App.useApp();
  const { paymentInfo, setMakePaymentSuccessful } = useStore((state) => state);
  const { isPending, data, mutateAsync } = useHttpMutation<
    MakePaymentRequest,
    MakePaymentResponse
  >({
    url: "/api/Payments/MakePayment",
    headers: {
      Authorization: `Bearer ${paymentInfo?.token}`,
    },
    onSuccess: (data) => {
      if (
        data?.responseCode === "04" ||
        data?.authenticatePaymentResponseCode === "04" ||
        data?.authenticatePaymentResponseCode === "02"
      ) {
        modal.error({
          ...errorModalProps(paymentInfo?.callbackUrl, data),
          content:
            data?.responseMessage ??
            data?.authenticatePaymentResponseMessage ??
            "Unable to process transaction at this time",
        });
      }

      if (data?.responseCode === "06") {
        setMakePaymentSuccessful(true);
      }
    },
  });

  const onMakePayment = useCallback(
    async (data: MakePaymentRequest) => {
      const cardNumberJoined = data.cardNumber?.split(" ").join("");

      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { expiryDate, cardNumber, cvv, expiryMonth, expiryYear, ...rest } =
        data;

      const date = new Date();
      const offset = date.getTimezoneOffset();

      try {
        const response = await mutateAsync({
          data: {
            ...rest,
            accessCode: paymentInfo?.reference,
            amount: paymentInfo?.amount,
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
              httpBrowserColorDepth: window.screen.colorDepth,
              httpBrowserJavaEnabled: window.navigator.javaEnabled(),
              httpBrowserJavaScriptEnabled: true,
              httpBrowserLanguage: navigator.language,
              httpBrowserScreenHeight: window.innerHeight,
              httpBrowserScreenWidth: window.innerWidth,
              httpBrowserTimeDifference: offset?.toString(),
              userAgentBrowserValue: navigator.userAgent,
            },
            email: paymentInfo?.email,
            encrypted: encryptPayload(
              JSON.stringify({
                cardNumber: cardNumberJoined ?? "",
                cvv: data?.cvv ?? "",
                expiryMonth: data?.expiryMonth ?? "",
                expiryYear: data?.expiryYear ?? "",
              }),
              paymentInfo?.publicKey ?? "",
            ),
            entryType: 0,
            firstName: paymentInfo?.firstName,
            invoiceId: "",
            ip: "",
            isRecurring: false,
            isStaticRoute: 0,
            lastName: paymentInfo?.lastName,
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
      paymentInfo?.publicKey,
      paymentInfo?.reference,
      paymentInfo?.transactionId,
      paymentInfo?.firstName,
      paymentInfo?.lastName,
    ],
  );

  return {
    isPending,
    data,
    onMakePayment,
  };
};

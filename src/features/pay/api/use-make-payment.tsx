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
    headers: { Authorization: `Bearer ${paymentInfo?.token}` },
    onSuccess: (res) => {
      const failureCodes = ["04", "02"];
      if (
        failureCodes.includes(res?.responseCode ?? "") ||
        failureCodes.includes(res?.authenticatePaymentResponseCode ?? "")
      ) {
        modal.error({
          ...errorModalProps(paymentInfo?.callbackUrl, res),
          content:
            res?.responseMessage ??
            res?.authenticatePaymentResponseMessage ??
            "Unable to process transaction at this time",
        });
      }
      if (res?.responseCode === "06") setMakePaymentSuccessful(true);
    },
  });

  const showError = useCallback(
    (msg?: string) =>
      modal.error({
        ...errorModalProps(paymentInfo?.callbackUrl),
        content: msg ?? "Unable to process transaction",
      }),
    [modal, paymentInfo?.callbackUrl],
  );

  const onMakePayment = useCallback(
    async (form: MakePaymentRequest) => {
      const { cardNumber, cvv, expiryMonth, expiryYear, ...restForm } = form;
      const {
        reference,
        amount,
        billingAddress,
        billingCity,
        billingCountry,
        billingState,
        billingZip,
        callbackUrl,
        currency,
        email,
        publicKey,
        firstName,
        lastName,
        phoneNumber,
        productDescription,
        productId,
        transactionId,
      } = paymentInfo || {};

      const payload: MakePaymentRequest = {
        ...restForm,
        accessCode: reference,
        amount,
        billingAddress,
        billingCity,
        billingCountry,
        billingState,
        billingZip,
        callbackUrl,
        country: billingCountry ?? "Nigeria",
        currency: currency ?? "NGN",
        deviceInformation: {
          httpBrowserColorDepth: screen.colorDepth,
          httpBrowserJavaEnabled: navigator.javaEnabled(),
          httpBrowserJavaScriptEnabled: true,
          httpBrowserLanguage: navigator.language,
          httpBrowserScreenHeight: innerHeight,
          httpBrowserScreenWidth: innerWidth,
          httpBrowserTimeDifference: new Date().getTimezoneOffset().toString(),
          userAgentBrowserValue: navigator.userAgent,
        },
        email,
        encrypted: encryptPayload(
          JSON.stringify({
            cardNumber: cardNumber?.replace(/\s/g, "") ?? "",
            cvv: cvv ?? "",
            expiryMonth: expiryMonth ?? "",
            expiryYear: expiryYear ?? "",
          }),
          publicKey ?? "",
        ),
        entryType: 0,
        firstName,
        lastName,
        phoneNumber,
        productDescription,
        productId,
        redirectUrl: callbackUrl,
        transactionId,
        authenticationResend: "",
        bvn: "",
        dateOfBirth: "",
        deviceFingerPrint: "",
        invoiceId: "",
        ip: "",
        isRecurring: false,
        isStaticRoute: 0,
        merchantId: 0,
        merchantType: 0,
        metaData: "",
        mode: 0,
        narration: "",
        pageKey: "",
        productKey: "",
        walletOption: "",
      };

      try {
        return await mutateAsync({ data: payload });
      } catch (err) {
        if (err instanceof AxiosError) showError(err.response?.data?.message);
        else if (err instanceof Error) showError(err.message);
        else showError();
      }
    },
    [mutateAsync, paymentInfo, showError],
  );

  return { isPending, data, onMakePayment };
};

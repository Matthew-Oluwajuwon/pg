import type { MakePaymentResponse, ValidatePaymentRequest } from "@/features";
import { errorModalProps, successModalProps, useStore } from "@/lib";
import { App } from "antd";
import { useEffect, useMemo, useRef } from "react";

export const usePaymentPolling = ({
  validatePaymentData,
  makePaymentData,
  onValidatePayment,
  validatePending,
  timeValue,
}: {
  validatePaymentData:
    | { responseCode: string; responseMessage: string }
    | undefined;
  makePaymentData: MakePaymentResponse | undefined;
  onValidatePayment: (data: ValidatePaymentRequest) => Promise<
    | {
        responseCode: string;
        responseMessage: string;
      }
    | undefined
  >;
  validatePending: boolean;
  timeValue: number;
}) => {
  const { paymentInfo } = useStore((state) => state);
  const { modal } = App.useApp();
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const shouldPoll =
    validatePaymentData?.responseCode === "05" &&
    makePaymentData?.providerReference &&
    makePaymentData?.transactionId &&
    timeValue > 0;

  useEffect(() => {
    if (!shouldPoll) {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      return;
    }

    intervalRef.current = setInterval(() => {
      onValidatePayment({
        providerReference: makePaymentData.providerReference,
        transactionId: makePaymentData.transactionId,
      });
    }, 5000);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [
    shouldPoll,
    onValidatePayment,
    makePaymentData?.providerReference,
    makePaymentData?.transactionId,
  ]);

  useEffect(() => {
    if (validatePaymentData?.responseCode === "02") {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      modal.error({
        ...errorModalProps(paymentInfo?.callbackUrl),
        content:
          validatePaymentData?.responseMessage ??
          "Unable to complete payment at this time",
      });
    }
  }, [
    validatePaymentData?.responseCode,
    validatePaymentData?.responseMessage,
    modal,
    paymentInfo?.callbackUrl,
  ]);

  useEffect(() => {
    if (validatePaymentData?.responseCode === "00") {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      modal.success({
        ...successModalProps(paymentInfo?.callbackUrl),
        content:
          validatePaymentData?.responseMessage ??
          "A receipt of the payment has been sent to your mail",
      });
    }
  }, [
    validatePaymentData?.responseCode,
    validatePaymentData?.responseMessage,
    modal,
    paymentInfo?.callbackUrl,
  ]);

  const isPolling = useMemo(
    () => shouldPoll || validatePending,
    [shouldPoll, validatePending],
  );

  return { isPolling };
};

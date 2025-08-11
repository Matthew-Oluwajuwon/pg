import { useEffect, useState } from "react";
import { App } from "antd";
import { errorModalProps, useStore } from "@/lib";
import {
  useMakePayment,
  useTimer,
  useValidatePayment,
  type MakePaymentResponse,
  type ValidatePaymentResponse,
} from "@/features";
import { PAYMENT_METHODS_TYPE, TEMPORARY_BANK_CODE } from "@/config";

export const useBankTransfer = () => {
  const { modal } = App.useApp();
  const [showValidation, setShowValidation] = useState(false);

  const { paymentInfo } = useStore((state) => state);

  const { timeRemaining } = useTimer(600);
  const { timeRemaining: validateTimer, timeValue: validateTimeValue } =
    useTimer(300);

  const { onMakePayment, isPending, data } = useMakePayment();
  const {
    onValidatePayment,
    isPending: validatePaymentLoading,
    data: validatePaymentData,
  } = useValidatePayment();

  useEffect(() => {
    onMakePayment({
      paymentType: PAYMENT_METHODS_TYPE.BANK_TRANSFER,
      bankCode: TEMPORARY_BANK_CODE,
    });
  }, [onMakePayment]);

  useEffect(() => {
    if (showValidation) {
      onValidatePayment({
        providerReference: data?.providerReference ?? "",
        transactionId: paymentInfo?.transactionId ?? "",
        entryType: 0,
        otp: "",
      });
    }
  }, [
    showValidation,
    data?.providerReference,
    paymentInfo?.transactionId,
    onValidatePayment,
  ]);

  useEffect(() => {
    if (validateTimeValue === 0) {
      modal.error({
        ...errorModalProps(paymentInfo?.callbackUrl, {
          authenticatePaymentResponseMessage:
            "Transaction validation timed out",
          responseCode: "02",
          responseMessage: "Transaction validation timed out",
          providerReference: "",
        } as ValidatePaymentResponse | MakePaymentResponse),
        content: "Transaction validation timed out, try again",
      });
    }
  }, [validateTimeValue, modal, paymentInfo?.callbackUrl, validatePaymentData]);

  return {
    isPending,
    timeRemaining,
    data,
    showValidation,
    setShowValidation,
    validateTimer,
    validatePaymentLoading,
    validateTimeValue,
  };
};

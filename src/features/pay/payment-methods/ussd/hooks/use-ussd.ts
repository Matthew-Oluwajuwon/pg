import type { DefaultOptionType } from "antd/es/select";
import { useMemo } from "react";
import { useGetUSSDBanks, type USSDBanks } from "../api";
import { useMakePayment, useTimer, useValidatePayment } from "@/features";

export const useUSSD = () => {
  const { data, isLoading } = useGetUSSDBanks();
  const { timeRemaining } = useTimer(300);
  const { onMakePayment, data: makePaymentData, isPending } = useMakePayment();
  const {
    onValidatePayment,
    isPending: validatePaymentIsPending,
    data: validatePaymentData,
  } = useValidatePayment();

  const bankOptions = useMemo<DefaultOptionType[]>(() => {
    return (data ?? []).map((bank) => ({
      label: bank.bankName,
      value: JSON.stringify(bank),
    }));
  }, [data]);

  const handleBankChange = async (value: string) => {
    const selectedBank = JSON.parse(value) as USSDBanks;

    const response = await onMakePayment({
      paymentType: 3,
      ussdString: selectedBank.ussdString,
      bankCode: selectedBank.bankCode,
    });

    if (response?.responseCode === "05") {
      await onValidatePayment({
        providerReference: response.providerReference!,
        transactionId: response.transactionId!,
      });
    }
  };

  return {
    handleBankChange,
    bankOptions,
    isLoading,
    makePaymentData,
    isPending,
    validatePaymentIsPending,
    validatePaymentData,
    timeRemaining,
  };
};

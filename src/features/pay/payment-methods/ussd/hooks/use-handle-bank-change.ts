import type { useMakePayment, useValidatePayment } from "@/features";
import type { USSDBanks } from "../api";

export const useHandleBankChange = (
  onMakePayment: ReturnType<typeof useMakePayment>["onMakePayment"],
  onValidatePayment: ReturnType<typeof useValidatePayment>["onValidatePayment"],
) => {
  return async (value: string) => {
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
};

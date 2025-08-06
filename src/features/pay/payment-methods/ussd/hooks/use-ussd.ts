import type { DefaultOptionType } from "antd/es/select";
import { useMemo } from "react";
import { useGetUSSDBanks } from "../api";
import {
  useMakePayment,
  usePaymentPolling,
  useTimer,
  useTransactionTimeout,
  useValidatePayment,
  type ApiResponse,
  type MakePaymentResponse,
} from "@/features";
import { useStore } from "@/lib";
import { useHandleBankChange } from "./use-handle-bank-change";

interface UseUSSDReturn {
  handleBankChange: ReturnType<typeof useHandleBankChange>;
  bankOptions: DefaultOptionType[];
  isLoading: boolean;
  makePaymentData: MakePaymentResponse | undefined;
  isPending: boolean;
  validatePaymentIsPending: boolean;
  validatePaymentData:
    | Pick<ApiResponse<unknown>, "responseCode" | "responseMessage">
    | undefined;
  timeRemaining: string;
}

/**
 * Custom hook to manage USSD payment flow.
 *
 * Handles:
 * - Fetching available USSD banks.
 * - Payment initiation and validation.
 * - Payment polling and timeout.
 * - Bank change logic.
 *
 * @returns {UseUSSDReturn} Object containing USSD payment state and handlers.
 */
export const useUSSD = (): UseUSSDReturn => {
  const { paymentInfo } = useStore((state) => state);
  const { data, isLoading } = useGetUSSDBanks();
  const { timeRemaining, timeValue } = useTimer(300); // 5 minutes timeout
  const { onMakePayment, data: makePaymentData, isPending } = useMakePayment();
  const {
    onValidatePayment,
    isPending: validatePending,
    data: validateData,
  } = useValidatePayment();

  const handleBankChange = useHandleBankChange(
    onMakePayment,
    onValidatePayment,
  );

  const bankOptions = useMemo<DefaultOptionType[]>(() => {
    return (data ?? []).map((bank) => ({
      label: bank.bankName,
      value: JSON.stringify(bank),
    }));
  }, [data]);

  useTransactionTimeout(timeValue, paymentInfo?.callbackUrl);

  const { isPolling } = usePaymentPolling({
    validatePaymentData: validateData,
    makePaymentData,
    onValidatePayment,
    validatePending,
    timeValue,
  });

  return {
    handleBankChange,
    bankOptions,
    isLoading,
    makePaymentData,
    isPending,
    validatePaymentIsPending: isPolling,
    validatePaymentData: validateData,
    timeRemaining,
  };
};

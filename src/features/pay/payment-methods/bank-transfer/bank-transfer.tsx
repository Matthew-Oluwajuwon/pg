import { useStore } from "@/lib";
import {
  PaymentLoading,
  PaymentValidation,
  BankTransferForm,
} from "./component";
import { useBankTransfer } from "./hooks";

export const BankTransfer = () => {
  const {
    isPending,
    timeRemaining,
    data,
    showValidation,
    setShowValidation,
    validateTimer,
    validatePaymentLoading,
  } = useBankTransfer();

  const { paymentInfo } = useStore((state) => state);

  if (isPending) return <PaymentLoading />;

  if (showValidation)
    return <PaymentValidation validateTimer={validateTimer} />;

  return (
    <BankTransferForm
      paymentInfo={paymentInfo}
      data={data}
      timeRemaining={timeRemaining}
      onTransferDone={() => setShowValidation(true)}
      loading={validatePaymentLoading}
    />
  );
};

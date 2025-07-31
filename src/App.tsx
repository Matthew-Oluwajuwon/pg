import { useEffect, useState } from "react";
import {
  BankTransfer,
  Card,
  PaymentGatewayLayoutWrapper,
  USSD,
} from "./features";
import { AntdProvider, emitter, ReactQueryProvider } from "./lib";

const App = () => {
  const [selectedPaymentMethodIndex, setSelectedPaymentMethodIndex] =
    useState(0);
  const paymentContents = [
    { key: 1, content: <Card /> },
    { key: 2, content: <BankTransfer /> },
    { key: 3, content: <USSD /> },
  ];

  useEffect(() => {
    const handlePaymentMethodSelected = (value: number) => {
      setSelectedPaymentMethodIndex(value);
    };

    emitter.on("payment-method:selected", handlePaymentMethodSelected);

    return () => {
      emitter.off("payment-method:selected", handlePaymentMethodSelected);
    };
  }, []);

  return (
    <AntdProvider>
      <ReactQueryProvider>
        <PaymentGatewayLayoutWrapper>
          {paymentContents[selectedPaymentMethodIndex].content}
        </PaymentGatewayLayoutWrapper>
      </ReactQueryProvider>
    </AntdProvider>
  );
};

export default App;

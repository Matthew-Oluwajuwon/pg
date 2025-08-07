import { ConfigProvider, Radio, type RadioChangeEvent } from "antd";
import "./style.css";
import { emitter } from "@/lib";
import type { FC } from "react";
import type { PaymentInfoData } from "../../api";

const paymentOptions = [
  { value: 0, label: "Debit Card", key: "cardPayment" },
  { value: 1, label: "Bank Transfer", key: "bankTrasferPayment" },
  { value: 2, label: "USSD", key: "ussdPayment" },
  // { value: 3, label: "Account", key: "accountPayment" },
  // { value: 4, label: "QR Code", key: "qrPayment" },
  // { value: 5, label: "eNaira", key: "eNaira" },
  // { value: 6, label: "Wallet", key: "walletPayment" },
];

export const SideBar: FC<{ paymentInfo: PaymentInfoData }> = () => {
  const onChange = (e: RadioChangeEvent) => {
    emitter.emit("payment-method:selected", e.target.value);
  };

  // const filteredOptions = paymentOptions
  //   .filter((opt) => paymentInfo?.[opt.key as keyof PaymentInfoData])
  //   .map((opt) => ({
  //     value: opt.value,
  //     label: opt.label,
  //     className: "!text-[#000000B2]",
  //   }));

  return (
    <ConfigProvider
      theme={{
        components: {
          Radio: {
            dotSize: 9,
            colorBorder: "#E4E5E7",
            colorPrimaryBorderHover: "#E4E5E7",
            fontSize: 12,
          },
        },
      }}
    >
      <Radio.Group
        onChange={onChange}
        defaultValue={0}
        options={paymentOptions}
      />
    </ConfigProvider>
  );
};

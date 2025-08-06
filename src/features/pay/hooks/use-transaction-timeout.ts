import { errorModalProps } from "@/lib";
import { App } from "antd";
import { useEffect } from "react";

export const useTransactionTimeout = (
  timeValue: number,
  callbackUrl?: string,
) => {
  const { modal } = App.useApp();

  useEffect(() => {
    if (timeValue === 0) {
      modal.error({
        ...errorModalProps(callbackUrl),
        content: "Transaction timeout please try again",
      });
    }
  }, [modal, callbackUrl, timeValue]);
};

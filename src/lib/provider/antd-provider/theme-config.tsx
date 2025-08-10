import type { ModalFuncProps, ThemeConfig } from "antd";
import failed from "@/assets/svgs/failed.svg";
import success from "@/assets/svgs/success.svg";
import type { MakePaymentResponse, ValidatePaymentResponse } from "@/features";
import { isValidUrl } from "@/lib/utils";

export const themeConfig: ThemeConfig = {
  token: {
    colorPrimary: "#313EF7",
  },
  components: {
    Button: {
      boxShadow: "none",
      colorPrimary: "#313EF7",
    },
    Input: {
      colorTextPlaceholder: "#00000050",
      colorTextLabel: "#ff0000",
    },
  },
};

export const errorModalProps = (
  callbackUrl?: string,
  data?: ValidatePaymentResponse | MakePaymentResponse,
): ModalFuncProps => {
  return {
    title: "Payment Failed",
    okText: isValidUrl(callbackUrl) ? "Done" : "Close Window",
    onOk: () => {
      if (window.self !== window.parent) {
        window.parent.postMessage(
          {
            status: "failed",
            data,
            action: "payment-result",
          },
          "*",
        );
        return;
      }
      if (callbackUrl && isValidUrl(callbackUrl)) {
        window.location.replace(callbackUrl);
      } else {
        window.location.replace("about:blank");
      }
    },
    icon: (<img src={failed} alt="failed-payment" />) as React.ReactNode,
    okButtonProps: {
      block: true,
      className: "mt-5 !py-8 !bg-[#313EF7]",
    },
  };
};

export const successModalProps = (
  callbackUrl?: string,
  data?: ValidatePaymentResponse,
): ModalFuncProps => {
  return {
    title: "Payment Successful",
    okText: isValidUrl(callbackUrl) ? "Back To Store" : "Close Window",
    onOk: () => {
      if (window.self !== window.parent) {
        window.parent.postMessage(
          {
            status: "success",
            data,
            action: "payment-result",
          },
          "*",
        );
        return;
      }
      if (callbackUrl && isValidUrl(callbackUrl)) {
        window.location.replace(callbackUrl);
      } else {
        window.location.replace("about:blank");
      }
    },
    icon: <img src={success} alt="failed-payment" />,
    okButtonProps: {
      block: true,
      className: "mt-5 !py-8 !bg-[#313EF7]",
    },
  };
};

import type { ModalFuncProps, ThemeConfig } from "antd";
import failed from "@/assets/svgs/failed.svg";
import success from "@/assets/svgs/success.svg";

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
      fontSize: 1,
    },
  },
};

export const errorModalProps = (callbackUrl?: string): ModalFuncProps => {
  return {
    title: "Payment Failed",
    // centered: true,
    okText: "Done",
    onOk: () => {
      if (callbackUrl) {
        window.location.replace(callbackUrl);
      }
    },
    icon: <img src={failed} alt="failed-payment" />,
    okButtonProps: {
      block: true,
      className: "mt-5 !py-8 !bg-[#313EF7]",
    },
  };
};

export const successModalProps = (callbackUrl?: string): ModalFuncProps => {
  return {
    title: "Payment Successful",
    // centered: true,
    okText: "Back To Store",
    onOk: () => {
      if (callbackUrl) {
        window.location.replace(callbackUrl);
      }
    },
    icon: <img src={success} alt="failed-payment" />,
    okButtonProps: {
      block: true,
      className: "mt-5 !py-8 !bg-[#313EF7]",
    },
  };
};

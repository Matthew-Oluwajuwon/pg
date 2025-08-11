import type { FormProps } from "antd/es/form";

export const defaultStaleTime = 30 * 60 * 1000;
export const formConfig: FormProps = {
  layout: "vertical",
  labelCol: { span: 24 },
  wrapperCol: { span: 24 },
  colon: false,
  requiredMark: false,
  hideRequiredMark: true,
  size: "large",
  scrollToFirstError: true,
  validateMessages: {
    required: "${label} is required!",
    types: {
      email: "${label} is not a valid email!",
      number: "${label} is not a valid number!",
    },
    number: {
      range: "${label} must be between ${min} and ${max}",
    },
  },
};

export const CardTypes = {
  MASTERCARD: "mastercard",
  VISA: "visa",
  VERVE: "verve",
  AFRIGROBAL: "afriglobal",
  AMERICAN_EXPRESS: "american_express",
  DINERS_CLUB: "diners_club",
  JCB: "jcb",
  DISCOVER: "discover",
  MAESTRO: "maestro",
  NOT_FOUND: "",
} as const;

export const TEMPORARY_BANK_CODE = "044";

export const PAYMENT_METHODS_TYPE = {
  BANK_TRANSFER: 5,
  CARD: 0,
  USSD: 3,
} as const;

export const PAYMENT_RESULT_STATUS = {
  SUCCESS: "SUCCESS",
  FAILED: "FAILED",
} as const;

export const LOADING_MESSAGE = "Processing please wait...";

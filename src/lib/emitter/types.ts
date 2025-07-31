import type { PaymentInfoData } from "@/features";

export type AppEvents = {
  "payment-method:selected": number;
  "payment-info:loaded": PaymentInfoData;
};

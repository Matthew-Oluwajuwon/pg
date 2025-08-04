import type { PaymentInfoData } from "@/features";
import { create } from "zustand";

interface PaymentStore {
  paymentInfo: PaymentInfoData | null;
  setPaymentInfo: (info: PaymentInfoData) => void;
  clearPaymentInfo: () => void;
}

export const useStore = create<PaymentStore>((set) => ({
  paymentInfo: null,
  setPaymentInfo: (info) => set({ paymentInfo: info }),
  clearPaymentInfo: () => set({ paymentInfo: null }),
}));

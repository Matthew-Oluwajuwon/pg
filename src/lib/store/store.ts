import type { PaymentInfoData, SavedCards } from "@/features";
import { create } from "zustand";

interface PaymentStore {
  paymentInfo: PaymentInfoData | null;
  selectedSavedCard: SavedCards | null;
  cardOption: string;
  isMakePaymentSuccessful: boolean | null;
  setMakePaymentSuccessful: (value: boolean | null) => void;
  setCardOption: (value: string) => void;
  setSelectedSavedCard: (card: SavedCards | null) => void;
  setPaymentInfo: (info: PaymentInfoData) => void;
  clearPaymentInfo: () => void;
}

export const useStore = create<PaymentStore>((set) => ({
  paymentInfo: null,
  selectedSavedCard: null,
  cardOption: "1",
  isMakePaymentSuccessful: null,
  setMakePaymentSuccessful: (value) => set({ isMakePaymentSuccessful: value }),
  setCardOption: (value) => set({ cardOption: value }),
  setSelectedSavedCard: (card) => set({ selectedSavedCard: card }),
  setPaymentInfo: (info) => set({ paymentInfo: info }),
  clearPaymentInfo: () => set({ paymentInfo: null }),
}));

export interface ApiResponse<T> {
  responseCode: string;
  responseMessage: string;
  data: T;
}

export interface PaymentInfoData {
  email: string;
  amount: string;
  transactionId: string;
  link: string;
  reference: string;
  businessName: string;
  isActive: boolean;
  cardPayment: boolean;
  accountPayment: boolean;
  ussdPayment: boolean;
  qrPayment: boolean;
  eNaira: boolean;
  walletPayment: boolean;
  bankTrasferPayment: boolean;
  webHookUrl: string;
  token: string;
  currency: string;
  callbackUrl: string;
  publicKey: string;
  transactionHistoryId: number;
  productId: string;
  productDescription: string;
  totalAmount: string;
  isChargeTransferedToCustomer: boolean;
  isPaymentPageCustomizationEnabled: boolean;
  customization: Customization;
  merchantCode: string;
}

export interface Customization {
  bodyColor: string;
  buttonColor: string;
  footerText: string;
  footerLink: string;
  footerLogo: string;
}

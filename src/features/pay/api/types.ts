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
  firstName: string;
  lastName: string;
  billingCountry: string;
  billingState: string;
  billingZip: string;
  billingCity: string;
  billingAddress: string;
  phoneNumber?: string;
}

export interface Customization {
  bodyColor: string;
  buttonColor: string;
  footerText: string;
  footerLink: string;
  footerLogo: string;
}

export interface MakePaymentRequest {
  transactionId?: string;
  paymentType?: number;
  mode?: number;
  bankCode?: string;
  accountNumber?: string;
  accountName?: string;
  cardNumber?: string;
  cvv?: string;
  expiryMonth?: string;
  expiryYear?: string;
  expiryDate?: string;
  currency?: string;
  country?: string;
  amount?: string;
  email?: string;
  phoneNumber?: string;
  firstName?: string;
  lastName?: string;
  ip?: string;
  dateOfBirth?: string;
  bvn?: string;
  redirectUrl?: string;
  billingZip?: string;
  billingCity?: string;
  deviceFingerPrint?: string;
  billingAddress?: string;
  billingState?: string;
  billingCountry?: string;
  pin?: string;
  callbackUrl?: string;
  productId?: string;
  productDescription?: string;
  pageKey?: string;
  productKey?: string;
  authenticationResend?: string;
  merchantType?: number;
  metaData?: string;
  narration?: string;
  merchantId?: number;
  cardBrand?: string;
  token?: string;
  entryType?: number;
  deviceInformation?: DeviceInformation;
  walletOption?: string;
  invoiceId?: string;
  isRecurring?: boolean;
  isStaticRoute?: number;
  ussdString?: string;
  encrypted?: string;
  accessCode?: string;
  cardHolderName?: string;
}

export interface DeviceInformation {
  httpBrowserLanguage?: string;
  httpBrowserJavaEnabled?: boolean;
  httpBrowserJavaScriptEnabled?: boolean;
  httpBrowserColorDepth?: number;
  httpBrowserScreenHeight?: number;
  httpBrowserScreenWidth?: number;
  httpBrowserTimeDifference?: string;
  userAgentBrowserValue?: string;
}

export interface MakePaymentResponse {
  responseCode: string;
  responseMessage: string;
  authenticatePaymentResponseCode: string;
  authenticatePaymentResponseMessage: string;
  transactionId: string;
  providerReference: string;
  transactionNumber: string;
  isWebhookUrlSet: boolean;
  accountNumber: string;
  accountName: string;
  bankName: string;
}

export interface ValidatePaymentRequest {
  transactionId: string;
  providerReference: string;
  otp?: string;
  entryType?: number;
}

export interface ValidatePaymentResponse {
  responseCode: string;
  responseMessage: string;
  orderReference: string;
  chargedAmount: string;
  providerReference: string;
}

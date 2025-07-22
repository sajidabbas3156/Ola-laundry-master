
export interface PaymentOption {
  id: string;
  name: string;
  icon: React.ReactNode;
  processingTime: string;
  fee: number;
  minAmount?: number;
  enabled: boolean;
}

export interface CardDetails {
  number: string;
  expiry: string;
  cvv: string;
  name: string;
}

export interface CustomerPaymentOptionsProps {
  orderTotal: number;
  onPaymentSelect: (paymentMethodId: string, paymentDetails?: any) => void;
}

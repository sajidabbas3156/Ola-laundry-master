
export interface DeliveryServiceSettings {
  enabled: boolean;
  price: number;
  radius?: number;
}

export interface ServiceSettings {
  id: string;
  name: string;
  description: string;
  priceMultiplier: number;
  customPrices: Record<string, number>;
}

export interface StaffRole {
  id: string;
  name: string;
  permissions: string[];
}

export interface ReceiptSettings {
  businessName: string;
  address: string;
  phone: string;
  showLogo: boolean;
  showCustomerDetails: boolean;
  footerMessage: string;
}

export interface TaxSettings {
  defaultTaxRate: number;
  taxIncluded: boolean;
  taxDisplayName: string;
}

export interface PaymentMethodSettings {
  [key: string]: string;
}

export interface PaymentMethod {
  id: string;
  name: string;
  enabled: boolean;
  settings: PaymentMethodSettings;
  processingFee: number;
}

export interface PrinterSettings {
  defaultPrinter: string;
  autoprint: boolean;
  paperSize: string;
  copies: number;
  enableCashDrawer: boolean;
  printSpeed: string;
  paperType: string;
  pinEnabled: boolean;
  pinCode: string;
  requirePinForReprint: boolean;
}

export interface DiscountSettings {
  id: string;
  name: string;
  type: 'percentage' | 'fixed';
  value: number;
  enabled: boolean;
  minOrderAmount?: number;
  maxDiscountAmount?: number;
  validFrom?: Date;
  validTo?: Date;
}

export interface TagSettings {
  id: string;
  name: string;
  color: string;
  description: string;
  enabled: boolean;
}

export interface ReceiptData {
  id: string;
  orderId: string;
  customerName: string;
  customerPhone: string;
  items: any[];
  total: number;
  date: Date;
  notes?: string;
  status: 'printed' | 'pending' | 'error';
}

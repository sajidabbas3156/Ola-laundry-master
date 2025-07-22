
export interface PromoCode {
  id: string;
  code: string;
  type: 'percentage' | 'fixed' | 'wallet-bonus';
  value: number;
  description: string;
  minOrderAmount?: number;
  maxDiscount?: number;
  validFrom: Date;
  validUntil: Date;
  usageLimit?: number;
  usedCount: number;
  isActive: boolean;
  tenantId: string;
}

export interface WalletTopUp {
  id: string;
  customerId: string;
  amount: number;
  bonusPercentage: number;
  bonusAmount: number;
  totalAmount: number;
  status: 'pending' | 'completed' | 'failed';
  createdAt: Date;
}

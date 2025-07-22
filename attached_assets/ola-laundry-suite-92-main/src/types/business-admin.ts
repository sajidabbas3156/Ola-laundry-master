
export interface Staff {
  id: string;
  name: string;
  role: StaffRole;
  email: string;
  phone: string;
  hourlyRate: number;
  permissions: string[];
  isActive: boolean;
  hireDate: Date;
  emergencyContact?: string;
}

export interface StaffRole {
  id: string;
  name: string;
  description: string;
  permissions: string[];
  color: string;
}

export interface Purchase {
  id: string;
  vendorId: string;
  date: Date;
  items: PurchaseItem[];
  totalAmount: number;
  paymentMethod: string;
  status: 'pending' | 'completed' | 'cancelled';
  notes?: string;
}

export interface PurchaseItem {
  id: string;
  name: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  category: string;
}

export interface Vendor {
  id: string;
  name: string;
  contactPerson: string;
  email: string;
  phone: string;
  address: string;
  category: string;
}

export interface ConsumableItem {
  id: string;
  name: string;
  category: string;
  currentStock: number;
  reorderLevel: number;
  unit: string;
  lastRestockDate: Date;
  costPerUnit: number;
  supplier: string;
}

export interface StockMovement {
  id: string;
  itemId: string;
  type: 'in' | 'out';
  quantity: number;
  date: Date;
  reason: string;
  staffId: string;
}

export interface BusinessReport {
  id: string;
  type: 'sales' | 'finance' | 'inventory';
  title: string;
  dateRange: {
    from: Date;
    to: Date;
  };
  data: any;
  generatedAt: Date;
}

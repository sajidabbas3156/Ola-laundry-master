export enum OrderStatus {
  PENDING = "pending",
  RECEIVED = "received",
  PROCESSING = "processing",
  READY = "ready",
  DELIVERED = "delivered",
  CANCELLED = "cancelled"
}

export interface Customer {
  id: string;
  tenantId: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  createdAt: Date;
}

export interface LaundryItem {
  id: string;
  tenantId: string;
  name: string;
  price: number;
  category: string;
  description: string;
  isAvailable: boolean;
}

export interface OrderItem {
  itemId: string;
  name: string;
  price: number;
  quantity: number;
  service?: string;
}

export interface Order {
  id: string;
  tenantId: string;
  customerId: string;
  customerName: string;
  customerPhone?: string;
  items: OrderItem[];
  total: number;
  subtotal?: number;
  tax?: number;
  discount?: number;
  serviceCharge?: number;
  status: OrderStatus;
  createdAt: Date;
  updatedAt: Date;
  pickupDate?: Date;
  notes?: string;
  paymentMethod?: string;
  serviceType?: string;
  scheduledDate?: Date;
  scheduledTime?: string;
  deliveryAddress?: string;
}

export interface Tenant {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  logo?: string;
  isActive: boolean;
  createdAt: Date;
  subscriptionPlan: 'free' | 'basic' | 'premium' | 'enterprise';
  subscriptionStatus: 'active' | 'trial' | 'expired' | 'cancelled';
  subdomain: string; // Added missing property
  trialEndsAt?: Date; // Added missing property
}

export interface TenantSettings {
  tenantId: string;
  businessHours: {
    monday: { isOpen: boolean, open: string, close: string },
    tuesday: { isOpen: boolean, open: string, close: string },
    wednesday: { isOpen: boolean, open: string, close: string },
    thursday: { isOpen: boolean, open: string, close: string },
    friday: { isOpen: boolean, open: string, close: string },
    saturday: { isOpen: boolean, open: string, close: string },
    sunday: { isOpen: boolean, open: string, close: string }
  };
  notificationSettings: {
    emailNotifications: boolean;
    smsNotifications: boolean;
    orderStatusUpdates: boolean;
    marketingEmails: boolean;
  };
  paymentMethods: string[];
  taxRate: number;
}

export const mockCustomers: Customer[] = [
  {
    id: "customer-1",
    tenantId: "tenant-1",
    name: "John Doe",
    email: "john.doe@example.com",
    phone: "123-456-7890",
    address: "123 Main St, Anytown, USA",
    createdAt: new Date('2024-01-15')
  },
  {
    id: "customer-2",
    tenantId: "tenant-1",
    name: "Jane Smith",
    email: "jane.smith@example.com",
    phone: "987-654-3210",
    address: "456 Oak Ave, Somewhere, USA",
    createdAt: new Date('2024-02-20')
  },
  {
    id: "customer-3",
    tenantId: "tenant-2",
    name: "Alice Johnson",
    email: "alice.johnson@example.com",
    phone: "555-123-4567",
    address: "789 Pine Rd, Elsewhere, USA",
    createdAt: new Date('2024-03-10')
  },
];

export const mockLaundryItems: LaundryItem[] = [
  {
    id: "item-1",
    tenantId: "tenant-1",
    name: "Wash & Fold",
    price: 20,
    category: "Laundry",
    description: "Standard wash and fold service.",
    isAvailable: true,
  },
  {
    id: "item-2",
    tenantId: "tenant-1",
    name: "Dry Cleaning",
    price: 15,
    category: "Dry Cleaning",
    description: "Professional dry cleaning service.",
    isAvailable: true,
  },
  {
    id: "item-3",
    tenantId: "tenant-1",
    name: "Ironing",
    price: 5,
    category: "Other",
    description: "Professional ironing service.",
    isAvailable: true,
  },
  {
    id: "item-4",
    tenantId: "tenant-2",
    name: "Wash & Press",
    price: 25,
    category: "Laundry",
    description: "Wash and press service.",
    isAvailable: true,
  },
  {
    id: "item-5",
    tenantId: "tenant-2",
    name: "Stain Removal",
    price: 10,
    category: "Other",
    description: "Professional stain removal service.",
    isAvailable: false,
  },
];

export const mockOrders: Order[] = [
  {
    id: "order-1",
    tenantId: "tenant-1",
    customerId: "customer-1",
    customerName: "John Doe",
    customerPhone: "123-456-7890",
    items: [
      { itemId: "item-1", name: "Wash & Fold", price: 20, quantity: 2, service: "Standard" },
      { itemId: "item-3", name: "Ironing", price: 5, quantity: 3, service: "Express" }
    ],
    subtotal: 55,
    tax: 4.4,
    total: 59.4,
    status: OrderStatus.PROCESSING,
    createdAt: new Date('2025-05-10'),
    updatedAt: new Date('2025-05-10'),
    pickupDate: new Date('2025-05-13'),
    paymentMethod: "cash",
    serviceType: "pickup"
  },
  {
    id: "order-2",
    tenantId: "tenant-1",
    customerId: "customer-2",
    customerName: "Jane Smith",
    customerPhone: "987-654-3210",
    items: [
      { itemId: "item-2", name: "Dry Cleaning", price: 15, quantity: 4, service: "Premium" }
    ],
    subtotal: 60,
    tax: 4.8,
    total: 64.8,
    status: OrderStatus.PENDING,
    createdAt: new Date('2025-05-11'),
    updatedAt: new Date('2025-05-11'),
    paymentMethod: "card",
    serviceType: "home-pickup"
  },
  {
    id: "order-3",
    tenantId: "tenant-1",
    customerId: "customer-1",
    customerName: "John Doe",
    customerPhone: "123-456-7890",
    items: [
      { itemId: "item-1", name: "Wash & Fold", price: 20, quantity: 1, service: "Standard" },
      { itemId: "item-2", name: "Dry Cleaning", price: 15, quantity: 1, service: "Express" }
    ],
    subtotal: 35,
    tax: 2.8,
    total: 37.8,
    status: OrderStatus.READY,
    createdAt: new Date('2025-05-09'),
    updatedAt: new Date('2025-05-11'),
    pickupDate: new Date('2025-05-12'),
    paymentMethod: "benefit",
    serviceType: "delivery"
  },
  {
    id: "order-4",
    tenantId: "tenant-2",
    customerId: "customer-3",
    customerName: "Alice Johnson",
    customerPhone: "555-123-4567",
    items: [
      { itemId: "item-4", name: "Wash & Press", price: 25, quantity: 2, service: "Standard" },
      { itemId: "item-5", name: "Stain Removal", price: 10, quantity: 1, service: "Premium" }
    ],
    subtotal: 60,
    tax: 4.8,
    total: 64.8,
    status: OrderStatus.DELIVERED,
    createdAt: new Date('2025-05-08'),
    updatedAt: new Date('2025-05-10'),
    pickupDate: new Date('2025-05-10'),
    paymentMethod: "cod",
    serviceType: "pickup"
  },
  {
    id: "order-5",
    tenantId: "tenant-1",
    customerId: "customer-2",
    customerName: "Jane Smith",
    customerPhone: "987-654-3210",
    items: [
      { itemId: "item-3", name: "Ironing", price: 5, quantity: 10, service: "Standard" }
    ],
    subtotal: 50,
    tax: 4.0,
    total: 54.0,
    status: OrderStatus.RECEIVED,
    createdAt: new Date('2025-05-12'),
    updatedAt: new Date('2025-05-12'),
    paymentMethod: "cash",
    serviceType: "pickup"
  }
];

export const mockTenants: Tenant[] = [
  {
    id: "tenant-1",
    name: "Clean Clothes Laundromat",
    email: "contact@cleanclothes.com",
    phone: "123-555-0123",
    address: "123 Laundry Ave, Washville, CA 90001",
    logo: "/assets/logos/tenant1.png",
    isActive: true,
    createdAt: new Date('2024-01-01'),
    subscriptionPlan: 'premium',
    subscriptionStatus: 'active',
    subdomain: "cleanclothes" // Added missing property
  },
  {
    id: "tenant-2",
    name: "Sparkle & Clean",
    email: "hello@sparkleandclean.com",
    phone: "456-555-0456",
    address: "456 Wash St, Soaptown, NY 10001",
    isActive: true,
    createdAt: new Date('2024-02-15'),
    subscriptionPlan: 'basic',
    subscriptionStatus: 'trial',
    subdomain: "sparkleandclean", // Added missing property
    trialEndsAt: new Date('2025-05-30') // Added missing property
  },
  {
    id: "tenant-3",
    name: "Fast Wash Laundry",
    email: "service@fastwash.com",
    phone: "789-555-0789",
    address: "789 Spinner Rd, Dryerville, TX 75001",
    isActive: false,
    createdAt: new Date('2024-03-20'),
    subscriptionPlan: 'free',
    subscriptionStatus: 'expired',
    subdomain: "fastwash" // Added missing property
  }
];

export const mockTenantSettings: TenantSettings[] = [
  {
    tenantId: "tenant-1",
    businessHours: {
      monday: { isOpen: true, open: "08:00", close: "20:00" },
      tuesday: { isOpen: true, open: "08:00", close: "20:00" },
      wednesday: { isOpen: true, open: "08:00", close: "20:00" },
      thursday: { isOpen: true, open: "08:00", close: "20:00" },
      friday: { isOpen: true, open: "08:00", close: "22:00" },
      saturday: { isOpen: true, open: "09:00", close: "18:00" },
      sunday: { isOpen: false, open: "00:00", close: "00:00" }
    },
    notificationSettings: {
      emailNotifications: true,
      smsNotifications: true,
      orderStatusUpdates: true,
      marketingEmails: false
    },
    paymentMethods: ["credit_card", "cash", "mobile_payment"],
    taxRate: 8.25
  },
  {
    tenantId: "tenant-2",
    businessHours: {
      monday: { isOpen: true, open: "07:00", close: "19:00" },
      tuesday: { isOpen: true, open: "07:00", close: "19:00" },
      wednesday: { isOpen: true, open: "07:00", close: "19:00" },
      thursday: { isOpen: true, open: "07:00", close: "19:00" },
      friday: { isOpen: true, open: "07:00", close: "19:00" },
      saturday: { isOpen: true, open: "08:00", close: "16:00" },
      sunday: { isOpen: true, open: "10:00", close: "15:00" }
    },
    notificationSettings: {
      emailNotifications: true,
      smsNotifications: false,
      orderStatusUpdates: true,
      marketingEmails: true
    },
    paymentMethods: ["credit_card", "cash", "check"],
    taxRate: 7.5
  }
];

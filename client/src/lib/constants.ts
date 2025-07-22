export const ORDER_STATUSES = {
  PENDING: "pending",
  PROCESSING: "processing",
  READY: "ready",
  DELIVERED: "delivered",
  CANCELLED: "cancelled",
} as const;

export const PAYMENT_STATUSES = {
  PENDING: "pending",
  PAID: "paid",
  REFUNDED: "refunded",
} as const;

export const USER_ROLES = {
  CUSTOMER: "customer",
  STAFF: "staff",
  ADMIN: "admin",
  DRIVER: "driver",
} as const;

export const MACHINE_STATUSES = {
  AVAILABLE: "available",
  IN_USE: "in_use",
  MAINTENANCE: "maintenance",
} as const;

export const SERVICE_CATEGORIES = {
  WASH_FOLD: "wash_fold",
  DRY_CLEAN: "dry_clean",
  EXPRESS: "express",
  ALTERATIONS: "alterations",
} as const;

export const PRICE_TYPES = {
  PER_LB: "per_lb",
  PER_ITEM: "per_item",
  FLAT_RATE: "flat_rate",
} as const;

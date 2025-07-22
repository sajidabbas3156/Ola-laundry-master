import { 
  pgTable, 
  text, 
  serial, 
  integer, 
  boolean, 
  timestamp, 
  decimal, 
  varchar,
  uuid,
  jsonb,
  index
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Users table for authentication and staff management with role-based access
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  firstName: varchar("first_name", { length: 100 }),
  lastName: varchar("last_name", { length: 100 }),
  phone: varchar("phone", { length: 20 }),
  password: text("password").notNull(),
  role: varchar("role", { length: 50 }).notNull().default("customer"), // superadmin, org_owner, branch_manager, inventory_manager, laundry_staff, cashier, delivery_agent, customer
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Customers table for customer-specific data
export const customers = pgTable("customers", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  address: text("address"),
  city: varchar("city", { length: 100 }),
  zipCode: varchar("zip_code", { length: 10 }),
  preferences: jsonb("preferences"), // washing preferences, notifications, etc.
  loyaltyPoints: integer("loyalty_points").default(0),
  createdAt: timestamp("created_at").defaultNow(),
});

// Services offered
export const services = pgTable("services", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 100 }).notNull(),
  description: text("description"),
  category: varchar("category", { length: 50 }).notNull(), // wash_fold, dry_clean, express, alterations
  priceType: varchar("price_type", { length: 20 }).notNull(), // per_lb, per_item, flat_rate
  basePrice: decimal("base_price", { precision: 10, scale: 2 }).notNull(),
  isActive: boolean("is_active").default(true),
  estimatedTime: integer("estimated_time"), // in minutes
  createdAt: timestamp("created_at").defaultNow(),
});

// Orders
export const orders = pgTable("orders", {
  id: serial("id").primaryKey(),
  customerId: integer("customer_id").references(() => customers.id).notNull(),
  totalAmount: decimal("total_amount", { precision: 10, scale: 2 }).notNull(),
  status: varchar("status", { length: 50 }).notNull().default("pending"), // pending, processing, ready, delivered, cancelled
  itemCount: integer("item_count").default(0),
  weight: decimal("weight", { precision: 5, scale: 2 }), // in lbs
  pickupDate: timestamp("pickup_date"),
  deliveryDate: timestamp("delivery_date"),
  estimatedCompletion: timestamp("estimated_completion"),
  actualCompletion: timestamp("actual_completion"),
  paymentStatus: varchar("payment_status", { length: 50 }).default("pending"), // pending, paid, refunded
  paymentMethod: varchar("payment_method", { length: 50 }),
  instructions: text("instructions"),
  processedBy: integer("processed_by").references(() => users.id), // staff who processed the order
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
}, (table) => [
  index("idx_orders_status").on(table.status),
]);

// Order items
export const orderItems = pgTable("order_items", {
  id: serial("id").primaryKey(),
  orderId: integer("order_id").references(() => orders.id).notNull(),
  serviceId: integer("service_id").references(() => services.id).notNull(),
  quantity: integer("quantity").notNull().default(1),
  unitPrice: decimal("unit_price", { precision: 10, scale: 2 }).notNull(),
  totalPrice: decimal("total_price", { precision: 10, scale: 2 }).notNull(),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Machines for equipment management  
export const machines = pgTable("machines", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 100 }).notNull(),
  type: varchar("type", { length: 50 }).notNull(), // washer, dryer
  status: varchar("status", { length: 50 }).notNull().default("available"), // available, in_use, maintenance
  location: varchar("location", { length: 100 }),
  capacity: decimal("capacity", { precision: 5, scale: 2 }), // in lbs
  timeRemaining: integer("time_remaining"), // in minutes
  currentOrderId: integer("current_order_id").references(() => orders.id),
  lastMaintenance: timestamp("last_maintenance"),
  nextMaintenance: timestamp("next_maintenance"),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
});

// Delivery routes
export const deliveryRoutes = pgTable("delivery_routes", {
  id: serial("id").primaryKey(),
  driverId: integer("driver_id").references(() => users.id).notNull(),
  date: timestamp("date").notNull(),
  status: varchar("status", { length: 50 }).notNull().default("planned"), // planned, active, completed
  totalDistance: decimal("total_distance", { precision: 8, scale: 2 }), // in miles
  estimatedDuration: integer("estimated_duration"), // in minutes
  actualDuration: integer("actual_duration"), // in minutes
  startTime: timestamp("start_time"),
  endTime: timestamp("end_time"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Delivery stops
export const deliveryStops = pgTable("delivery_stops", {
  id: serial("id").primaryKey(),
  routeId: integer("route_id").references(() => deliveryRoutes.id).notNull(),
  orderId: integer("order_id").references(() => orders.id).notNull(),
  stopOrder: integer("stop_order").notNull(),
  type: varchar("type", { length: 20 }).notNull(), // pickup, delivery
  address: text("address").notNull(),
  latitude: decimal("latitude", { precision: 10, scale: 8 }),
  longitude: decimal("longitude", { precision: 11, scale: 8 }),
  scheduledTime: timestamp("scheduled_time"),
  actualTime: timestamp("actual_time"),
  status: varchar("status", { length: 50 }).default("pending"), // pending, completed, failed
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Relations
export const usersRelations = relations(users, ({ many }) => ({
  customers: many(customers),
  orders: many(orders),
  routes: many(deliveryRoutes),
}));

export const customersRelations = relations(customers, ({ one, many }) => ({
  user: one(users, {
    fields: [customers.userId],
    references: [users.id],
  }),
  orders: many(orders),
}));

export const ordersRelations = relations(orders, ({ one, many }) => ({
  customer: one(customers, {
    fields: [orders.customerId],
    references: [customers.id],
  }),
  processedByUser: one(users, {
    fields: [orders.processedBy],
    references: [users.id],
  }),
  items: many(orderItems),
  deliveryStops: many(deliveryStops),
}));

export const orderItemsRelations = relations(orderItems, ({ one }) => ({
  order: one(orders, {
    fields: [orderItems.orderId],
    references: [orders.id],
  }),
  service: one(services, {
    fields: [orderItems.serviceId],
    references: [services.id],
  }),
}));

export const servicesRelations = relations(services, ({ many }) => ({
  orderItems: many(orderItems),
}));

export const deliveryRoutesRelations = relations(deliveryRoutes, ({ one, many }) => ({
  driver: one(users, {
    fields: [deliveryRoutes.driverId],
    references: [users.id],
  }),
  stops: many(deliveryStops),
}));

export const deliveryStopsRelations = relations(deliveryStops, ({ one }) => ({
  route: one(deliveryRoutes, {
    fields: [deliveryStops.routeId],
    references: [deliveryRoutes.id],
  }),
  order: one(orders, {
    fields: [deliveryStops.orderId],
    references: [orders.id],
  }),
}));

// Tenants table for multi-tenant SaaS functionality
export const tenants = pgTable("tenants", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  subdomain: varchar("subdomain", { length: 100 }).notNull().unique(),
  slug: varchar("slug", { length: 100 }).notNull().unique(),
  email: varchar("email", { length: 255 }).notNull(),
  contactEmail: varchar("contact_email", { length: 255 }),
  phone: varchar("phone", { length: 20 }),
  address: text("address"),
  logo: text("logo"),
  primaryColor: varchar("primary_color", { length: 7 }),
  subscriptionStatus: varchar("subscription_status", { length: 20 }).default("trial"),
  subscriptionPlan: varchar("subscription_plan", { length: 20 }).default("basic"),
  trialEndsAt: timestamp("trial_ends_at"),
  isActive: boolean("is_active").default(true),
  whatsappNumber: varchar("whatsapp_number", { length: 20 }),
  customDomain: varchar("custom_domain", { length: 255 }),
  defaultCurrency: varchar("default_currency", { length: 3 }).default("BHD"),
  defaultLanguage: varchar("default_language", { length: 2 }).default("en"),
  googleMapsApiKey: text("google_maps_api_key"),
  locationData: jsonb("location_data"),
  businessHours: jsonb("business_hours"),
  settings: jsonb("settings"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Suppliers table
export const suppliers = pgTable("suppliers", {
  id: serial("id").primaryKey(),
  tenantId: integer("tenant_id").references(() => tenants.id),
  name: varchar("name", { length: 255 }).notNull(),
  contactPerson: varchar("contact_person", { length: 255 }),
  email: varchar("email", { length: 255 }),
  phone: varchar("phone", { length: 50 }),
  address: text("address"),
  paymentTerms: varchar("payment_terms", { length: 100 }),
  deliveryTerms: varchar("delivery_terms", { length: 100 }),
  rating: decimal("rating", { precision: 3, scale: 2 }),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Enhanced inventory items with automatic reordering
export const inventoryItems = pgTable("inventory_items", {
  id: serial("id").primaryKey(),
  tenantId: integer("tenant_id").references(() => tenants.id),
  name: varchar("name", { length: 255 }).notNull(),
  category: varchar("category", { length: 100 }),
  sku: varchar("sku", { length: 100 }),
  barcode: varchar("barcode", { length: 100 }),
  description: text("description"),
  unit: varchar("unit", { length: 50 }).notNull(),
  currentStock: decimal("current_stock", { precision: 10, scale: 2 }).default("0"),
  minimumStock: decimal("minimum_stock", { precision: 10, scale: 2 }).default("0"),
  maximumStock: decimal("maximum_stock", { precision: 10, scale: 2 }),
  reorderPoint: decimal("reorder_point", { precision: 10, scale: 2 }),
  reorderQuantity: decimal("reorder_quantity", { precision: 10, scale: 2 }),
  unitCost: decimal("unit_cost", { precision: 10, scale: 2 }),
  averageUsageRate: decimal("average_usage_rate", { precision: 10, scale: 4 }),
  leadTimeDays: integer("lead_time_days").default(7),
  supplierId: integer("supplier_id").references(() => suppliers.id),
  location: varchar("location", { length: 100 }),
  expiryDate: timestamp("expiry_date"),
  autoReorder: boolean("auto_reorder").default(false),
  lastReorderDate: timestamp("last_reorder_date"),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Purchase orders table
export const purchaseOrders = pgTable("purchase_orders", {
  id: serial("id").primaryKey(),
  tenantId: integer("tenant_id").references(() => tenants.id),
  orderNumber: varchar("order_number", { length: 100 }).notNull().unique(),
  supplierId: integer("supplier_id").references(() => suppliers.id),
  status: varchar("status", { length: 50 }).default("draft"), // draft, sent, confirmed, received, cancelled
  totalAmount: decimal("total_amount", { precision: 12, scale: 2 }),
  orderDate: timestamp("order_date").defaultNow(),
  expectedDelivery: timestamp("expected_delivery"),
  actualDelivery: timestamp("actual_delivery"),
  notes: text("notes"),
  isAutoGenerated: boolean("is_auto_generated").default(false),
  createdBy: integer("created_by").references(() => users.id),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Purchase order items table
export const purchaseOrderItems = pgTable("purchase_order_items", {
  id: serial("id").primaryKey(),
  purchaseOrderId: integer("purchase_order_id").references(() => purchaseOrders.id),
  inventoryItemId: integer("inventory_item_id").references(() => inventoryItems.id),
  quantity: decimal("quantity", { precision: 10, scale: 2 }).notNull(),
  unitPrice: decimal("unit_price", { precision: 10, scale: 2 }).notNull(),
  totalPrice: decimal("total_price", { precision: 12, scale: 2 }).notNull(),
  receivedQuantity: decimal("received_quantity", { precision: 10, scale: 2 }).default("0"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Inventory transactions table for tracking stock movements
export const inventoryTransactions = pgTable("inventory_transactions", {
  id: serial("id").primaryKey(),
  tenantId: integer("tenant_id").references(() => tenants.id),
  inventoryItemId: integer("inventory_item_id").references(() => inventoryItems.id),
  transactionType: varchar("transaction_type", { length: 50 }).notNull(), // in, out, adjustment, transfer
  quantity: decimal("quantity", { precision: 10, scale: 2 }).notNull(),
  unitCost: decimal("unit_cost", { precision: 10, scale: 2 }),
  reference: varchar("reference", { length: 255 }), // Order ID, PO ID, etc.
  referenceType: varchar("reference_type", { length: 50 }), // order, purchase_order, adjustment
  notes: text("notes"),
  performedBy: integer("performed_by").references(() => users.id),
  createdAt: timestamp("created_at").defaultNow(),
});

// Promotions and discounts
export const promotions = pgTable("promotions", {
  id: serial("id").primaryKey(),
  tenantId: integer("tenant_id").references(() => tenants.id),
  name: varchar("name", { length: 255 }).notNull(),
  description: text("description"),
  code: varchar("code", { length: 50 }),
  type: varchar("type", { length: 20 }).notNull(),
  value: decimal("value", { precision: 10, scale: 2 }).notNull(),
  minOrderValue: decimal("min_order_value", { precision: 10, scale: 2 }),
  maxDiscountAmount: decimal("max_discount_amount", { precision: 10, scale: 2 }),
  usageLimit: integer("usage_limit"),
  usageCount: integer("usage_count").default(0),
  customerLimit: integer("customer_limit"),
  validFrom: timestamp("valid_from").notNull(),
  validUntil: timestamp("valid_until").notNull(),
  applicableServices: jsonb("applicable_services"),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Customer reviews and ratings
export const reviews = pgTable("reviews", {
  id: serial("id").primaryKey(),
  tenantId: integer("tenant_id").references(() => tenants.id),
  customerId: integer("customer_id").references(() => customers.id),
  orderId: integer("order_id").references(() => orders.id),
  rating: integer("rating").notNull(),
  title: varchar("title", { length: 255 }),
  comment: text("comment"),
  photos: jsonb("photos"),
  response: text("response"),
  responseBy: integer("response_by").references(() => users.id),
  responseAt: timestamp("response_at"),
  isVerified: boolean("is_verified").default(false),
  isPublic: boolean("is_public").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Notifications
export const notifications = pgTable("notifications", {
  id: serial("id").primaryKey(),
  tenantId: integer("tenant_id").references(() => tenants.id),
  userId: integer("user_id").references(() => users.id),
  type: varchar("type", { length: 50 }).notNull(),
  title: varchar("title", { length: 255 }).notNull(),
  message: text("message").notNull(),
  data: jsonb("data"),
  channels: jsonb("channels"),
  isRead: boolean("is_read").default(false),
  readAt: timestamp("read_at"),
  sentAt: timestamp("sent_at"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Analytics events
export const analyticsEvents = pgTable("analytics_events", {
  id: serial("id").primaryKey(),
  tenantId: integer("tenant_id").references(() => tenants.id),
  eventType: varchar("event_type", { length: 100 }).notNull(),
  eventName: varchar("event_name", { length: 100 }).notNull(),
  userId: integer("user_id").references(() => users.id),
  sessionId: varchar("session_id", { length: 100 }),
  properties: jsonb("properties"),
  timestamp: timestamp("timestamp").defaultNow(),
  userAgent: text("user_agent"),
  ipAddress: varchar("ip_address", { length: 45 }),
});

// Business settings
export const businessSettings = pgTable("business_settings", {
  id: serial("id").primaryKey(),
  tenantId: integer("tenant_id").references(() => tenants.id),
  settingKey: varchar("setting_key", { length: 100 }).notNull(),
  settingValue: jsonb("setting_value"),
  category: varchar("category", { length: 50 }),
  isPublic: boolean("is_public").default(false),
  updatedBy: integer("updated_by").references(() => users.id),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Insert schemas
export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertCustomerSchema = createInsertSchema(customers).omit({
  id: true,
  createdAt: true,
});

export const insertServiceSchema = createInsertSchema(services).omit({
  id: true,
  createdAt: true,
});

export const insertOrderSchema = createInsertSchema(orders).omit({
  id: true,
  orderNumber: true,
  createdAt: true,
  updatedAt: true,
});

export const insertOrderItemSchema = createInsertSchema(orderItems).omit({
  id: true,
  createdAt: true,
});

export const insertMachineSchema = createInsertSchema(machines).omit({
  id: true,
  createdAt: true,
});

export const insertDeliveryRouteSchema = createInsertSchema(deliveryRoutes).omit({
  id: true,
  createdAt: true,
});

export const insertDeliveryStopSchema = createInsertSchema(deliveryStops).omit({
  id: true,
  createdAt: true,
});

export const insertTenantSchema = createInsertSchema(tenants).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertInventoryItemSchema = createInsertSchema(inventoryItems).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertSupplierSchema = createInsertSchema(suppliers).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertPurchaseOrderSchema = createInsertSchema(purchaseOrders).omit({
  id: true,
  orderNumber: true,
  createdAt: true,
  updatedAt: true,
});

export const insertPurchaseOrderItemSchema = createInsertSchema(purchaseOrderItems).omit({
  id: true,
  createdAt: true,
});

export const insertInventoryTransactionSchema = createInsertSchema(inventoryTransactions).omit({
  id: true,
  createdAt: true,
});

export const insertPromotionSchema = createInsertSchema(promotions).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertReviewSchema = createInsertSchema(reviews).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertNotificationSchema = createInsertSchema(notifications).omit({
  id: true,
  createdAt: true,
});

export const insertAnalyticsEventSchema = createInsertSchema(analyticsEvents).omit({
  id: true,
  timestamp: true,
});

export const insertBusinessSettingSchema = createInsertSchema(businessSettings).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

// Workflow automation tables
export const workflows = pgTable("workflows", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  description: text("description"),
  isActive: boolean("is_active").default(true),
  trigger: jsonb("trigger").notNull(), // { type, condition, value }
  actions: jsonb("actions").notNull(), // Array of actions
  tenantId: integer("tenant_id").references(() => tenants.id),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertWorkflowSchema = createInsertSchema(workflows).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

// Types
export type User = typeof users.$inferSelect;
export type InsertWorkflow = z.infer<typeof insertWorkflowSchema>;
export type Workflow = typeof workflows.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;
export type Customer = typeof customers.$inferSelect;
export type InsertCustomer = z.infer<typeof insertCustomerSchema>;
export type Service = typeof services.$inferSelect;
export type InsertService = z.infer<typeof insertServiceSchema>;
export type Order = typeof orders.$inferSelect;
export type InsertOrder = z.infer<typeof insertOrderSchema>;
export type OrderItem = typeof orderItems.$inferSelect;
export type InsertOrderItem = z.infer<typeof insertOrderItemSchema>;
export type Machine = typeof machines.$inferSelect;
export type InsertMachine = z.infer<typeof insertMachineSchema>;
export type DeliveryRoute = typeof deliveryRoutes.$inferSelect;
export type InsertDeliveryRoute = z.infer<typeof insertDeliveryRouteSchema>;
export type DeliveryStop = typeof deliveryStops.$inferSelect;
export type InsertDeliveryStop = z.infer<typeof insertDeliveryStopSchema>;
export type Tenant = typeof tenants.$inferSelect;
export type InsertTenant = z.infer<typeof insertTenantSchema>;
export type InventoryItem = typeof inventoryItems.$inferSelect;
export type InsertInventoryItem = z.infer<typeof insertInventoryItemSchema>;
export type Supplier = typeof suppliers.$inferSelect;
export type InsertSupplier = z.infer<typeof insertSupplierSchema>;
export type PurchaseOrder = typeof purchaseOrders.$inferSelect;
export type InsertPurchaseOrder = z.infer<typeof insertPurchaseOrderSchema>;
export type PurchaseOrderItem = typeof purchaseOrderItems.$inferSelect;
export type InsertPurchaseOrderItem = z.infer<typeof insertPurchaseOrderItemSchema>;
export type InventoryTransaction = typeof inventoryTransactions.$inferSelect;
export type InsertInventoryTransaction = z.infer<typeof insertInventoryTransactionSchema>;
export type Promotion = typeof promotions.$inferSelect;
export type InsertPromotion = z.infer<typeof insertPromotionSchema>;
export type Review = typeof reviews.$inferSelect;
export type InsertReview = z.infer<typeof insertReviewSchema>;
export type Notification = typeof notifications.$inferSelect;
export type InsertNotification = z.infer<typeof insertNotificationSchema>;
export type AnalyticsEvent = typeof analyticsEvents.$inferSelect;
export type InsertAnalyticsEvent = z.infer<typeof insertAnalyticsEventSchema>;
export type BusinessSetting = typeof businessSettings.$inferSelect;
export type InsertBusinessSetting = z.infer<typeof insertBusinessSettingSchema>;

// Extended types for API responses
export type OrderWithDetails = Order & {
  customer: Customer & { user: User };
  driver?: User;
  items: (OrderItem & { service: Service })[];
  deliveryStops?: DeliveryStop[];
};

export type RouteWithDetails = DeliveryRoute & {
  driver: User;
  stops: (DeliveryStop & { order: OrderWithDetails })[];
};

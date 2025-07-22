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

// Users table for authentication and staff management
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  firstName: varchar("first_name", { length: 100 }),
  lastName: varchar("last_name", { length: 100 }),
  phone: varchar("phone", { length: 20 }),
  role: varchar("role", { length: 50 }).notNull().default("customer"), // customer, staff, admin, driver
  password: text("password").notNull(),
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
  orderNumber: varchar("order_number", { length: 50 }).notNull().unique(),
  customerId: integer("customer_id").references(() => customers.id).notNull(),
  status: varchar("status", { length: 50 }).notNull().default("pending"), // pending, processing, ready, delivered, cancelled
  totalAmount: decimal("total_amount", { precision: 10, scale: 2 }).notNull(),
  itemCount: integer("item_count").default(0),
  weight: decimal("weight", { precision: 5, scale: 2 }), // in lbs
  pickupDate: timestamp("pickup_date"),
  deliveryDate: timestamp("delivery_date"),
  estimatedCompletion: timestamp("estimated_completion"),
  actualCompletion: timestamp("actual_completion"),
  paymentStatus: varchar("payment_status", { length: 50 }).default("pending"), // pending, paid, refunded
  paymentMethod: varchar("payment_method", { length: 50 }),
  instructions: text("instructions"),
  driverId: integer("driver_id").references(() => users.id),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

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
  driver: one(users, {
    fields: [orders.driverId],
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

// Types
export type User = typeof users.$inferSelect;
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

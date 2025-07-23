import {
  users,
  customers,
  services,
  orders,
  orderItems,
  machines,
  deliveryRoutes,
  deliveryStops,
  tenants,
  inventoryItems,
  promotions,
  reviews,
  notifications,
  analyticsEvents,
  businessSettings,
  type User,
  type InsertUser,
  type Customer,
  type InsertCustomer,
  type Service,
  type InsertService,
  type Order,
  type InsertOrder,
  type OrderItem,
  type InsertOrderItem,
  type Machine,
  type InsertMachine,
  type DeliveryRoute,
  type InsertDeliveryRoute,
  type DeliveryStop,
  type InsertDeliveryStop,
  type Tenant,
  type InsertTenant,
  type InventoryItem,
  type InsertInventoryItem,
  type Promotion,
  type InsertPromotion,
  type Review,
  type InsertReview,
  type Notification,
  type InsertNotification,
  type AnalyticsEvent,
  type InsertAnalyticsEvent,
  type BusinessSetting,
  type InsertBusinessSetting,
  type OrderWithDetails,
  type RouteWithDetails,
  workflows,
  type Workflow,
  type InsertWorkflow,
  suppliers,
  type Supplier,
  type InsertSupplier,
  purchaseOrders,
  type PurchaseOrder,
  type InsertPurchaseOrder,
  purchaseOrderItems,
  type PurchaseOrderItem,
  type InsertPurchaseOrderItem,
  inventoryTransactions,
  type InventoryTransaction,
  type InsertInventoryTransaction,
} from "@shared/schema";
import { db } from "./db";
import { eq, desc, and, or, like, count, sum, sql } from "drizzle-orm";

export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: number, updates: Partial<InsertUser>): Promise<User>;

  // Customer operations
  getCustomer(id: number): Promise<Customer | undefined>;
  getCustomerByUserId(userId: number): Promise<Customer | undefined>;
  createCustomer(customer: InsertCustomer): Promise<Customer>;
  updateCustomer(id: number, updates: Partial<InsertCustomer>): Promise<Customer>;
  getAllCustomers(): Promise<(Customer & { user: User })[]>;

  // Service operations
  getAllServices(): Promise<Service[]>;
  getService(id: number): Promise<Service | undefined>;
  createService(service: InsertService): Promise<Service>;
  updateService(id: number, updates: Partial<InsertService>): Promise<Service>;

  // Order operations
  getAllOrders(): Promise<OrderWithDetails[]>;
  getOrder(id: number): Promise<OrderWithDetails | undefined>;
  getOrdersByCustomer(customerId: number): Promise<OrderWithDetails[]>;
  getOrdersByStatus(status: string): Promise<OrderWithDetails[]>;
  createOrder(order: InsertOrder): Promise<Order>;
  updateOrder(id: number, updates: Partial<InsertOrder>): Promise<Order>;
  generateOrderNumber(): Promise<string>;

  // Order item operations
  createOrderItem(item: InsertOrderItem): Promise<OrderItem>;
  getOrderItems(orderId: number): Promise<(OrderItem & { service: Service })[]>;

  // Machine operations
  getAllMachines(): Promise<Machine[]>;
  getMachine(id: number): Promise<Machine | undefined>;
  createMachine(machine: InsertMachine): Promise<Machine>;
  updateMachine(id: number, updates: Partial<InsertMachine>): Promise<Machine>;

  // Delivery operations
  getDeliveryRoutes(driverId?: number): Promise<RouteWithDetails[]>;
  createDeliveryRoute(route: InsertDeliveryRoute): Promise<DeliveryRoute>;
  updateDeliveryRoute(id: number, updates: Partial<InsertDeliveryRoute>): Promise<DeliveryRoute>;
  createDeliveryStop(stop: InsertDeliveryStop): Promise<DeliveryStop>;
  updateDeliveryStop(id: number, updates: Partial<InsertDeliveryStop>): Promise<DeliveryStop>;

  // Analytics
  getDashboardStats(): Promise<{
    totalOrders: number;
    revenue: number;
    pendingOrders: number;
    activeCustomers: number;
  }>;

  // Tenant operations
  getAllTenants(): Promise<Tenant[]>;
  getTenant(id: number): Promise<Tenant | undefined>;
  getTenantBySubdomain(subdomain: string): Promise<Tenant | undefined>;
  createTenant(tenant: InsertTenant): Promise<Tenant>;
  updateTenant(id: number, updates: Partial<InsertTenant>): Promise<Tenant>;

  // Inventory operations
  getAllInventoryItems(tenantId?: number): Promise<InventoryItem[]>;
  getInventoryItem(id: number): Promise<InventoryItem | undefined>;
  createInventoryItem(item: InsertInventoryItem): Promise<InventoryItem>;
  updateInventoryItem(id: number, updates: Partial<InsertInventoryItem>): Promise<InventoryItem>;

  // Promotion operations
  getAllPromotions(tenantId?: number): Promise<Promotion[]>;
  getActivePromotions(tenantId?: number): Promise<Promotion[]>;
  getPromotion(id: number): Promise<Promotion | undefined>;
  getPromotionByCode(code: string): Promise<Promotion | undefined>;
  createPromotion(promotion: InsertPromotion): Promise<Promotion>;
  updatePromotion(id: number, updates: Partial<InsertPromotion>): Promise<Promotion>;

  // Review operations
  getAllReviews(tenantId?: number): Promise<Review[]>;
  getReviewsByCustomer(customerId: number): Promise<Review[]>;
  createReview(review: InsertReview): Promise<Review>;
  updateReview(id: number, updates: Partial<InsertReview>): Promise<Review>;

  // Notification operations
  getAllNotifications(userId?: number): Promise<Notification[]>;
  getUnreadNotifications(userId: number): Promise<Notification[]>;
  createNotification(notification: InsertNotification): Promise<Notification>;
  markNotificationAsRead(id: number): Promise<Notification>;

  // Analytics operations
  createAnalyticsEvent(event: InsertAnalyticsEvent): Promise<AnalyticsEvent>;
  getAnalyticsEvents(tenantId?: number, eventType?: string): Promise<AnalyticsEvent[]>;

  // Business settings operations
  getAllBusinessSettings(tenantId?: number): Promise<BusinessSetting[]>;
  getBusinessSetting(tenantId: number, key: string): Promise<BusinessSetting | undefined>;
  setBusinessSetting(setting: InsertBusinessSetting): Promise<BusinessSetting>;

  // Workflow management
  getAllWorkflows(tenantId?: number): Promise<Workflow[]>;
  getWorkflow(id: number): Promise<Workflow | undefined>;
  createWorkflow(workflow: InsertWorkflow): Promise<Workflow>;
  updateWorkflow(id: number, updates: Partial<InsertWorkflow>): Promise<Workflow>;
  deleteWorkflow(id: number): Promise<void>;

  // Supplier management
  getAllSuppliers(tenantId?: number): Promise<Supplier[]>;
  getSupplier(id: number): Promise<Supplier | undefined>;
  createSupplier(supplier: InsertSupplier): Promise<Supplier>;
  updateSupplier(id: number, updates: Partial<InsertSupplier>): Promise<Supplier>;
  deleteSupplier(id: number): Promise<void>;

  // Purchase order management
  getAllPurchaseOrders(tenantId?: number): Promise<PurchaseOrder[]>;
  getPurchaseOrder(id: number): Promise<PurchaseOrder | undefined>;
  createPurchaseOrder(purchaseOrder: InsertPurchaseOrder): Promise<PurchaseOrder>;
  updatePurchaseOrder(id: number, updates: Partial<InsertPurchaseOrder>): Promise<PurchaseOrder>;
  generatePurchaseOrderNumber(): Promise<string>;
  
  // Purchase order items
  getPurchaseOrderItems(purchaseOrderId: number): Promise<PurchaseOrderItem[]>;
  createPurchaseOrderItem(item: InsertPurchaseOrderItem): Promise<PurchaseOrderItem>;
  updatePurchaseOrderItem(id: number, updates: Partial<InsertPurchaseOrderItem>): Promise<PurchaseOrderItem>;

  // Inventory transactions
  getInventoryTransactions(inventoryItemId?: number, tenantId?: number): Promise<InventoryTransaction[]>;
  createInventoryTransaction(transaction: InsertInventoryTransaction): Promise<InventoryTransaction>;
  
  // Automatic reordering
  checkAndCreateReorders(tenantId?: number): Promise<PurchaseOrder[]>;
  getItemsBelowReorderPoint(tenantId?: number): Promise<InventoryItem[]>;
  updateUsageRates(tenantId?: number): Promise<void>;
}

export class DatabaseStorage implements IStorage {
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user;
  }

  async createUser(user: InsertUser): Promise<User> {
    const [newUser] = await db.insert(users).values(user).returning();
    return newUser;
  }

  async updateUser(id: number, updates: Partial<InsertUser>): Promise<User> {
    const [updatedUser] = await db
      .update(users)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(users.id, id))
      .returning();
    return updatedUser;
  }

  async getCustomer(id: number): Promise<Customer | undefined> {
    const [customer] = await db.select().from(customers).where(eq(customers.id, id));
    return customer;
  }

  async getCustomerByUserId(userId: number): Promise<Customer | undefined> {
    const [customer] = await db.select().from(customers).where(eq(customers.userId, userId));
    return customer;
  }

  async createCustomer(customer: InsertCustomer): Promise<Customer> {
    const [newCustomer] = await db.insert(customers).values(customer).returning();
    return newCustomer;
  }

  async updateCustomer(id: number, updates: Partial<InsertCustomer>): Promise<Customer> {
    const [updatedCustomer] = await db
      .update(customers)
      .set(updates)
      .where(eq(customers.id, id))
      .returning();
    return updatedCustomer;
  }

  async getAllCustomers(): Promise<(Customer & { user: User })[]> {
    return await db
      .select()
      .from(customers)
      .innerJoin(users, eq(customers.userId, users.id))
      .orderBy(desc(customers.createdAt));
  }

  async getAllServices(): Promise<Service[]> {
    return await db
      .select()
      .from(services)
      .where(eq(services.isActive, true))
      .orderBy(services.category, services.name);
  }

  async getService(id: number): Promise<Service | undefined> {
    const [service] = await db.select().from(services).where(eq(services.id, id));
    return service;
  }

  async createService(service: InsertService): Promise<Service> {
    const [newService] = await db.insert(services).values(service).returning();
    return newService;
  }

  async updateService(id: number, updates: Partial<InsertService>): Promise<Service> {
    const [updatedService] = await db
      .update(services)
      .set(updates)
      .where(eq(services.id, id))
      .returning();
    return updatedService;
  }

  async getAllOrders(): Promise<OrderWithDetails[]> {
    return await db.query.orders.findMany({
      with: {
        customer: {
          with: {
            user: true,
          },
        },
        items: {
          with: {
            service: true,
          },
        },
        deliveryStops: true,
      },
      orderBy: [desc(orders.createdAt)],
    });
  }

  async getOrder(id: number): Promise<OrderWithDetails | undefined> {
    return await db.query.orders.findFirst({
      where: eq(orders.id, id),
      with: {
        customer: {
          with: {
            user: true,
          },
        },
        items: {
          with: {
            service: true,
          },
        },
        deliveryStops: true,
      },
    });
  }

  async getOrdersByCustomer(customerId: number): Promise<OrderWithDetails[]> {
    return await db.query.orders.findMany({
      where: eq(orders.customerId, customerId),
      with: {
        customer: {
          with: {
            user: true,
          },
        },
        items: {
          with: {
            service: true,
          },
        },
        deliveryStops: true,
      },
      orderBy: [desc(orders.createdAt)],
    });
  }

  async getOrdersByStatus(status: string): Promise<OrderWithDetails[]> {
    return await db.query.orders.findMany({
      where: eq(orders.status, status),
      with: {
        customer: {
          with: {
            user: true,
          },
        },
        items: {
          with: {
            service: true,
          },
        },
        deliveryStops: true,
      },
      orderBy: [desc(orders.createdAt)],
    });
  }

  async generateOrderNumber(): Promise<string> {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    
    const [result] = await db
      .select({ count: count() })
      .from(orders);
    
    const orderCount = result.count + 1;
    return `LP${year}${month}${day}-${String(orderCount).padStart(3, '0')}`;
  }

  async createOrder(order: InsertOrder): Promise<Order> {
    const [newOrder] = await db
      .insert(orders)
      .values(order)
      .returning();
    return newOrder;
  }

  async updateOrder(id: number, updates: Partial<InsertOrder>): Promise<Order> {
    const [updatedOrder] = await db
      .update(orders)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(orders.id, id))
      .returning();
    return updatedOrder;
  }

  async createOrderItem(item: InsertOrderItem): Promise<OrderItem> {
    const [newItem] = await db.insert(orderItems).values(item).returning();
    return newItem;
  }

  async getOrderItems(orderId: number): Promise<(OrderItem & { service: Service })[]> {
    return await db.query.orderItems.findMany({
      where: eq(orderItems.orderId, orderId),
      with: {
        service: true,
      },
    });
  }

  async getAllMachines(): Promise<Machine[]> {
    return await db
      .select()
      .from(machines)
      .where(eq(machines.isActive, true))
      .orderBy(machines.type, machines.name);
  }

  async getMachine(id: number): Promise<Machine | undefined> {
    const [machine] = await db.select().from(machines).where(eq(machines.id, id));
    return machine;
  }

  async createMachine(machine: InsertMachine): Promise<Machine> {
    const [newMachine] = await db.insert(machines).values(machine).returning();
    return newMachine;
  }

  async updateMachine(id: number, updates: Partial<InsertMachine>): Promise<Machine> {
    const [updatedMachine] = await db
      .update(machines)
      .set(updates)
      .where(eq(machines.id, id))
      .returning();
    return updatedMachine;
  }

  async getDeliveryRoutes(driverId?: number): Promise<RouteWithDetails[]> {
    const whereCondition = driverId ? eq(deliveryRoutes.driverId, driverId) : undefined;
    
    return await db.query.deliveryRoutes.findMany({
      where: whereCondition,
      with: {
        driver: true,
        stops: {
          with: {
            order: {
              with: {
                customer: {
                  with: {
                    user: true,
                  },
                },
                items: {
                  with: {
                    service: true,
                  },
                },
              },
            },
          },
        },
      },
      orderBy: [desc(deliveryRoutes.date)],
    });
  }

  async createDeliveryRoute(route: InsertDeliveryRoute): Promise<DeliveryRoute> {
    const [newRoute] = await db.insert(deliveryRoutes).values(route).returning();
    return newRoute;
  }

  async updateDeliveryRoute(id: number, updates: Partial<InsertDeliveryRoute>): Promise<DeliveryRoute> {
    const [updatedRoute] = await db
      .update(deliveryRoutes)
      .set(updates)
      .where(eq(deliveryRoutes.id, id))
      .returning();
    return updatedRoute;
  }

  async createDeliveryStop(stop: InsertDeliveryStop): Promise<DeliveryStop> {
    const [newStop] = await db.insert(deliveryStops).values(stop).returning();
    return newStop;
  }

  async updateDeliveryStop(id: number, updates: Partial<InsertDeliveryStop>): Promise<DeliveryStop> {
    const [updatedStop] = await db
      .update(deliveryStops)
      .set(updates)
      .where(eq(deliveryStops.id, id))
      .returning();
    return updatedStop;
  }

  async getDashboardStats(): Promise<{
    totalOrders: number;
    revenue: number;
    pendingOrders: number;
    activeCustomers: number;
  }> {
    const [totalOrdersResult] = await db.select({ count: count() }).from(orders);
    
    const [revenueResult] = await db
      .select({ total: sum(orders.totalAmount) })
      .from(orders)
      .where(eq(orders.paymentStatus, 'paid'));
    
    const [pendingOrdersResult] = await db
      .select({ count: count() })
      .from(orders)
      .where(or(eq(orders.status, 'pending'), eq(orders.status, 'processing')));
    
    const [activeCustomersResult] = await db
      .select({ count: count() })
      .from(customers)
      .innerJoin(users, eq(customers.userId, users.id))
      .where(eq(users.isActive, true));

    return {
      totalOrders: totalOrdersResult.count,
      revenue: Number(revenueResult.total || 0),
      pendingOrders: pendingOrdersResult.count,
      activeCustomers: activeCustomersResult.count,
    };
  }

  // Tenant operations
  async getAllTenants(): Promise<Tenant[]> {
    return await db.select().from(tenants).orderBy(desc(tenants.createdAt));
  }

  async getTenant(id: number): Promise<Tenant | undefined> {
    const [tenant] = await db.select().from(tenants).where(eq(tenants.id, id));
    return tenant;
  }

  async getTenantBySubdomain(subdomain: string): Promise<Tenant | undefined> {
    const [tenant] = await db.select().from(tenants).where(eq(tenants.subdomain, subdomain));
    return tenant;
  }

  async createTenant(tenant: InsertTenant): Promise<Tenant> {
    const [newTenant] = await db.insert(tenants).values(tenant).returning();
    return newTenant;
  }

  async updateTenant(id: number, updates: Partial<InsertTenant>): Promise<Tenant> {
    const [updatedTenant] = await db
      .update(tenants)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(tenants.id, id))
      .returning();
    return updatedTenant;
  }

  // Inventory operations
  async getAllInventoryItems(tenantId?: number): Promise<InventoryItem[]> {
    const query = db.select().from(inventoryItems);
    if (tenantId) {
      return await query.where(eq(inventoryItems.tenantId, tenantId));
    }
    return await query;
  }

  async getInventoryItem(id: number): Promise<InventoryItem | undefined> {
    const [item] = await db.select().from(inventoryItems).where(eq(inventoryItems.id, id));
    return item;
  }

  async createInventoryItem(item: InsertInventoryItem): Promise<InventoryItem> {
    const [newItem] = await db.insert(inventoryItems).values(item).returning();
    return newItem;
  }

  async updateInventoryItem(id: number, updates: Partial<InsertInventoryItem>): Promise<InventoryItem> {
    const [updatedItem] = await db
      .update(inventoryItems)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(inventoryItems.id, id))
      .returning();
    return updatedItem;
  }

  // Promotion operations
  async getAllPromotions(tenantId?: number): Promise<Promotion[]> {
    const query = db.select().from(promotions);
    if (tenantId) {
      return await query.where(eq(promotions.tenantId, tenantId));
    }
    return await query;
  }

  async getActivePromotions(tenantId?: number): Promise<Promotion[]> {
    const now = new Date();
    const query = db.select().from(promotions).where(
      and(
        eq(promotions.isActive, true),
        sql`${promotions.validFrom} <= ${now}`,
        sql`${promotions.validUntil} >= ${now}`
      )
    );
    if (tenantId) {
      return await query.where(eq(promotions.tenantId, tenantId));
    }
    return await query;
  }

  async getPromotion(id: number): Promise<Promotion | undefined> {
    const [promotion] = await db.select().from(promotions).where(eq(promotions.id, id));
    return promotion;
  }

  async getPromotionByCode(code: string): Promise<Promotion | undefined> {
    const [promotion] = await db.select().from(promotions).where(eq(promotions.code, code));
    return promotion;
  }

  async createPromotion(promotion: InsertPromotion): Promise<Promotion> {
    const [newPromotion] = await db.insert(promotions).values(promotion).returning();
    return newPromotion;
  }

  async updatePromotion(id: number, updates: Partial<InsertPromotion>): Promise<Promotion> {
    const [updatedPromotion] = await db
      .update(promotions)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(promotions.id, id))
      .returning();
    return updatedPromotion;
  }

  // Review operations
  async getAllReviews(tenantId?: number): Promise<Review[]> {
    const query = db.select().from(reviews);
    if (tenantId) {
      return await query.where(eq(reviews.tenantId, tenantId));
    }
    return await query;
  }

  async getReviewsByCustomer(customerId: number): Promise<Review[]> {
    return await db.select().from(reviews).where(eq(reviews.customerId, customerId));
  }

  async createReview(review: InsertReview): Promise<Review> {
    const [newReview] = await db.insert(reviews).values(review).returning();
    return newReview;
  }

  async updateReview(id: number, updates: Partial<InsertReview>): Promise<Review> {
    const [updatedReview] = await db
      .update(reviews)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(reviews.id, id))
      .returning();
    return updatedReview;
  }

  // Notification operations
  async getAllNotifications(userId?: number): Promise<Notification[]> {
    const query = db.select().from(notifications);
    if (userId) {
      return await query.where(eq(notifications.userId, userId));
    }
    return await query;
  }

  async getUnreadNotifications(userId: number): Promise<Notification[]> {
    return await db.select().from(notifications).where(
      and(
        eq(notifications.userId, userId),
        eq(notifications.isRead, false)
      )
    );
  }

  async createNotification(notification: InsertNotification): Promise<Notification> {
    const [newNotification] = await db.insert(notifications).values(notification).returning();
    return newNotification;
  }

  async markNotificationAsRead(id: number): Promise<Notification> {
    const [updatedNotification] = await db
      .update(notifications)
      .set({ isRead: true, readAt: new Date() })
      .where(eq(notifications.id, id))
      .returning();
    return updatedNotification;
  }

  // Analytics operations
  async createAnalyticsEvent(event: InsertAnalyticsEvent): Promise<AnalyticsEvent> {
    const [newEvent] = await db.insert(analyticsEvents).values(event).returning();
    return newEvent;
  }

  async getAnalyticsEvents(tenantId?: number, eventType?: string): Promise<AnalyticsEvent[]> {
    let query = db.select().from(analyticsEvents);
    
    const conditions = [];
    if (tenantId) conditions.push(eq(analyticsEvents.tenantId, tenantId));
    if (eventType) conditions.push(eq(analyticsEvents.eventType, eventType));
    
    if (conditions.length > 0) {
      query = query.where(and(...conditions));
    }
    
    return await query.orderBy(desc(analyticsEvents.timestamp));
  }

  // Business settings operations
  async getAllBusinessSettings(tenantId?: number): Promise<BusinessSetting[]> {
    const query = db.select().from(businessSettings);
    if (tenantId) {
      return await query.where(eq(businessSettings.tenantId, tenantId));
    }
    return await query;
  }

  async getBusinessSetting(tenantId: number, key: string): Promise<BusinessSetting | undefined> {
    const [setting] = await db.select().from(businessSettings).where(
      and(
        eq(businessSettings.tenantId, tenantId),
        eq(businessSettings.settingKey, key)
      )
    );
    return setting;
  }

  async setBusinessSetting(setting: InsertBusinessSetting): Promise<BusinessSetting> {
    const [newSetting] = await db.insert(businessSettings)
      .values(setting)
      .onConflictDoUpdate({
        target: [businessSettings.tenantId, businessSettings.settingKey],
        set: {
          settingValue: setting.settingValue,
          updatedAt: new Date(),
          updatedBy: setting.updatedBy
        }
      })
      .returning();
    return newSetting;
  }

  // Workflow operations
  async getAllWorkflows(tenantId?: number): Promise<Workflow[]> {
    const conditions: any[] = [];
    if (tenantId) {
      conditions.push(eq(workflows.tenantId, tenantId));
    }

    return await db
      .select()
      .from(workflows)
      .where(conditions.length > 0 ? and(...conditions) : undefined)
      .orderBy(desc(workflows.createdAt));
  }

  async getWorkflow(id: number): Promise<Workflow | undefined> {
    const [workflow] = await db.select().from(workflows).where(eq(workflows.id, id));
    return workflow;
  }

  async createWorkflow(workflow: InsertWorkflow): Promise<Workflow> {
    const [newWorkflow] = await db.insert(workflows).values(workflow).returning();
    return newWorkflow;
  }

  async updateWorkflow(id: number, updates: Partial<InsertWorkflow>): Promise<Workflow> {
    const [updatedWorkflow] = await db
      .update(workflows)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(workflows.id, id))
      .returning();
    return updatedWorkflow;
  }

  async deleteWorkflow(id: number): Promise<void> {
    await db.delete(workflows).where(eq(workflows.id, id));
  }

  // Supplier operations
  async getAllSuppliers(tenantId?: number): Promise<Supplier[]> {
    const conditions: any[] = [];
    if (tenantId) {
      conditions.push(eq(suppliers.tenantId, tenantId));
    }

    return await db
      .select()
      .from(suppliers)
      .where(conditions.length > 0 ? and(...conditions) : undefined)
      .orderBy(desc(suppliers.createdAt));
  }

  async getSupplier(id: number): Promise<Supplier | undefined> {
    const [supplier] = await db.select().from(suppliers).where(eq(suppliers.id, id));
    return supplier;
  }

  async createSupplier(supplier: InsertSupplier): Promise<Supplier> {
    const [newSupplier] = await db.insert(suppliers).values(supplier).returning();
    return newSupplier;
  }

  async updateSupplier(id: number, updates: Partial<InsertSupplier>): Promise<Supplier> {
    const [updatedSupplier] = await db
      .update(suppliers)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(suppliers.id, id))
      .returning();
    return updatedSupplier;
  }

  async deleteSupplier(id: number): Promise<void> {
    await db.delete(suppliers).where(eq(suppliers.id, id));
  }

  // Purchase order operations
  async getAllPurchaseOrders(tenantId?: number): Promise<PurchaseOrder[]> {
    const conditions: any[] = [];
    if (tenantId) {
      conditions.push(eq(purchaseOrders.tenantId, tenantId));
    }

    return await db
      .select()
      .from(purchaseOrders)
      .where(conditions.length > 0 ? and(...conditions) : undefined)
      .orderBy(desc(purchaseOrders.createdAt));
  }

  async getPurchaseOrder(id: number): Promise<PurchaseOrder | undefined> {
    const [purchaseOrder] = await db.select().from(purchaseOrders).where(eq(purchaseOrders.id, id));
    return purchaseOrder;
  }

  async generatePurchaseOrderNumber(): Promise<string> {
    const count = await db.select({ count: sql`count(*)` }).from(purchaseOrders);
    const orderCount = Number(count[0].count) + 1;
    return `PO-${orderCount.toString().padStart(6, '0')}`;
  }

  async createPurchaseOrder(purchaseOrder: InsertPurchaseOrder): Promise<PurchaseOrder> {
    const orderNumber = await this.generatePurchaseOrderNumber();
    const [newPurchaseOrder] = await db
      .insert(purchaseOrders)
      .values({ ...purchaseOrder, orderNumber })
      .returning();
    return newPurchaseOrder;
  }

  async updatePurchaseOrder(id: number, updates: Partial<InsertPurchaseOrder>): Promise<PurchaseOrder> {
    const [updatedPurchaseOrder] = await db
      .update(purchaseOrders)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(purchaseOrders.id, id))
      .returning();
    return updatedPurchaseOrder;
  }

  // Purchase order items operations
  async getPurchaseOrderItems(purchaseOrderId: number): Promise<PurchaseOrderItem[]> {
    return await db
      .select()
      .from(purchaseOrderItems)
      .where(eq(purchaseOrderItems.purchaseOrderId, purchaseOrderId));
  }

  async createPurchaseOrderItem(item: InsertPurchaseOrderItem): Promise<PurchaseOrderItem> {
    const [newItem] = await db.insert(purchaseOrderItems).values(item).returning();
    return newItem;
  }

  async updatePurchaseOrderItem(id: number, updates: Partial<InsertPurchaseOrderItem>): Promise<PurchaseOrderItem> {
    const [updatedItem] = await db
      .update(purchaseOrderItems)
      .set(updates)
      .where(eq(purchaseOrderItems.id, id))
      .returning();
    return updatedItem;
  }

  // Inventory transaction operations
  async getInventoryTransactions(inventoryItemId?: number, tenantId?: number): Promise<InventoryTransaction[]> {
    const conditions: any[] = [];
    if (inventoryItemId) {
      conditions.push(eq(inventoryTransactions.inventoryItemId, inventoryItemId));
    }
    if (tenantId) {
      conditions.push(eq(inventoryTransactions.tenantId, tenantId));
    }

    return await db
      .select()
      .from(inventoryTransactions)
      .where(conditions.length > 0 ? and(...conditions) : undefined)
      .orderBy(desc(inventoryTransactions.createdAt));
  }

  async createInventoryTransaction(transaction: InsertInventoryTransaction): Promise<InventoryTransaction> {
    const [newTransaction] = await db.insert(inventoryTransactions).values(transaction).returning();
    return newTransaction;
  }

  // Simple inventory method to replace complex one
  async getInventoryItems(): Promise<InventoryItem[]> {
    const result = await db.select().from(inventoryItems);
    return result;
  }

  async createInventoryItem(item: InsertInventoryItem): Promise<InventoryItem> {
    const [newItem] = await db.insert(inventoryItems).values(item).returning();
    return newItem;
  }

  // Simple supplier methods
  async getSuppliers(): Promise<Supplier[]> {
    const result = await db.select().from(suppliers);
    return result;
  }

  async createSupplier(supplier: InsertSupplier): Promise<Supplier> {
    const [newSupplier] = await db.insert(suppliers).values(supplier).returning();
    return newSupplier;
  }

  // Purchase order methods
  async getPurchaseOrders(): Promise<PurchaseOrder[]> {
    const result = await db.select().from(purchaseOrders);
    return result;
  }

  async createPurchaseOrder(order: InsertPurchaseOrder): Promise<PurchaseOrder> {
    const [newOrder] = await db.insert(purchaseOrders).values(order).returning();
    return newOrder;
  }

  // Advanced inventory management with automatic reordering
  async getItemsBelowReorderPoint(tenantId?: number): Promise<InventoryItem[]> {
    const conditions: any[] = [
      eq(inventoryItems.autoReorder, true),
      eq(inventoryItems.isActive, true),
    ];
    
    if (tenantId) {
      conditions.push(eq(inventoryItems.tenantId, tenantId));
    }

    return await db
      .select()
      .from(inventoryItems)
      .where(
        and(
          ...conditions,
          sql`${inventoryItems.currentStock} <= ${inventoryItems.reorderPoint}`
        )
      );
  }

  async checkAndCreateReorders(tenantId?: number): Promise<PurchaseOrder[]> {
    const itemsToReorder = await this.getItemsBelowReorderPoint(tenantId);
    const createdOrders: PurchaseOrder[] = [];

    // Group items by supplier
    const itemsBySupplier = itemsToReorder.reduce((acc, item) => {
      const supplierId = item.supplierId || 0; // Default supplier
      if (!acc[supplierId]) {
        acc[supplierId] = [];
      }
      acc[supplierId].push(item);
      return acc;
    }, {} as Record<number, InventoryItem[]>);

    // Create purchase orders for each supplier
    for (const [supplierId, items] of Object.entries(itemsBySupplier)) {
      const supplierIdNum = parseInt(supplierId);
      
      const purchaseOrder = await this.createPurchaseOrder({
        tenantId: tenantId || items[0].tenantId,
        supplierId: supplierIdNum === 0 ? null : supplierIdNum,
        status: 'draft',
        isAutoGenerated: true,
        notes: 'Automatically generated reorder based on stock levels',
      });

      let totalAmount = 0;

      // Add items to purchase order
      for (const item of items) {
        const quantity = item.reorderQuantity || (item.maximumStock ? parseFloat(item.maximumStock.toString()) - parseFloat(item.currentStock.toString()) : 50);
        const unitPrice = item.unitCost || 0;
        const totalPrice = quantity * parseFloat(unitPrice.toString());
        totalAmount += totalPrice;

        await this.createPurchaseOrderItem({
          purchaseOrderId: purchaseOrder.id,
          inventoryItemId: item.id,
          quantity: quantity.toString(),
          unitPrice: unitPrice.toString(),
          totalPrice: totalPrice.toString(),
        });

        // Update last reorder date
        await this.updateInventoryItem(item.id, {
          lastReorderDate: new Date(),
        });
      }

      // Update total amount
      await this.updatePurchaseOrder(purchaseOrder.id, {
        totalAmount: totalAmount.toString(),
      });

      createdOrders.push(purchaseOrder);
    }

    return createdOrders;
  }

  async updateUsageRates(tenantId?: number): Promise<void> {
    // Calculate usage rates based on transaction history (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const conditions: any[] = [
      eq(inventoryTransactions.transactionType, 'out'),
    ];
    
    if (tenantId) {
      conditions.push(eq(inventoryTransactions.tenantId, tenantId));
    }

    const transactions = await db
      .select({
        inventoryItemId: inventoryTransactions.inventoryItemId,
        totalUsage: sql`SUM(${inventoryTransactions.quantity})`,
      })
      .from(inventoryTransactions)
      .where(
        and(
          ...conditions,
          sql`${inventoryTransactions.createdAt} >= ${thirtyDaysAgo}`
        )
      )
      .groupBy(inventoryTransactions.inventoryItemId);

    // Update usage rates for each item
    for (const transaction of transactions) {
      const dailyUsage = parseFloat(transaction.totalUsage.toString()) / 30;
      await db
        .update(inventoryItems)
        .set({ 
          averageUsageRate: dailyUsage.toString(),
          updatedAt: new Date(),
        })
        .where(eq(inventoryItems.id, transaction.inventoryItemId));
    }
  }
}

export const storage = new DatabaseStorage();

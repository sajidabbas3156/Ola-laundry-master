import type { Express } from "express";
import { createServer, type Server } from "http";
import { WebSocketServer, WebSocket } from "ws";
import { storage } from "./storage";
import { initializeWebSocket, getWebSocketManager } from "./websocket";
import { 
  insertUserSchema, 
  insertCustomerSchema, 
  insertOrderSchema,
  insertOrderItemSchema,
  insertServiceSchema,
  insertMachineSchema,
  insertDeliveryRouteSchema,
  insertDeliveryStopSchema,
} from "@shared/schema";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";

// Middleware for authentication
const authenticateToken = async (req: any, res: any, next: any) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: "Access token required" });
  }

  // Demo token for development
  if (token === 'demo-token-123') {
    req.user = {
      id: 1,
      email: 'admin@laundrypro.bh',
      firstName: 'Admin',
      lastName: 'User',
      role: 'org_owner'
    };
    return next();
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as any;
    const user = await storage.getUser(decoded.userId);
    if (!user) {
      return res.status(401).json({ message: "Invalid token" });
    }
    req.user = user;
    next();
  } catch (error) {
    return res.status(403).json({ message: "Invalid token" });
  }
};

export async function registerRoutes(app: Express): Promise<Server> {
  const httpServer = createServer(app);

  // WebSocket setup for real-time updates
  const wss = new WebSocketServer({ server: httpServer, path: '/ws' });
  const clients = new Set<WebSocket>();

  wss.on('connection', (ws) => {
    clients.add(ws);
    
    ws.on('close', () => {
      clients.delete(ws);
    });
  });

  // Broadcast function for real-time updates
  const broadcast = (data: any) => {
    const message = JSON.stringify(data);
    clients.forEach(client => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(message);
      }
    });
  };

  // Auth routes
  app.post("/api/auth/register", async (req, res) => {
    try {
      const userData = insertUserSchema.parse(req.body);
      const hashedPassword = await bcrypt.hash(userData.password, 10);
      
      const user = await storage.createUser({
        ...userData,
        password: hashedPassword,
      });

      // Create customer profile if role is customer
      if (userData.role === 'customer') {
        await storage.createCustomer({
          userId: user.id,
          address: req.body.address || '',
          city: req.body.city || '',
          zipCode: req.body.zipCode || '',
        });
      }

      const token = jwt.sign({ userId: user.id }, JWT_SECRET);
      res.json({ user: { ...user, password: undefined }, token });
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  app.post("/api/auth/login", async (req, res) => {
    try {
      const { email, password } = req.body;
      const user = await storage.getUserByEmail(email);
      
      if (!user || !await bcrypt.compare(password, user.password)) {
        return res.status(401).json({ message: "Invalid credentials" });
      }

      const token = jwt.sign({ userId: user.id }, JWT_SECRET);
      res.json({ user: { ...user, password: undefined }, token });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.get("/api/auth/me", authenticateToken, async (req: any, res) => {
    res.json({ ...req.user, password: undefined });
  });

  // Role-based user endpoint for React Query
  app.get("/api/auth/user", authenticateToken, async (req: any, res) => {
    res.json({ ...req.user, password: undefined });
  });

  // Dashboard stats
  app.get("/api/dashboard/stats", authenticateToken, async (req, res) => {
    try {
      const stats = await storage.getDashboardStats();
      res.json(stats);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Tenant management routes
  app.get("/api/tenants", authenticateToken, async (req, res) => {
    try {
      const tenants = await storage.getAllTenants();
      res.json(tenants);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.get("/api/tenants/:id", authenticateToken, async (req, res) => {
    try {
      const tenant = await storage.getTenant(parseInt(req.params.id));
      if (!tenant) {
        return res.status(404).json({ message: "Tenant not found" });
      }
      res.json(tenant);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.post("/api/tenants", authenticateToken, async (req, res) => {
    try {
      const tenant = await storage.createTenant(req.body);
      res.status(201).json(tenant);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  app.put("/api/tenants/:id", authenticateToken, async (req, res) => {
    try {
      const tenant = await storage.updateTenant(parseInt(req.params.id), req.body);
      res.json(tenant);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  // Inventory management routes
  app.get("/api/inventory", authenticateToken, async (req, res) => {
    try {
      const tenantId = req.query.tenantId ? parseInt(req.query.tenantId as string) : undefined;
      const items = await storage.getAllInventoryItems(tenantId);
      res.json(items);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.get("/api/inventory/:id", authenticateToken, async (req, res) => {
    try {
      const item = await storage.getInventoryItem(parseInt(req.params.id));
      if (!item) {
        return res.status(404).json({ message: "Inventory item not found" });
      }
      res.json(item);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.post("/api/inventory", authenticateToken, async (req, res) => {
    try {
      const item = await storage.createInventoryItem(req.body);
      res.status(201).json(item);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  app.put("/api/inventory/:id", authenticateToken, async (req, res) => {
    try {
      const item = await storage.updateInventoryItem(parseInt(req.params.id), req.body);
      res.json(item);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  // Promotion management routes
  app.get("/api/promotions", authenticateToken, async (req, res) => {
    try {
      const tenantId = req.query.tenantId ? parseInt(req.query.tenantId as string) : undefined;
      const activeOnly = req.query.activeOnly === 'true';
      
      const promotions = activeOnly 
        ? await storage.getActivePromotions(tenantId)
        : await storage.getAllPromotions(tenantId);
      res.json(promotions);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.get("/api/promotions/code/:code", authenticateToken, async (req, res) => {
    try {
      const promotion = await storage.getPromotionByCode(req.params.code);
      if (!promotion) {
        return res.status(404).json({ message: "Promotion not found" });
      }
      res.json(promotion);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.post("/api/promotions", authenticateToken, async (req, res) => {
    try {
      const promotion = await storage.createPromotion(req.body);
      res.status(201).json(promotion);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  app.put("/api/promotions/:id", authenticateToken, async (req, res) => {
    try {
      const promotion = await storage.updatePromotion(parseInt(req.params.id), req.body);
      res.json(promotion);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  // Review management routes
  app.get("/api/reviews", authenticateToken, async (req, res) => {
    try {
      const tenantId = req.query.tenantId ? parseInt(req.query.tenantId as string) : undefined;
      const customerId = req.query.customerId ? parseInt(req.query.customerId as string) : undefined;
      
      let reviews;
      if (customerId) {
        reviews = await storage.getReviewsByCustomer(customerId);
      } else {
        reviews = await storage.getAllReviews(tenantId);
      }
      res.json(reviews);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.post("/api/reviews", authenticateToken, async (req, res) => {
    try {
      const review = await storage.createReview(req.body);
      res.status(201).json(review);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  app.put("/api/reviews/:id", authenticateToken, async (req, res) => {
    try {
      const review = await storage.updateReview(parseInt(req.params.id), req.body);
      res.json(review);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  // Notification routes
  app.get("/api/notifications", authenticateToken, async (req: any, res) => {
    try {
      const userId = req.query.userId ? parseInt(req.query.userId as string) : req.user.id;
      const unreadOnly = req.query.unreadOnly === 'true';
      
      const notifications = unreadOnly 
        ? await storage.getUnreadNotifications(userId)
        : await storage.getAllNotifications(userId);
      res.json(notifications);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.post("/api/notifications", authenticateToken, async (req, res) => {
    try {
      const notification = await storage.createNotification(req.body);
      res.status(201).json(notification);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  app.put("/api/notifications/:id/read", authenticateToken, async (req, res) => {
    try {
      const notification = await storage.markNotificationAsRead(parseInt(req.params.id));
      res.json(notification);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  // Analytics routes
  app.get("/api/analytics/events", authenticateToken, async (req, res) => {
    try {
      const tenantId = req.query.tenantId ? parseInt(req.query.tenantId as string) : undefined;
      const eventType = req.query.eventType as string;
      
      const events = await storage.getAnalyticsEvents(tenantId, eventType);
      res.json(events);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.post("/api/analytics/events", authenticateToken, async (req, res) => {
    try {
      const event = await storage.createAnalyticsEvent(req.body);
      res.status(201).json(event);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  // Business settings routes
  app.get("/api/settings", authenticateToken, async (req, res) => {
    try {
      const tenantId = req.query.tenantId ? parseInt(req.query.tenantId as string) : undefined;
      const settings = await storage.getAllBusinessSettings(tenantId);
      res.json(settings);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.get("/api/settings/:tenantId/:key", authenticateToken, async (req, res) => {
    try {
      const setting = await storage.getBusinessSetting(
        parseInt(req.params.tenantId), 
        req.params.key
      );
      if (!setting) {
        return res.status(404).json({ message: "Setting not found" });
      }
      res.json(setting);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.post("/api/settings", authenticateToken, async (req, res) => {
    try {
      const setting = await storage.setBusinessSetting(req.body);
      res.status(201).json(setting);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  // Customer routes
  app.get("/api/customers", authenticateToken, async (req, res) => {
    try {
      const customers = await storage.getAllCustomers();
      res.json(customers);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.get("/api/customers/:id", authenticateToken, async (req, res) => {
    try {
      const customer = await storage.getCustomer(parseInt(req.params.id));
      if (!customer) {
        return res.status(404).json({ message: "Customer not found" });
      }
      res.json(customer);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Service routes
  app.get("/api/services", async (req, res) => {
    try {
      const services = await storage.getAllServices();
      res.json(services);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.post("/api/services", authenticateToken, async (req, res) => {
    try {
      const serviceData = insertServiceSchema.parse(req.body);
      const service = await storage.createService(serviceData);
      res.json(service);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  // Order routes
  app.get("/api/orders", authenticateToken, async (req: any, res) => {
    try {
      let orders;
      if (req.user.role === 'customer') {
        const customer = await storage.getCustomerByUserId(req.user.id);
        if (!customer) {
          return res.status(404).json({ message: "Customer profile not found" });
        }
        orders = await storage.getOrdersByCustomer(customer.id);
      } else {
        orders = await storage.getAllOrders();
      }
      res.json(orders);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.get("/api/orders/:id", authenticateToken, async (req, res) => {
    try {
      const order = await storage.getOrder(parseInt(req.params.id));
      if (!order) {
        return res.status(404).json({ message: "Order not found" });
      }
      res.json(order);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.post("/api/orders", authenticateToken, async (req: any, res) => {
    try {
      let orderData = insertOrderSchema.parse(req.body);
      
      // If customer is creating order, use their customer ID
      if (req.user.role === 'customer' && !orderData.customerId) {
        const customer = await storage.getCustomerByUserId(req.user.id);
        if (!customer) {
          return res.status(404).json({ message: "Customer profile not found" });
        }
        orderData = { ...orderData, customerId: customer.id };
      }

      const order = await storage.createOrder(orderData);
      
      // Add order items if provided
      if (req.body.items && Array.isArray(req.body.items)) {
        for (const item of req.body.items) {
          await storage.createOrderItem({
            ...item,
            orderId: order.id,
          });
        }
      }

      // Get full order details
      const fullOrder = await storage.getOrder(order.id);
      
      // Broadcast real-time update
      const wsManager = getWebSocketManager();
      if (wsManager) {
        wsManager.broadcast({
          type: 'order_created',
          data: fullOrder,
        });
      }

      res.json(fullOrder);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  app.patch("/api/orders/:id", authenticateToken, async (req, res) => {
    try {
      const updates = req.body;
      const order = await storage.updateOrder(parseInt(req.params.id), updates);
      
      // Get full order details
      const fullOrder = await storage.getOrder(order.id);
      
      // Broadcast real-time update
      const wsManager = getWebSocketManager();
      if (wsManager) {
        wsManager.broadcast({
          type: 'order_updated',
          data: fullOrder,
        });
      }

      res.json(fullOrder);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  // Supplier management routes
  app.get("/api/suppliers", authenticateToken, async (req, res) => {
    try {
      const tenantId = req.query.tenantId ? parseInt(req.query.tenantId as string) : undefined;
      const suppliers = await storage.getAllSuppliers(tenantId);
      res.json(suppliers);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.get("/api/suppliers/:id", authenticateToken, async (req, res) => {
    try {
      const supplier = await storage.getSupplier(parseInt(req.params.id));
      if (!supplier) {
        return res.status(404).json({ message: "Supplier not found" });
      }
      res.json(supplier);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.post("/api/suppliers", authenticateToken, async (req, res) => {
    try {
      const supplier = await storage.createSupplier(req.body);
      res.status(201).json(supplier);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  app.put("/api/suppliers/:id", authenticateToken, async (req, res) => {
    try {
      const supplier = await storage.updateSupplier(parseInt(req.params.id), req.body);
      res.json(supplier);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  app.delete("/api/suppliers/:id", authenticateToken, async (req, res) => {
    try {
      await storage.deleteSupplier(parseInt(req.params.id));
      res.status(204).send();
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  // Purchase order management routes
  app.get("/api/purchase-orders", authenticateToken, async (req, res) => {
    try {
      const tenantId = req.query.tenantId ? parseInt(req.query.tenantId as string) : undefined;
      const purchaseOrders = await storage.getAllPurchaseOrders(tenantId);
      res.json(purchaseOrders);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.get("/api/purchase-orders/:id", authenticateToken, async (req, res) => {
    try {
      const purchaseOrder = await storage.getPurchaseOrder(parseInt(req.params.id));
      if (!purchaseOrder) {
        return res.status(404).json({ message: "Purchase order not found" });
      }
      res.json(purchaseOrder);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.post("/api/purchase-orders", authenticateToken, async (req, res) => {
    try {
      const purchaseOrder = await storage.createPurchaseOrder(req.body);
      res.status(201).json(purchaseOrder);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  app.put("/api/purchase-orders/:id", authenticateToken, async (req, res) => {
    try {
      const purchaseOrder = await storage.updatePurchaseOrder(parseInt(req.params.id), req.body);
      res.json(purchaseOrder);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  // Purchase order items
  app.get("/api/purchase-orders/:id/items", authenticateToken, async (req, res) => {
    try {
      const items = await storage.getPurchaseOrderItems(parseInt(req.params.id));
      res.json(items);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.post("/api/purchase-orders/:id/items", authenticateToken, async (req, res) => {
    try {
      const item = await storage.createPurchaseOrderItem({
        ...req.body,
        purchaseOrderId: parseInt(req.params.id),
      });
      res.status(201).json(item);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  // Inventory transactions
  app.get("/api/inventory/transactions", authenticateToken, async (req, res) => {
    try {
      const inventoryItemId = req.query.inventoryItemId ? parseInt(req.query.inventoryItemId as string) : undefined;
      const tenantId = req.query.tenantId ? parseInt(req.query.tenantId as string) : undefined;
      const transactions = await storage.getInventoryTransactions(inventoryItemId, tenantId);
      res.json(transactions);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.post("/api/inventory/transactions", authenticateToken, async (req, res) => {
    try {
      const transaction = await storage.createInventoryTransaction(req.body);
      
      // Update inventory item stock based on transaction
      if (transaction.inventoryItemId) {
        const item = await storage.getInventoryItem(transaction.inventoryItemId);
        if (item && item.currentStock !== null) {
          const quantity = parseFloat(transaction.quantity);
          let newStock = parseFloat(item.currentStock.toString());
          
          if (transaction.transactionType === 'in') {
            newStock += quantity;
          } else if (transaction.transactionType === 'out') {
            newStock -= quantity;
          } else if (transaction.transactionType === 'adjustment') {
            newStock = quantity; // Direct adjustment
          }
          
          await storage.updateInventoryItem(transaction.inventoryItemId, {
            currentStock: newStock.toString(),
          });
        }
      }
      
      res.status(201).json(transaction);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  // Automatic reordering endpoints
  app.get("/api/inventory/reorder-alerts", authenticateToken, async (req, res) => {
    try {
      const tenantId = req.query.tenantId ? parseInt(req.query.tenantId as string) : undefined;
      const items = await storage.getItemsBelowReorderPoint(tenantId);
      res.json(items);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.post("/api/inventory/auto-reorder", authenticateToken, async (req, res) => {
    try {
      const tenantId = req.query.tenantId ? parseInt(req.query.tenantId as string) : undefined;
      const purchaseOrders = await storage.checkAndCreateReorders(tenantId);
      res.json({ message: `Created ${purchaseOrders.length} purchase orders`, purchaseOrders });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.post("/api/inventory/update-usage-rates", authenticateToken, async (req, res) => {
    try {
      const tenantId = req.query.tenantId ? parseInt(req.query.tenantId as string) : undefined;
      await storage.updateUsageRates(tenantId);
      res.json({ message: "Usage rates updated successfully" });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Workflow management routes
  app.get("/api/workflows", authenticateToken, async (req, res) => {
    try {
      const tenantId = req.query.tenantId ? parseInt(req.query.tenantId as string) : undefined;
      const workflows = await storage.getAllWorkflows(tenantId);
      res.json(workflows);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.post("/api/workflows", authenticateToken, async (req, res) => {
    try {
      const workflow = await storage.createWorkflow(req.body);
      res.status(201).json(workflow);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  app.put("/api/workflows/:id", authenticateToken, async (req, res) => {
    try {
      const workflow = await storage.updateWorkflow(parseInt(req.params.id), req.body);
      res.json(workflow);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  app.delete("/api/workflows/:id", authenticateToken, async (req, res) => {
    try {
      await storage.deleteWorkflow(parseInt(req.params.id));
      res.status(204).send();
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  // Machine routes
  app.get("/api/machines", authenticateToken, async (req, res) => {
    try {
      const machines = await storage.getAllMachines();
      res.json(machines);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.patch("/api/machines/:id", authenticateToken, async (req, res) => {
    try {
      const updates = req.body;
      const machine = await storage.updateMachine(parseInt(req.params.id), updates);
      
      // Broadcast real-time update
      const wsManager = getWebSocketManager();
      if (wsManager) {
        wsManager.broadcast({
          type: 'machine_updated',
          data: machine,
        });
      }

      res.json(machine);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  // Delivery routes
  app.get("/api/delivery/routes", authenticateToken, async (req: any, res) => {
    try {
      const driverId = req.user.role === 'driver' ? req.user.id : undefined;
      const routes = await storage.getDeliveryRoutes(driverId);
      res.json(routes);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.post("/api/delivery/routes", authenticateToken, async (req, res) => {
    try {
      const routeData = insertDeliveryRouteSchema.parse(req.body);
      const route = await storage.createDeliveryRoute(routeData);
      
      // Add stops if provided
      if (req.body.stops && Array.isArray(req.body.stops)) {
        for (const stop of req.body.stops) {
          await storage.createDeliveryStop({
            ...stop,
            routeId: route.id,
          });
        }
      }

      const routes = await storage.getDeliveryRoutes();
      const newRoute = routes.find(r => r.id === route.id);
      
      // Broadcast real-time update
      const wsManager = getWebSocketManager();
      if (wsManager) {
        wsManager.broadcast({
          type: 'route_created',
          data: newRoute,
        });
      }

      res.json(newRoute);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  app.patch("/api/delivery/routes/:id", authenticateToken, async (req, res) => {
    try {
      const updates = req.body;
      const route = await storage.updateDeliveryRoute(parseInt(req.params.id), updates);
      
      // Broadcast real-time update
      const wsManager = getWebSocketManager();
      if (wsManager) {
        wsManager.broadcast({
          type: 'route_updated',
          data: route,
        });
      }

      res.json(route);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  app.patch("/api/delivery/stops/:id", authenticateToken, async (req, res) => {
    try {
      const updates = req.body;
      const stop = await storage.updateDeliveryStop(parseInt(req.params.id), updates);
      
      // Broadcast real-time update
      const wsManager = getWebSocketManager();
      if (wsManager) {
        wsManager.broadcast({
          type: 'stop_updated',
          data: stop,
        });
      }

      res.json(stop);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  return httpServer;
}

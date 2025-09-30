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
import { registerRoutes as registerAuthRoutes } from "./routes/auth";
import { registerRoutes as registerOrderRoutes } from "./routes/orders";
import { registerRoutes as registerCustomerRoutes } from "./routes/customers";
import { registerRoutes as registerInventoryRoutes } from "./routes/inventory";
import { registerRoutes as registerDriverRoutes } from "./routes/drivers";
import { registerRoutes as registerAnalyticsRoutes } from "./routes/analytics";
import { registerRoutes as registerWorkflowRoutes } from "./routes/workflows";
import { registerRoutes as registerNotificationRoutes } from "./routes/notifications";
import { registerRoutes as registerTenantRoutes } from "./routes/tenants";
import { registerRoutes as registerSuperAdminRoutes } from "./routes/superadmin";
import aiOperationsRouter from "./routes/ai-operations";
import productionConfigRouter from "./routes/production-config";
import laundryFinancialAIRouter from "./routes/laundry-financial-ai";

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

  // Loyalty endpoints
  app.post("/api/loyalty/earn", authenticateToken, async (req, res) => {
    try {
      const { customerId, orderId, amount } = req.body;
      
      if (!customerId || !orderId || !amount) {
        return res.status(400).json({ message: "Missing required fields" });
      }

      // Calculate points: 1 point per BHD spent (round down)
      const points = Math.floor(amount);
      
      if (points <= 0) {
        return res.status(400).json({ message: "Order amount too small to earn points" });
      }

      const transaction = await storage.addLoyaltyPoints(
        customerId,
        points,
        orderId,
        'earned',
        `Earned ${points} points from order #${orderId}`
      );

      const balance = await storage.getLoyaltyBalance(customerId);

      res.json({ 
        transaction, 
        balance,
        pointsEarned: points 
      });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.post("/api/loyalty/redeem", authenticateToken, async (req, res) => {
    try {
      const { customerId, points } = req.body;
      
      if (!customerId || !points) {
        return res.status(400).json({ message: "Missing required fields" });
      }

      if (points <= 0) {
        return res.status(400).json({ message: "Invalid points amount" });
      }

      // Check if points are in multiples of 100 (100 points = 5 BHD)
      if (points % 100 !== 0) {
        return res.status(400).json({ message: "Points must be in multiples of 100" });
      }

      // Calculate discount value
      const discountValue = (points / 100) * 5;

      const transaction = await storage.redeemPoints(
        customerId,
        points,
        `Redeemed ${points} points for ${discountValue} BHD discount`
      );

      const balance = await storage.getLoyaltyBalance(customerId);

      res.json({ 
        transaction, 
        balance,
        pointsRedeemed: points,
        discountValue 
      });
    } catch (error: any) {
      if (error.message === 'Insufficient loyalty points') {
        return res.status(400).json({ message: error.message });
      }
      res.status(500).json({ message: error.message });
    }
  });

  app.get("/api/loyalty/:customerId", authenticateToken, async (req, res) => {
    try {
      const customerId = parseInt(req.params.customerId);
      
      if (!customerId) {
        return res.status(400).json({ message: "Invalid customer ID" });
      }

      const balance = await storage.getLoyaltyBalance(customerId);
      const history = await storage.getLoyaltyHistory(customerId);

      res.json({ 
        balance, 
        history 
      });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.get("/api/loyalty/:customerId/available", authenticateToken, async (req, res) => {
    try {
      const customerId = parseInt(req.params.customerId);
      
      if (!customerId) {
        return res.status(400).json({ message: "Invalid customer ID" });
      }

      const balance = await storage.getLoyaltyBalance(customerId);
      
      // Calculate available redemption options (100 points = 5 BHD)
      const availableRedemptions = [];
      
      if (balance >= 100) {
        const maxRedeemable = Math.floor(balance / 100) * 100;
        
        for (let points = 100; points <= maxRedeemable && points <= 1000; points += 100) {
          availableRedemptions.push({
            points,
            value: (points / 100) * 5,
            description: `${points} points for ${(points / 100) * 5} BHD discount`
          });
        }
      }

      res.json({ 
        balance,
        availableRedemptions 
      });
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

  // Organization management routes
  app.get("/api/organizations", authenticateToken, async (req: any, res) => {
    try {
      const tenantId = req.user.tenantId || 1; // Default to tenant 1 for demo
      const organizations = await storage.getAllOrganizations(tenantId);
      res.json(organizations);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.get("/api/organizations/:id", authenticateToken, async (req, res) => {
    try {
      const organization = await storage.getOrganization(parseInt(req.params.id));
      if (!organization) {
        return res.status(404).json({ message: "Organization not found" });
      }
      res.json(organization);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.post("/api/organizations", authenticateToken, async (req: any, res) => {
    try {
      const tenantId = req.user.tenantId || 1;
      const organization = await storage.createOrganization({
        ...req.body,
        tenantId
      });
      res.json(organization);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  app.patch("/api/organizations/:id", authenticateToken, async (req, res) => {
    try {
      const organization = await storage.updateOrganization(parseInt(req.params.id), req.body);
      res.json(organization);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  // Employee management routes
  app.get("/api/employees", authenticateToken, async (req: any, res) => {
    try {
      const tenantId = req.user.tenantId || 1;
      const organizationId = req.query.organizationId ? parseInt(req.query.organizationId) : undefined;
      const employees = await storage.getAllEmployees(tenantId, organizationId);
      res.json(employees);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.get("/api/employees/:id", authenticateToken, async (req, res) => {
    try {
      const employee = await storage.getEmployee(parseInt(req.params.id));
      if (!employee) {
        return res.status(404).json({ message: "Employee not found" });
      }
      res.json(employee);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.post("/api/employees", authenticateToken, async (req: any, res) => {
    try {
      const tenantId = req.user.tenantId || 1;
      const employee = await storage.createEmployee({
        ...req.body,
        tenantId
      });
      res.json(employee);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  app.patch("/api/employees/:id", authenticateToken, async (req, res) => {
    try {
      const employee = await storage.updateEmployee(parseInt(req.params.id), req.body);
      res.json(employee);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  app.post("/api/employees/:id/deactivate", authenticateToken, async (req, res) => {
    try {
      const employee = await storage.deactivateEmployee(
        parseInt(req.params.id), 
        new Date(req.body.terminationDate)
      );
      res.json(employee);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  // Payroll management routes
  app.get("/api/payroll", authenticateToken, async (req: any, res) => {
    try {
      const tenantId = req.user.tenantId || 1;
      const employeeId = req.query.employeeId ? parseInt(req.query.employeeId) : undefined;
      const records = await storage.getAllPayrollRecords(tenantId, employeeId);
      res.json(records);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.get("/api/payroll/:id", authenticateToken, async (req, res) => {
    try {
      const record = await storage.getPayrollRecord(parseInt(req.params.id));
      if (!record) {
        return res.status(404).json({ message: "Payroll record not found" });
      }
      res.json(record);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.get("/api/payroll/period", authenticateToken, async (req: any, res) => {
    try {
      const tenantId = req.user.tenantId || 1;
      const { startDate, endDate } = req.query;
      const records = await storage.getPayrollByPeriod(
        tenantId,
        new Date(startDate as string),
        new Date(endDate as string)
      );
      res.json(records);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.post("/api/payroll", authenticateToken, async (req: any, res) => {
    try {
      const tenantId = req.user.tenantId || 1;
      const record = await storage.createPayrollRecord({
        ...req.body,
        tenantId,
        preparedBy: req.user.id
      });
      res.json(record);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  app.patch("/api/payroll/:id", authenticateToken, async (req, res) => {
    try {
      const record = await storage.updatePayrollRecord(parseInt(req.params.id), req.body);
      res.json(record);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  app.post("/api/payroll/:id/approve", authenticateToken, async (req: any, res) => {
    try {
      const record = await storage.approvePayroll(parseInt(req.params.id), req.user.id);
      res.json(record);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  app.post("/api/payroll/:id/pay", authenticateToken, async (req, res) => {
    try {
      const record = await storage.markPayrollAsPaid(
        parseInt(req.params.id),
        new Date(req.body.paymentDate),
        req.body.paymentReference
      );
      res.json(record);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  // Expense management routes
  app.get("/api/expense-categories", authenticateToken, async (req: any, res) => {
    try {
      const tenantId = req.user.tenantId || 1;
      const categories = await storage.getAllExpenseCategories(tenantId);
      res.json(categories);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.post("/api/expense-categories", authenticateToken, async (req: any, res) => {
    try {
      const tenantId = req.user.tenantId || 1;
      const category = await storage.createExpenseCategory({
        ...req.body,
        tenantId
      });
      res.json(category);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  app.get("/api/expenses", authenticateToken, async (req: any, res) => {
    try {
      const tenantId = req.user.tenantId || 1;
      const organizationId = req.query.organizationId ? parseInt(req.query.organizationId) : undefined;
      const expenses = await storage.getAllExpenses(tenantId, organizationId);
      res.json(expenses);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.get("/api/expenses/:id", authenticateToken, async (req, res) => {
    try {
      const expense = await storage.getExpense(parseInt(req.params.id));
      if (!expense) {
        return res.status(404).json({ message: "Expense not found" });
      }
      res.json(expense);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.get("/api/expenses/date-range", authenticateToken, async (req: any, res) => {
    try {
      const tenantId = req.user.tenantId || 1;
      const { startDate, endDate } = req.query;
      const expenses = await storage.getExpensesByDateRange(
        tenantId,
        new Date(startDate as string),
        new Date(endDate as string)
      );
      res.json(expenses);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.post("/api/expenses", authenticateToken, async (req: any, res) => {
    try {
      const tenantId = req.user.tenantId || 1;
      const expense = await storage.createExpense({
        ...req.body,
        tenantId,
        createdBy: req.user.id
      });
      res.json(expense);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  app.patch("/api/expenses/:id", authenticateToken, async (req, res) => {
    try {
      const expense = await storage.updateExpense(parseInt(req.params.id), req.body);
      res.json(expense);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  app.delete("/api/expenses/:id", authenticateToken, async (req, res) => {
    try {
      await storage.deleteExpense(parseInt(req.params.id));
      res.json({ message: "Expense deleted successfully" });
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  // Asset management routes
  app.get("/api/assets", authenticateToken, async (req: any, res) => {
    try {
      const tenantId = req.user.tenantId || 1;
      const organizationId = req.query.organizationId ? parseInt(req.query.organizationId) : undefined;
      const assets = await storage.getAllAssets(tenantId, organizationId);
      res.json(assets);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.get("/api/assets/:id", authenticateToken, async (req, res) => {
    try {
      const asset = await storage.getAsset(parseInt(req.params.id));
      if (!asset) {
        return res.status(404).json({ message: "Asset not found" });
      }
      res.json(asset);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.get("/api/assets/maintenance-due", authenticateToken, async (req: any, res) => {
    try {
      const tenantId = req.user.tenantId || 1;
      const assets = await storage.getAssetsDueForMaintenance(tenantId);
      res.json(assets);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.post("/api/assets", authenticateToken, async (req: any, res) => {
    try {
      const tenantId = req.user.tenantId || 1;
      const asset = await storage.createAsset({
        ...req.body,
        tenantId
      });
      res.json(asset);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  app.patch("/api/assets/:id", authenticateToken, async (req, res) => {
    try {
      const asset = await storage.updateAsset(parseInt(req.params.id), req.body);
      res.json(asset);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  app.post("/api/assets/:id/maintenance", authenticateToken, async (req, res) => {
    try {
      const asset = await storage.updateAssetMaintenance(
        parseInt(req.params.id),
        new Date(req.body.maintenanceDate),
        req.body.nextMaintenanceDate ? new Date(req.body.nextMaintenanceDate) : undefined
      );
      res.json(asset);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  // Revenue management routes
  app.get("/api/revenues", authenticateToken, async (req: any, res) => {
    try {
      const tenantId = req.user.tenantId || 1;
      const organizationId = req.query.organizationId ? parseInt(req.query.organizationId) : undefined;
      const revenues = await storage.getAllRevenues(tenantId, organizationId);
      res.json(revenues);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.get("/api/revenues/:id", authenticateToken, async (req, res) => {
    try {
      const revenue = await storage.getRevenue(parseInt(req.params.id));
      if (!revenue) {
        return res.status(404).json({ message: "Revenue not found" });
      }
      res.json(revenue);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.get("/api/revenues/date-range", authenticateToken, async (req: any, res) => {
    try {
      const tenantId = req.user.tenantId || 1;
      const { startDate, endDate } = req.query;
      const revenues = await storage.getRevenuesByDateRange(
        tenantId,
        new Date(startDate as string),
        new Date(endDate as string)
      );
      res.json(revenues);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.post("/api/revenues", authenticateToken, async (req: any, res) => {
    try {
      const tenantId = req.user.tenantId || 1;
      const revenue = await storage.createRevenue({
        ...req.body,
        tenantId
      });
      res.json(revenue);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  app.patch("/api/revenues/:id", authenticateToken, async (req, res) => {
    try {
      const revenue = await storage.updateRevenue(parseInt(req.params.id), req.body);
      res.json(revenue);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  // Financial period routes
  app.get("/api/financial-periods", authenticateToken, async (req: any, res) => {
    try {
      const tenantId = req.user.tenantId || 1;
      const periods = await storage.getAllFinancialPeriods(tenantId);
      res.json(periods);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.get("/api/financial-periods/:id", authenticateToken, async (req, res) => {
    try {
      const period = await storage.getFinancialPeriod(parseInt(req.params.id));
      if (!period) {
        return res.status(404).json({ message: "Financial period not found" });
      }
      res.json(period);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.get("/api/financial-periods/current", authenticateToken, async (req: any, res) => {
    try {
      const tenantId = req.user.tenantId || 1;
      const periodType = req.query.periodType as string || 'monthly';
      const period = await storage.getCurrentFinancialPeriod(tenantId, periodType);
      res.json(period);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.post("/api/financial-periods", authenticateToken, async (req: any, res) => {
    try {
      const tenantId = req.user.tenantId || 1;
      const period = await storage.createFinancialPeriod({
        ...req.body,
        tenantId,
        createdBy: req.user.id
      });
      res.json(period);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  app.post("/api/financial-periods/:id/close", authenticateToken, async (req: any, res) => {
    try {
      const period = await storage.closeFinancialPeriod(parseInt(req.params.id), req.user.id);
      res.json(period);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  app.get("/api/financial-periods/totals", authenticateToken, async (req: any, res) => {
    try {
      const tenantId = req.user.tenantId || 1;
      const { startDate, endDate } = req.query;
      const totals = await storage.calculatePeriodTotals(
        tenantId,
        new Date(startDate as string),
        new Date(endDate as string)
      );
      res.json(totals);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Subscription management routes (Super Admin)
  app.get("/api/subscription-plans", async (req, res) => {
    try {
      const plans = req.query.active === 'true' 
        ? await storage.getActiveSubscriptionPlans()
        : await storage.getAllSubscriptionPlans();
      res.json(plans);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.get("/api/subscription-plans/:id", async (req, res) => {
    try {
      const plan = await storage.getSubscriptionPlan(parseInt(req.params.id));
      if (!plan) {
        return res.status(404).json({ message: "Subscription plan not found" });
      }
      res.json(plan);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.post("/api/subscription-plans", authenticateToken, async (req: any, res) => {
    try {
      // Only super admins can create plans
      if (req.user.role !== 'superadmin') {
        return res.status(403).json({ message: "Access denied" });
      }
      const plan = await storage.createSubscriptionPlan(req.body);
      res.json(plan);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  app.patch("/api/subscription-plans/:id", authenticateToken, async (req: any, res) => {
    try {
      // Only super admins can update plans
      if (req.user.role !== 'superadmin') {
        return res.status(403).json({ message: "Access denied" });
      }
      const plan = await storage.updateSubscriptionPlan(parseInt(req.params.id), req.body);
      res.json(plan);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  app.get("/api/tenant-subscription", authenticateToken, async (req: any, res) => {
    try {
      const tenantId = req.user.tenantId || 1;
      const subscription = await storage.getTenantSubscription(tenantId);
      res.json(subscription);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.post("/api/tenant-subscriptions", authenticateToken, async (req: any, res) => {
    try {
      // Only super admins can create subscriptions
      if (req.user.role !== 'superadmin') {
        return res.status(403).json({ message: "Access denied" });
      }
      const subscription = await storage.createTenantSubscription(req.body);
      res.json(subscription);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  // Attendance management routes
  app.get("/api/attendance/employee/:employeeId", authenticateToken, async (req, res) => {
    try {
      const employeeId = parseInt(req.params.employeeId);
      const startDate = req.query.startDate ? new Date(req.query.startDate as string) : undefined;
      const endDate = req.query.endDate ? new Date(req.query.endDate as string) : undefined;
      const records = await storage.getAllAttendanceRecords(employeeId, startDate, endDate);
      res.json(records);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.get("/api/attendance/:id", authenticateToken, async (req, res) => {
    try {
      const record = await storage.getAttendanceRecord(parseInt(req.params.id));
      if (!record) {
        return res.status(404).json({ message: "Attendance record not found" });
      }
      res.json(record);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.post("/api/attendance/check-in", authenticateToken, async (req: any, res) => {
    try {
      const employee = await storage.getEmployeeByUserId(req.user.id);
      if (!employee) {
        return res.status(404).json({ message: "Employee profile not found" });
      }
      const record = await storage.checkIn(employee.id);
      res.json(record);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  app.post("/api/attendance/check-out", authenticateToken, async (req: any, res) => {
    try {
      const employee = await storage.getEmployeeByUserId(req.user.id);
      if (!employee) {
        return res.status(404).json({ message: "Employee profile not found" });
      }
      const record = await storage.checkOut(employee.id);
      res.json(record);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  // Super Admin routes
  app.get("/api/superadmin/stats", authenticateToken, async (req: any, res) => {
    try {
      // Only super admins can access this
      if (req.user.role !== 'superadmin') {
        return res.status(403).json({ message: "Access denied" });
      }
      const stats = await storage.getSuperAdminStats();
      res.json(stats);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.get("/api/superadmin/tenants", authenticateToken, async (req: any, res) => {
    try {
      // Only super admins can access this
      if (req.user.role !== 'superadmin') {
        return res.status(403).json({ message: "Access denied" });
      }
      const tenants = await storage.getAllTenantsWithSubscriptions();
      res.json(tenants);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Register all routes
  registerAuthRoutes(app);
  registerOrderRoutes(app);
  registerCustomerRoutes(app);
  registerInventoryRoutes(app);
  registerDriverRoutes(app);
  registerAnalyticsRoutes(app);
  registerWorkflowRoutes(app);
  registerNotificationRoutes(app);
  registerTenantRoutes(app);
  registerSuperAdminRoutes(app);

  // AI Operations and Production Config
  app.use(aiOperationsRouter);
  app.use(productionConfigRouter);
  app.use(laundryFinancialAIRouter);

  // Initialize WebSocket server
  initializeWebSocket(httpServer);

  return httpServer;
}
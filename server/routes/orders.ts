
import type { Express } from "express";
import { storage } from "../storage";
import { insertOrderSchema, insertOrderItemSchema } from "@shared/schema";
import { getWebSocketManager } from "../websocket";

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
    const jwt = require('jsonwebtoken');
    const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";
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

export function registerRoutes(app: Express): void {
  // Get all orders
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

  // Get order by ID
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

  // Create new order
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

  // Update order
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

  // Get orders by status
  app.get("/api/orders/status/:status", authenticateToken, async (req, res) => {
    try {
      const orders = await storage.getOrdersByStatus(req.params.status);
      res.json(orders);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });
}

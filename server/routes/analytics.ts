
import type { Express } from "express";
import { storage } from "../storage";

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
  // Get analytics overview
  app.get("/api/analytics/overview", authenticateToken, async (req, res) => {
    try {
      const tenantId = req.query.tenantId ? parseInt(req.query.tenantId as string) : undefined;
      
      // Get key metrics
      const totalOrders = await storage.getAllOrders();
      const totalCustomers = await storage.getAllCustomers();
      const recentEvents = await storage.getAnalyticsEvents(tenantId);
      
      // Calculate revenue
      const totalRevenue = totalOrders.reduce((sum, order) => 
        sum + parseFloat(order.totalAmount || '0'), 0
      );
      
      // Calculate order status distribution
      const ordersByStatus = totalOrders.reduce((acc, order) => {
        acc[order.status] = (acc[order.status] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

      // Get recent orders
      const recentOrders = totalOrders
        .filter(order => order.createdAt)
        .sort((a, b) => new Date(b.createdAt!).getTime() - new Date(a.createdAt!).getTime())
        .slice(0, 10);

      const overview = {
        totalOrders: totalOrders.length,
        totalCustomers: totalCustomers.length,
        totalRevenue: totalRevenue.toFixed(2),
        ordersByStatus,
        recentOrders,
        recentEvents: recentEvents.slice(0, 10)
      };
      
      res.json(overview);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Get analytics events
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

  // Get revenue analytics
  app.get("/api/analytics/revenue", authenticateToken, async (req, res) => {
    try {
      const period = req.query.period as string || 'month';
      
      const orders = await storage.getAllOrders();
      
      // Group revenue by time period
      const revenueData = orders
        .filter(order => order.createdAt)
        .reduce((acc, order) => {
          const date = new Date(order.createdAt!);
          let key: string;
          
          if (period === 'day') {
            key = date.toISOString().split('T')[0];
          } else if (period === 'week') {
            const week = Math.floor(date.getTime() / (7 * 24 * 60 * 60 * 1000));
            key = `Week ${week}`;
          } else {
            key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
          }
          
          acc[key] = (acc[key] || 0) + parseFloat(order.totalAmount || '0');
          return acc;
        }, {} as Record<string, number>);
      
      res.json(revenueData);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Create analytics event
  app.post("/api/analytics/events", authenticateToken, async (req, res) => {
    try {
      const event = await storage.createAnalyticsEvent(req.body);
      res.status(201).json(event);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });
}

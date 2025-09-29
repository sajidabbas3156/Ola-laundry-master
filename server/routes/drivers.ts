
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
  // Get drivers overview
  app.get("/api/drivers/overview", authenticateToken, async (req: any, res) => {
    try {
      const driverId = req.user.role === 'delivery_agent' ? req.user.id : undefined;
      
      // Get all delivery routes and stats
      const routes = await storage.getDeliveryRoutes(driverId);
      const totalRoutes = routes.length;
      const activeRoutes = routes.filter(route => route.status === 'in_progress').length;
      const completedRoutes = routes.filter(route => route.status === 'completed').length;
      
      const overview = {
        totalRoutes,
        activeRoutes, 
        completedRoutes,
        routes: routes.slice(0, 10) // Recent routes
      };
      
      res.json(overview);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Get delivery routes for drivers (alias for existing functionality)
  app.get("/api/drivers/routes", authenticateToken, async (req: any, res) => {
    try {
      const driverId = req.user.role === 'delivery_agent' ? req.user.id : undefined;
      const routes = await storage.getDeliveryRoutes(driverId);
      res.json(routes);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Get delivery routes for drivers (original endpoint)
  app.get("/api/delivery/routes", authenticateToken, async (req: any, res) => {
    try {
      const driverId = req.user.role === 'delivery_agent' ? req.user.id : undefined;
      const routes = await storage.getDeliveryRoutes(driverId);
      res.json(routes);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Get driver profile
  app.get("/api/drivers/profile", authenticateToken, async (req: any, res) => {
    try {
      if (req.user.role !== 'delivery_agent') {
        return res.status(403).json({ message: "Access denied - drivers only" });
      }
      
      const user = await storage.getUser(req.user.id);
      if (!user) {
        return res.status(404).json({ message: "Driver not found" });
      }
      
      // Get driver stats
      const routes = await storage.getDeliveryRoutes(req.user.id);
      const totalDeliveries = routes.reduce((sum, route) => sum + (route.stops?.length || 0), 0);
      const completedDeliveries = routes
        .filter(route => route.status === 'completed')
        .reduce((sum, route) => sum + (route.stops?.length || 0), 0);
      
      const profile = {
        ...user,
        password: undefined, // Don't return password
        stats: {
          totalRoutes: routes.length,
          totalDeliveries,
          completedDeliveries,
          completionRate: totalDeliveries > 0 ? (completedDeliveries / totalDeliveries * 100).toFixed(1) : '0'
        }
      };
      
      res.json(profile);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Update delivery stop status
  app.patch("/api/delivery/stops/:id", authenticateToken, async (req, res) => {
    try {
      const updates = req.body;
      const stop = await storage.updateDeliveryStop(parseInt(req.params.id), updates);
      res.json(stop);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  // Create new delivery route
  app.post("/api/drivers/routes", authenticateToken, async (req, res) => {
    try {
      const route = await storage.createDeliveryRoute(req.body);
      res.status(201).json(route);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });
}

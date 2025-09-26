
import type { Express } from "express";
import { storage } from "../storage";
import { insertCustomerSchema } from "@shared/schema";

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
  // Get all customers
  app.get("/api/customers", authenticateToken, async (req, res) => {
    try {
      const customers = await storage.getAllCustomers();
      res.json(customers);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Get customer by ID
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

  // Create new customer
  app.post("/api/customers", authenticateToken, async (req, res) => {
    try {
      const customerData = insertCustomerSchema.parse(req.body);
      const customer = await storage.createCustomer(customerData);
      res.json(customer);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  // Update customer
  app.patch("/api/customers/:id", authenticateToken, async (req, res) => {
    try {
      const updates = req.body;
      const customer = await storage.updateCustomer(parseInt(req.params.id), updates);
      res.json(customer);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });
}

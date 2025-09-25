
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
  // Get all workflows
  app.get("/api/workflows", authenticateToken, async (req, res) => {
    try {
      const tenantId = req.query.tenantId ? parseInt(req.query.tenantId as string) : undefined;
      const workflows = await storage.getAllWorkflows(tenantId);
      res.json(workflows);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Create workflow
  app.post("/api/workflows", authenticateToken, async (req, res) => {
    try {
      const workflow = await storage.createWorkflow(req.body);
      res.status(201).json(workflow);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  // Update workflow
  app.put("/api/workflows/:id", authenticateToken, async (req, res) => {
    try {
      const workflow = await storage.updateWorkflow(parseInt(req.params.id), req.body);
      res.json(workflow);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  // Delete workflow
  app.delete("/api/workflows/:id", authenticateToken, async (req, res) => {
    try {
      await storage.deleteWorkflow(parseInt(req.params.id));
      res.status(204).send();
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });
}

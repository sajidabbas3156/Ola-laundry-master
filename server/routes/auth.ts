import { Router } from "express";
import type { Request, Response } from "express";

const router = Router();

// Mock authentication for development
router.post("/api/auth/login", async (req: Request, res: Response) => {
  try {
    const { username, password } = req.body;

    // Simple mock authentication
    if (username && password) {
      res.json({
        success: true,
        user: {
          id: "1",
          username,
          role: "tenant_admin",
          tenant_id: "ola_laundry"
        },
        token: "mock_jwt_token"
      });
    } else {
      res.status(401).json({ error: "Invalid credentials" });
    }
  } catch (error) {
    res.status(500).json({ error: "Authentication failed" });
  }
});

router.post("/api/auth/logout", async (req: Request, res: Response) => {
  res.json({ success: true, message: "Logged out successfully" });
});

export function registerRoutes(app: any) {
  app.use(router);
}

export default router;
import express, { type Request, Response, NextFunction } from "express";
import cors from "cors";
import compression from "compression";
import { registerRoutes } from "./routes";
import { setupVite, serveStatic, log } from "./vite";
import { securityMiddleware, corsOptions, generalRateLimit, requestId, disableDevRoutes } from "./security";
import logger from "./logger";

const app = express();

// Request ID middleware
app.use(requestId);

// Security middleware
app.use(securityMiddleware);

// CORS configuration
app.use(cors(corsOptions));

// Rate limiting
if (process.env.NODE_ENV === 'production') {
  app.use(generalRateLimit);
}

// Disable dev routes in production
app.use(disableDevRoutes);

// Compression middleware
app.use(compression());

// Trust proxy if behind reverse proxy (Nginx)
if (process.env.TRUST_PROXY === 'true') {
  app.set('trust proxy', 1);
}

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: false, limit: '10mb' }));

app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  let capturedJsonResponse: Record<string, any> | undefined = undefined;

  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path.startsWith("/api")) {
      let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }

      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "…";
      }

      log(logLine);
    }
  });

  next();
});

(async () => {
  const server = await registerRoutes(app);
  
  // Initialize database with demo data for Bahrain market
  if (app.get("env") === "development") {
    try {
      const { seedDatabase } = await import("./seedData");
      await seedDatabase();
    } catch (error: any) {
      log("Demo data initialization:", error.message);
    }
  }

  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";

    res.status(status).json({ message });
    throw err;
  });

  // importantly only setup vite in development and after
  // setting up all the other routes so the catch-all route
  // doesn't interfere with the other routes
  if (app.get("env") === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }

  // Production server configuration
  const port = parseInt(process.env.PORT || '5000', 10);
  const host = process.env.HOST || '0.0.0.0';
  
  server.listen(port, host, () => {
    log(`🚀 OLA Laundry Master server running on ${host}:${port}`);
    log(`🌐 Environment: ${process.env.NODE_ENV || 'development'}`);
    log(`🔗 Domain: ${process.env.DOMAIN || 'localhost'}`);
    
    if (process.env.NODE_ENV === 'production') {
      log(`✅ Production server ready at https://${process.env.DOMAIN}`);
    } else {
      log(`🔧 Development server ready at http://localhost:${port}`);
    }
  });
})();

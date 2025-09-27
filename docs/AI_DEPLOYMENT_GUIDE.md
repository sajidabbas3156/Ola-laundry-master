# AI Features Deployment Guide

## Quick Start

This guide will help you deploy the AI features of OLA Laundry Master to production.

### 1. Pre-deployment Checklist

- [ ] Server meets minimum requirements (Node.js 18+, PostgreSQL 13+)
- [ ] Environment variables configured
- [ ] SSL certificates installed
- [ ] Database backup completed
- [ ] PM2 installed globally

### 2. Environment Setup

Create production environment file:

```bash
cp .env.production.example .env.production
```

Update the following critical variables:

```bash
# Security
JWT_SECRET=your-super-secure-jwt-secret-change-this
DATABASE_URL=postgresql://user:password@localhost:5432/production_db

# Domain
DOMAIN=your-domain.com
CORS_ORIGIN=https://your-domain.com

# AI Services (if using external AI)
AI_SERVICE_URL=https://api.your-ai-provider.com
AI_API_KEY=your-ai-api-key
```

### 3. Database Migration

```bash
# Push schema to production database
npm run db:push

# Verify database connection
node -e "require('./server/db.js').db.select().from('users').limit(1).then(console.log)"
```

### 4. Build and Deploy

```bash
# Install production dependencies
npm ci --production

# Build the application
npm run build

# Start with PM2
npm run start:prod
```

### 5. Verify AI Features

Test AI endpoints:

```bash
# Test AI Operations Center
curl -H "Authorization: Bearer demo-token-123" \
     https://your-domain.com/api/ai/operations

# Test Financial AI
curl -H "Authorization: Bearer demo-token-123" \
     https://your-domain.com/api/financial/ai-analysis

# Test AI Validation
curl -H "Authorization: Bearer demo-token-123" \
     https://your-domain.com/api/ai/validation
```

## Production Configuration

### Nginx Configuration

```nginx
server {
    listen 443 ssl http2;
    server_name your-domain.com;
    
    ssl_certificate /path/to/certificate.crt;
    ssl_certificate_key /path/to/private.key;
    
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
    
    # AI API endpoints with longer timeout
    location /api/ai/ {
        proxy_pass http://localhost:3000;
        proxy_read_timeout 300s;
        proxy_connect_timeout 75s;
    }
}
```

### PM2 Ecosystem Configuration

```javascript
module.exports = {
  apps: [{
    name: 'olalaundry',
    script: 'dist/index.js',
    instances: 'max',
    exec_mode: 'cluster',
    env_production: {
      NODE_ENV: 'production',
      PORT: 3000,
      HOST: '0.0.0.0'
    },
    // AI-specific configurations
    max_memory_restart: '2G', // Increased for AI processing
    node_args: '--max-old-space-size=2048',
    // Health checks
    health_check_grace_period: 10000, // AI models need more time
    // Logging
    error_file: '/var/log/olalaundry/ai-errors.log',
    out_file: '/var/log/olalaundry/ai-output.log'
  }]
};
```

## AI Service Integration

### External AI Provider Setup

If using external AI services, configure the integration:

```typescript
// server/services/aiService.ts
export class AIService {
  private apiKey: string;
  private baseUrl: string;

  constructor() {
    this.apiKey = process.env.AI_API_KEY!;
    this.baseUrl = process.env.AI_SERVICE_URL!;
  }

  async generateInsights(businessData: any) {
    const response = await fetch(`${this.baseUrl}/insights`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(businessData)
    });
    
    if (!response.ok) {
      throw new Error(`AI service error: ${response.statusText}`);
    }
    
    return response.json();
  }
}
```

### Model Training Pipeline

Set up automated model training:

```bash
# Create training script
cat > scripts/train-models.sh << 'EOF'
#!/bin/bash
set -e

echo "Starting AI model training..."

# Export training data
node scripts/export-training-data.js

# Train models (example with Python)
python3 ai/train_revenue_model.py
python3 ai/train_demand_model.py

# Validate models
node scripts/validate-models.js

# Deploy models if validation passes
if [ $? -eq 0 ]; then
    echo "Models validated successfully, deploying..."
    node scripts/deploy-models.js
else
    echo "Model validation failed, keeping existing models"
    exit 1
fi
EOF

chmod +x scripts/train-models.sh
```

## Monitoring Setup

### Application Monitoring

```bash
# Install monitoring tools
npm install -g pm2-logrotate
pm2 install pm2-server-monit

# Configure log rotation
pm2 set pm2-logrotate:max_size 100M
pm2 set pm2-logrotate:retain 7
```

### AI-Specific Monitoring

Create monitoring dashboard for AI metrics:

```typescript
// server/monitoring/aiMetrics.ts
export class AIMetrics {
  static async collectMetrics() {
    return {
      modelAccuracy: await this.getModelAccuracy(),
      predictionLatency: await this.getPredictionLatency(),
      errorRate: await this.getErrorRate(),
      dataQuality: await this.getDataQuality()
    };
  }
  
  static async getModelAccuracy() {
    // Implementation to check model accuracy
  }
  
  static async getPredictionLatency() {
    // Implementation to measure prediction response times
  }
}
```

### Health Checks

```bash
# Create health check endpoint
curl https://your-domain.com/api/health/ai
```

Expected response:
```json
{
  "status": "healthy",
  "models": {
    "revenue": "active",
    "demand": "active",
    "costs": "active"
  },
  "lastUpdate": "2024-01-20T10:30:00Z",
  "accuracy": 89.4
}
```

## Security Hardening

### API Security

```typescript
// Rate limiting for AI endpoints
import rateLimit from 'express-rate-limit';

const aiRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many AI requests from this IP'
});

app.use('/api/ai/', aiRateLimit);
```

### Data Encryption

```bash
# Encrypt sensitive AI model files
gpg --symmetric --cipher-algo AES256 models/revenue_model.pkl
```

## Backup and Recovery

### Database Backup

```bash
# Create backup script for AI-related data
cat > scripts/backup-ai-data.sh << 'EOF'
#!/bin/bash
DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="/var/backups/olalaundry"

# Backup database
pg_dump $DATABASE_URL > $BACKUP_DIR/db_backup_$DATE.sql

# Backup AI models
tar -czf $BACKUP_DIR/ai_models_$DATE.tar.gz ai/models/

# Backup configuration
cp .env.production $BACKUP_DIR/env_backup_$DATE

echo "Backup completed: $DATE"
EOF

chmod +x scripts/backup-ai-data.sh
```

### Recovery Procedures

```bash
# Restore from backup
psql $DATABASE_URL < /var/backups/olalaundry/db_backup_YYYYMMDD_HHMMSS.sql
tar -xzf /var/backups/olalaundry/ai_models_YYYYMMDD_HHMMSS.tar.gz
```

## Performance Optimization

### Caching Strategy

```typescript
// Redis caching for AI predictions
import Redis from 'ioredis';

const redis = new Redis(process.env.REDIS_URL);

export async function getCachedPrediction(key: string) {
  const cached = await redis.get(`ai:prediction:${key}`);
  return cached ? JSON.parse(cached) : null;
}

export async function cachePrediction(key: string, data: any, ttl = 3600) {
  await redis.setex(`ai:prediction:${key}`, ttl, JSON.stringify(data));
}
```

### Database Optimization

```sql
-- Create indexes for AI queries
CREATE INDEX idx_orders_created_at ON orders(created_at);
CREATE INDEX idx_customers_created_at ON customers(created_at);
CREATE INDEX idx_financial_metrics_date ON financial_metrics(date);

-- Optimize for time-series queries
CREATE INDEX idx_orders_date_status ON orders(created_at, status);
```

## Troubleshooting

### Common Issues

1. **High Memory Usage**:
   ```bash
   # Increase Node.js memory limit
   node --max-old-space-size=4096 dist/index.js
   ```

2. **Slow AI Responses**:
   ```bash
   # Check AI service latency
   curl -w "@curl-format.txt" -s -o /dev/null https://api.ai-service.com/predict
   ```

3. **Model Accuracy Degradation**:
   ```bash
   # Run model validation
   node scripts/validate-models.js
   ```

### Debug Commands

```bash
# Check AI service status
pm2 show olalaundry

# View AI-specific logs
pm2 logs olalaundry --lines 100 | grep -i "ai\|prediction\|forecast"

# Test database connectivity
node -e "require('./server/db.js').db.raw('SELECT 1').then(() => console.log('DB OK'))"

# Validate AI endpoints
curl -v -H "Authorization: Bearer demo-token-123" \
     https://your-domain.com/api/ai/operations
```

## Maintenance Schedule

### Daily
- [ ] Check AI service health
- [ ] Monitor prediction accuracy
- [ ] Review error logs

### Weekly
- [ ] Update training data
- [ ] Run model validation tests
- [ ] Check performance metrics

### Monthly
- [ ] Retrain AI models
- [ ] Update dependencies
- [ ] Security audit
- [ ] Backup verification

## Support Contacts

- **Technical Issues**: tech-support@olalaundry.com
- **AI Model Issues**: ai-team@olalaundry.com
- **Emergency**: +973-XXXX-XXXX

---

**Deployment Checklist Complete**: ✅
**AI Features Status**: Production Ready
**Last Updated**: January 2024
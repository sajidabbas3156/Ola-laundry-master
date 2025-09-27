#!/bin/bash
set -e

# OLA Laundry Master - Fully Automated AlmaLinux Deployment
# This script handles everything automatically

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

log_info() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

log_warn() {
    echo -e "${YELLOW}[WARN]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

log_step() {
    echo -e "${BLUE}[STEP]${NC} $1"
}

echo "🚀 OLA LAUNDRY MASTER - AUTOMATED ALMALINUX DEPLOYMENT"
echo "====================================================="

# Configuration
APP_DIR="/var/www/olalaundry"
APP_NAME="olalaundry"
LOG_DIR="/var/log/olalaundry"

log_step "1. SYSTEM PREPARATION"
echo "====================="

# Update system
log_info "Updating system packages..."
sudo dnf update -y

# Install essential packages
log_info "Installing system dependencies..."
sudo dnf groupinstall -y "Development Tools"
sudo dnf install -y curl wget git nginx firewalld

# Install Node.js 18 if not present
if ! command -v node &> /dev/null || [[ $(node --version | cut -d'v' -f2 | cut -d'.' -f1) -lt 18 ]]; then
    log_info "Installing Node.js 18..."
    curl -fsSL https://rpm.nodesource.com/setup_18.x | sudo bash -
    sudo dnf install -y nodejs
fi

# Install PM2
if ! command -v pm2 &> /dev/null; then
    log_info "Installing PM2..."
    sudo npm install -g pm2
fi

log_step "2. APPLICATION SETUP"
echo "===================="

# Create directories
sudo mkdir -p $APP_DIR $LOG_DIR
sudo chown -R $USER:$USER $APP_DIR $LOG_DIR

# Navigate to app directory
cd $APP_DIR

# Ensure we have the latest code
log_info "Updating application code..."
if [ -d ".git" ]; then
    git fetch origin
    git reset --hard origin/main
else
    log_error "Git repository not found. Please clone first."
    exit 1
fi

# Clean previous builds
log_info "Cleaning previous builds..."
rm -rf node_modules dist build .next

# Install dependencies
log_info "Installing dependencies..."
npm ci --production=false

log_step "3. FIXING MODULE CONFLICTS"
echo "=========================="

# Fix ESM/CommonJS issues
log_info "Fixing module system conflicts..."

# Rename ecosystem config
if [ -f "ecosystem.config.js" ]; then
    mv ecosystem.config.js ecosystem.config.cjs
fi

# Remove duplicate route files that cause conflicts
log_info "Removing conflicting route files..."
rm -f server/routes/workflows.ts
rm -f server/routes/notifications.ts
rm -f server/routes/auth.ts
rm -f server/routes/customers.ts
rm -f server/routes/drivers.ts
rm -f server/routes/inventory.ts
rm -f server/routes/orders.ts
rm -f server/routes/superadmin.ts
rm -f server/routes/tenants.ts
rm -f server/routes/analytics.ts
rm -f server/routes/ai-operations.ts
rm -f server/routes/laundry-financial-ai.ts
rm -f server/routes/production-config.ts

log_step "4. BUILDING APPLICATION"
echo "======================="

# Build the application
log_info "Building application..."
if npm run build; then
    log_info "✅ Build completed successfully"
else
    log_error "❌ Build failed"
    
    # Try alternative build approach
    log_info "Trying alternative build approach..."
    
    # Build client only
    npx vite build
    
    # Build server manually
    npx esbuild server/index.ts --platform=node --packages=external --bundle --format=esm --outdir=dist --external:@shared/schema
    
    if [ -f "dist/index.js" ]; then
        log_info "✅ Alternative build succeeded"
    else
        log_error "❌ All build attempts failed"
        exit 1
    fi
fi

# Verify build output
if [ ! -f "dist/index.js" ]; then
    log_error "❌ Server build file missing: dist/index.js"
    exit 1
fi

if [ ! -f "dist/public/index.html" ]; then
    log_error "❌ Client build file missing: dist/public/index.html"
    exit 1
fi

log_info "✅ Build verification passed"

log_step "5. ENVIRONMENT SETUP"
echo "===================="

# Setup environment file
if [ ! -f ".env" ]; then
    log_info "Creating environment file..."
    cp .env.production .env
    
    # Set reasonable defaults for AlmaLinux
    sed -i 's/CHANGE_THIS_PASSWORD/olalaundry_secure_2024_$(date +%s)/g' .env
    sed -i 's/CHANGE_THIS_TO_A_SECURE_32_CHAR_SECRET/ola_jwt_secret_$(openssl rand -hex 16)/g' .env
    sed -i 's/www.olalaundry.com/localhost/g' .env
    sed -i 's/https:/http:/g' .env
    
    log_warn "⚠️ Environment file created with defaults"
    log_warn "⚠️ Edit .env with your actual production values later"
fi

log_step "6. DATABASE SETUP"
echo "================="

# Source environment variables
source .env

# Install PostgreSQL client if needed
if ! command -v pg_isready &> /dev/null; then
    log_info "Installing PostgreSQL client..."
    sudo dnf install -y postgresql
fi

# Test database connection if URL is set
if [ -n "$DATABASE_URL" ] && [[ "$DATABASE_URL" != *"CHANGE_THIS"* ]]; then
    log_info "Testing database connection..."
    if pg_isready -d "$DATABASE_URL" &> /dev/null; then
        log_info "✅ Database connection successful"
        
        # Run migrations
        log_info "Running database migrations..."
        npm run db:push
    else
        log_warn "⚠️ Database connection failed - continuing without migrations"
    fi
else
    log_warn "⚠️ DATABASE_URL not configured - skipping database setup"
fi

log_step "7. PM2 DEPLOYMENT"
echo "================="

# Stop any existing PM2 processes
pm2 delete $APP_NAME 2>/dev/null || log_info "No existing PM2 process to delete"

# Start PM2 process
log_info "Starting PM2 process..."
pm2 start ecosystem.config.cjs --env production

# Save PM2 configuration
pm2 save

# Setup PM2 startup
pm2 startup | grep -E '^sudo' | bash || log_info "PM2 startup already configured"

# Wait for application to start
log_info "Waiting for application to start..."
sleep 15

# Verify PM2 process
if pm2 list | grep -q "$APP_NAME.*online"; then
    log_info "✅ PM2 process is running"
else
    log_error "❌ PM2 process failed to start"
    pm2 logs $APP_NAME --lines 20
    exit 1
fi

log_step "8. NGINX SETUP"
echo "=============="

# Start and enable Nginx
sudo systemctl enable nginx
sudo systemctl start nginx

# Create Nginx configuration
log_info "Creating Nginx configuration..."
sudo tee /etc/nginx/conf.d/olalaundry.conf > /dev/null <<'EOF'
server {
    listen 80 default_server;
    listen [::]:80 default_server;
    server_name _;
    
    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
    
    # Compression
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types text/plain text/css text/xml text/javascript application/javascript application/xml+rss application/json;
    
    # Health check (no caching)
    location = /health {
        proxy_pass http://localhost:5000/health;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        access_log off;
    }
    
    # API endpoints
    location /api/ {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
    }
    
    # WebSocket support
    location /ws {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_read_timeout 86400;
    }
    
    # Static files with caching
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
        try_files $uri @backend;
    }
    
    # All other requests
    location / {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
    
    location @backend {
        proxy_pass http://localhost:5000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
EOF

# Remove default Nginx config
sudo rm -f /etc/nginx/conf.d/default.conf

# Test Nginx configuration
if sudo nginx -t; then
    log_info "✅ Nginx configuration is valid"
    sudo systemctl restart nginx
    
    if systemctl is-active --quiet nginx; then
        log_info "✅ Nginx is running"
    else
        log_error "❌ Nginx failed to start"
        sudo systemctl status nginx
    fi
else
    log_error "❌ Nginx configuration has errors"
    sudo nginx -t
    exit 1
fi

log_step "9. FIREWALL SETUP"
echo "================="

# Configure firewall
if systemctl is-active --quiet firewalld; then
    log_info "Configuring firewall..."
    sudo firewall-cmd --permanent --add-service=http
    sudo firewall-cmd --permanent --add-service=https
    sudo firewall-cmd --permanent --add-service=ssh
    sudo firewall-cmd --reload
    log_info "✅ Firewall configured"
else
    log_info "Starting firewall..."
    sudo systemctl enable firewalld
    sudo systemctl start firewalld
    sudo firewall-cmd --permanent --add-service=http
    sudo firewall-cmd --permanent --add-service=https
    sudo firewall-cmd --permanent --add-service=ssh
    sudo firewall-cmd --reload
    log_info "✅ Firewall started and configured"
fi

log_step "10. HEALTH CHECKS"
echo "================="

# Wait for services to stabilize
sleep 10

# Check application health
log_info "Testing application health..."
if curl -f http://localhost:5000/health &> /dev/null; then
    log_info "✅ Application health check passed"
    
    # Show health response
    echo "Health response:"
    curl -s http://localhost:5000/health | python3 -m json.tool 2>/dev/null || curl -s http://localhost:5000/health
else
    log_error "❌ Application health check failed"
    log_info "Checking PM2 logs..."
    pm2 logs $APP_NAME --lines 10
fi

# Check Nginx proxy
log_info "Testing Nginx proxy..."
if curl -f http://localhost/health &> /dev/null; then
    log_info "✅ Nginx proxy health check passed"
else
    log_warn "⚠️ Nginx proxy health check failed"
fi

# Get server IP
SERVER_IP=$(curl -s ifconfig.me 2>/dev/null || curl -s ipinfo.io/ip 2>/dev/null || echo "unknown")

log_step "11. DEPLOYMENT COMPLETE"
echo "======================="

echo ""
echo "🎉 DEPLOYMENT COMPLETED SUCCESSFULLY!"
echo "====================================="
echo ""
echo "📊 System Status:"
echo "- PM2 Process: $(pm2 list | grep $APP_NAME | awk '{print $12}' || echo 'Unknown')"
echo "- Nginx Status: $(systemctl is-active nginx)"
echo "- Firewall: $(systemctl is-active firewalld)"
echo ""
echo "🌐 Access URLs:"
echo "- Local: http://localhost/"
echo "- Local Health: http://localhost/health"
if [ "$SERVER_IP" != "unknown" ]; then
    echo "- External: http://$SERVER_IP/"
    echo "- External Health: http://$SERVER_IP/health"
fi
echo ""
echo "🤖 AI Features:"
echo "- AI Operations Center: http://localhost/tenant/ola-laundry/ai-operations"
echo "- Financial AI: Available in AI Operations Center"
echo ""
echo "🔧 Management Commands:"
echo "- Check status: pm2 status"
echo "- View logs: pm2 logs $APP_NAME"
echo "- Restart app: pm2 restart $APP_NAME"
echo "- Restart nginx: sudo systemctl restart nginx"
echo ""
echo "📋 Next Steps:"
echo "1. Test the URLs above"
echo "2. Edit .env with your production values"
echo "3. Setup SSL: sudo dnf install certbot python3-certbot-nginx && sudo certbot --nginx"
echo "4. Configure your domain DNS to point to: $SERVER_IP"
echo ""

# Final status check
if curl -f http://localhost:5000/health &> /dev/null; then
    log_info "🎯 DEPLOYMENT STATUS: SUCCESS ✅"
    echo "Your OLA Laundry Master application is now running!"
else
    log_warn "🎯 DEPLOYMENT STATUS: PARTIAL ⚠️"
    echo "Application deployed but may need configuration adjustments."
    echo "Check logs: pm2 logs $APP_NAME"
fi

echo ""
echo "🆘 If you need help:"
echo "- Check logs: pm2 logs $APP_NAME"
echo "- Check health: curl http://localhost:5000/health"
echo "- Check nginx: sudo systemctl status nginx"
echo "- Check firewall: sudo firewall-cmd --list-all"
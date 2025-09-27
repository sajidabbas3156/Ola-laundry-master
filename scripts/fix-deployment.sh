#!/bin/bash
set -e

# OLA Laundry Master - Deployment Fix Script
# This script fixes common deployment issues

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

echo "🔧 OLA LAUNDRY MASTER - DEPLOYMENT FIX"
echo "======================================"

# Configuration
APP_DIR="/var/www/olalaundry"
APP_NAME="olalaundry"
LOG_DIR="/var/log/olalaundry"

# Check if we're on the server
if [ ! -d "$APP_DIR" ]; then
    log_error "Application directory not found. Please run deployment first."
    exit 1
fi

cd $APP_DIR

log_step "1. FIXING SYSTEM DEPENDENCIES"
echo "=============================="

# Install Node.js if missing
if ! command -v node &> /dev/null; then
    log_info "Installing Node.js..."
    curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
    sudo apt-get install -y nodejs
fi

# Install PM2 if missing
if ! command -v pm2 &> /dev/null; then
    log_info "Installing PM2..."
    sudo npm install -g pm2
fi

# Install Nginx if missing
if ! command -v nginx &> /dev/null; then
    log_info "Installing Nginx..."
    sudo apt-get update
    sudo apt-get install -y nginx
fi

# Install additional dependencies
sudo apt-get install -y postgresql-client git build-essential jq curl

log_step "2. FIXING APPLICATION SETUP"
echo "============================"

# Create directories
sudo mkdir -p $LOG_DIR
sudo chown -R $USER:$USER $LOG_DIR

# Fix environment file
if [ ! -f ".env" ]; then
    log_info "Creating .env file..."
    cp .env.production .env
    
    # Set basic defaults
    sed -i 's/CHANGE_THIS_PASSWORD/olalaundry_secure_2024/g' .env
    sed -i 's/CHANGE_THIS_TO_A_SECURE_32_CHAR_SECRET/your_jwt_secret_change_this_in_production_123456/g' .env
    sed -i 's/www.olalaundry.com/localhost/g' .env
    
    log_warn "⚠️ .env file created with defaults. Please edit with your actual values:"
    log_warn "   nano .env"
fi

# Install dependencies if node_modules is missing
if [ ! -d "node_modules" ]; then
    log_info "Installing dependencies..."
    npm ci --production=false
fi

# Build application if dist is missing
if [ ! -d "dist" ] || [ ! -f "dist/index.js" ]; then
    log_info "Building application..."
    npm run build
    
    # Verify build
    if [ ! -f "dist/index.js" ]; then
        log_error "Build failed - dist/index.js not found"
        exit 1
    fi
fi

log_step "3. FIXING DATABASE SETUP"
echo "========================="

# Check if .env exists and has DATABASE_URL
if [ -f ".env" ]; then
    source .env
    
    if [ -n "$DATABASE_URL" ]; then
        # Test database connection
        if command -v pg_isready &> /dev/null; then
            if pg_isready -d "$DATABASE_URL" &> /dev/null; then
                log_info "✅ Database connection successful"
                
                # Run migrations
                log_info "Running database migrations..."
                npm run db:push
            else
                log_warn "⚠️ Database connection failed. Please check DATABASE_URL in .env"
                log_warn "Current DATABASE_URL: $DATABASE_URL"
            fi
        else
            log_warn "⚠️ pg_isready not available. Installing postgresql-client..."
            sudo apt-get install -y postgresql-client
        fi
    else
        log_warn "⚠️ DATABASE_URL not set in .env"
    fi
fi

log_step "4. FIXING PM2 SETUP"
echo "==================="

# Stop existing PM2 process
pm2 delete $APP_NAME 2>/dev/null || log_info "No existing PM2 process to delete"

# Start PM2 process
log_info "Starting PM2 process..."
pm2 start ecosystem.config.js --env production

# Save PM2 configuration
pm2 save

# Setup PM2 startup
pm2 startup | grep -E '^sudo' | bash || log_info "PM2 startup already configured"

# Wait for application to start
log_info "Waiting for application to start..."
sleep 10

# Check PM2 status
if pm2 list | grep -q "$APP_NAME.*online"; then
    log_info "✅ PM2 process is running"
else
    log_error "❌ PM2 process failed to start"
    pm2 logs $APP_NAME --lines 20
    exit 1
fi

log_step "5. FIXING NGINX SETUP"
echo "====================="

# Copy Nginx configuration
if [ -f "nginx.conf" ]; then
    log_info "Setting up Nginx configuration..."
    sudo cp nginx.conf /etc/nginx/sites-available/$APP_NAME
    sudo ln -sf /etc/nginx/sites-available/$APP_NAME /etc/nginx/sites-enabled/
    sudo rm -f /etc/nginx/sites-enabled/default
else
    log_info "Creating basic Nginx configuration..."
    sudo tee /etc/nginx/sites-available/$APP_NAME > /dev/null <<EOF
server {
    listen 80;
    server_name _;
    
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_cache_bypass \$http_upgrade;
    }
    
    location /health {
        proxy_pass http://localhost:3000/health;
        access_log off;
    }
}
EOF
    sudo ln -sf /etc/nginx/sites-available/$APP_NAME /etc/nginx/sites-enabled/
    sudo rm -f /etc/nginx/sites-enabled/default
fi

# Test Nginx configuration
if sudo nginx -t; then
    log_info "✅ Nginx configuration is valid"
    
    # Start/restart Nginx
    sudo systemctl enable nginx
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
fi

log_step "6. FIXING FIREWALL"
echo "=================="

# Configure UFW firewall
if command -v ufw &> /dev/null; then
    log_info "Configuring firewall..."
    sudo ufw allow 22/tcp   # SSH
    sudo ufw allow 80/tcp   # HTTP
    sudo ufw allow 443/tcp  # HTTPS
    sudo ufw --force enable
else
    log_warn "⚠️ UFW not available. Please ensure ports 22, 80, 443 are open"
fi

log_step "7. HEALTH CHECKS"
echo "================"

# Wait for services to stabilize
sleep 5

# Check local health endpoint
log_info "Testing local health endpoint..."
if curl -f http://localhost:3000/health &> /dev/null; then
    log_info "✅ Local health check passed"
    
    # Show health response
    echo "Health response:"
    curl -s http://localhost:3000/health | jq . || curl -s http://localhost:3000/health
else
    log_error "❌ Local health check failed"
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

# Check what's listening on ports
log_info "Checking port usage..."
if command -v netstat &> /dev/null; then
    echo "Port 3000 (Application):"
    netstat -tlnp | grep ":3000" || echo "Nothing listening on port 3000"
    echo "Port 80 (HTTP):"
    netstat -tlnp | grep ":80" || echo "Nothing listening on port 80"
    echo "Port 443 (HTTPS):"
    netstat -tlnp | grep ":443" || echo "Nothing listening on port 443"
fi

log_step "8. FINAL STATUS"
echo "==============="

echo ""
echo "🎯 DEPLOYMENT STATUS:"
echo "===================="

# PM2 Status
echo "PM2 Process:"
pm2 list | grep $APP_NAME || echo "PM2 process not found"

# Service Status
echo ""
echo "System Services:"
echo "- Nginx: $(systemctl is-active nginx)"
echo "- Application: $(curl -s -o /dev/null -w "%{http_code}" http://localhost:3000/health 2>/dev/null || echo "Not responding")"

# URLs to test
echo ""
echo "🌐 TEST THESE URLS:"
echo "=================="
echo "- Local health: http://localhost:3000/health"
echo "- Nginx proxy: http://localhost/health"
echo "- Application: http://localhost/"

# Get server IP
SERVER_IP=$(curl -s ifconfig.me 2>/dev/null || curl -s ipinfo.io/ip 2>/dev/null || echo "unknown")
if [ "$SERVER_IP" != "unknown" ]; then
    echo "- External: http://$SERVER_IP/"
    echo "- External health: http://$SERVER_IP/health"
fi

echo ""
echo "📋 NEXT STEPS:"
echo "=============="
echo "1. Test the URLs above"
echo "2. If external URLs don't work, check:"
echo "   - Domain DNS settings"
echo "   - Firewall configuration"
echo "   - VPS provider firewall"
echo "3. For HTTPS, run: sudo certbot --nginx"
echo "4. Monitor logs: pm2 logs $APP_NAME"

echo ""
if curl -f http://localhost:3000/health &> /dev/null; then
    log_info "🎉 DEPLOYMENT FIX COMPLETED SUCCESSFULLY!"
    echo "Your application should now be accessible."
else
    log_warn "⚠️ DEPLOYMENT FIX COMPLETED WITH WARNINGS"
    echo "Please check the logs and test the URLs above."
fi
#!/bin/bash
set -e

# OLA Laundry Master - Namecheap Deployment Script
# This script deploys the application to Namecheap VPS

# Configuration
SERVER_IP="${1:-your-server-ip}"
SERVER_USER="${2:-your-username}"
SSH_KEY="${3:-~/.ssh/id_rsa}"
DOMAIN="${4:-www.olalaundry.com}"

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

# Validate parameters
if [ "$SERVER_IP" = "your-server-ip" ]; then
    log_error "Please provide server IP address"
    echo "Usage: $0 <server-ip> <username> [ssh-key] [domain]"
    echo "Example: $0 159.198.32.97 root ~/.ssh/id_rsa www.olalaundry.com"
    exit 1
fi

if [ "$SERVER_USER" = "your-username" ]; then
    log_error "Please provide server username"
    echo "Usage: $0 <server-ip> <username> [ssh-key] [domain]"
    exit 1
fi

echo "🚀 OLA LAUNDRY MASTER - NAMECHEAP DEPLOYMENT"
echo "============================================="
echo "Server: $SERVER_IP"
echo "User: $SERVER_USER"
echo "Domain: $DOMAIN"
echo "SSH Key: $SSH_KEY"
echo ""

# Test SSH connection
log_step "Testing SSH connection..."
if ! ssh -i "$SSH_KEY" -o ConnectTimeout=10 -o BatchMode=yes "$SERVER_USER@$SERVER_IP" "echo 'SSH connection successful'" 2>/dev/null; then
    log_error "SSH connection failed. Please check:"
    echo "1. Server IP address: $SERVER_IP"
    echo "2. Username: $SERVER_USER"
    echo "3. SSH key path: $SSH_KEY"
    echo "4. SSH key permissions (should be 600)"
    echo "5. Server SSH service is running"
    exit 1
fi

log_info "SSH connection successful"

# Deploy to server
log_step "Deploying to Namecheap VPS..."

ssh -i "$SSH_KEY" "$SERVER_USER@$SERVER_IP" << 'ENDSSH'
set -e

# Configuration
APP_DIR="/var/www/olalaundry"
APP_NAME="olalaundry"
BACKUP_DIR="/var/backups/olalaundry"
LOG_DIR="/var/log/olalaundry"

echo "🔧 Setting up environment..."

# Install system dependencies
if ! command -v node &> /dev/null; then
    echo "📦 Installing Node.js..."
    curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
    sudo apt-get install -y nodejs
fi

if ! command -v pm2 &> /dev/null; then
    echo "📦 Installing PM2..."
    sudo npm install -g pm2
fi

if ! command -v nginx &> /dev/null; then
    echo "📦 Installing Nginx..."
    sudo apt-get update
    sudo apt-get install -y nginx
fi

# Install additional dependencies
sudo apt-get install -y postgresql-client git build-essential jq

# Create directories
echo "📁 Creating directories..."
sudo mkdir -p $APP_DIR $LOG_DIR $BACKUP_DIR
sudo chown -R $USER:$USER $APP_DIR $LOG_DIR $BACKUP_DIR

# Backup existing deployment
if [ -d "$APP_DIR" ] && [ -d "$APP_DIR/.git" ]; then
    echo "💾 Creating backup..."
    tar -czf $BACKUP_DIR/backup_$(date +%Y%m%d_%H%M%S).tar.gz -C $APP_DIR . 2>/dev/null || echo "Backup creation failed"
fi

# Clone or update repository
if [ -d "$APP_DIR/.git" ]; then
    echo "🔄 Updating repository..."
    cd $APP_DIR
    git fetch origin
    git reset --hard origin/main
else
    echo "📥 Cloning repository..."
    git clone https://github.com/sajidabbas3156/Ola-laundry-master.git $APP_DIR
    cd $APP_DIR
fi

# Install dependencies
echo "📦 Installing dependencies..."
npm ci --production=false

# Build application
echo "🔨 Building application..."
npm run build

# Verify build
if [ ! -d "dist" ] || [ ! -f "dist/index.js" ]; then
    echo "❌ Build verification failed"
    ls -la dist/ || echo "No dist directory"
    exit 1
fi

echo "✅ Build completed successfully"

# Setup environment
if [ ! -f ".env" ]; then
    echo "⚙️ Setting up environment..."
    cp .env.production .env
    echo "⚠️ IMPORTANT: Edit .env with production values"
    echo "Database URL, JWT Secret, CORS Origin, etc."
fi

# Database operations
if [ -f ".env" ] && grep -q "DATABASE_URL" .env; then
    echo "🗄️ Setting up database..."
    source .env
    
    # Backup existing database
    if pg_isready -d "$DATABASE_URL" 2>/dev/null; then
        echo "💾 Backing up database..."
        pg_dump $DATABASE_URL > $BACKUP_DIR/db_backup_$(date +%Y%m%d_%H%M%S).sql 2>/dev/null || echo "Database backup failed"
    fi
    
    # Run migrations
    echo "🔄 Running database migrations..."
    npm run db:push
fi

# Setup PM2
echo "🚀 Setting up PM2..."
pm2 delete $APP_NAME 2>/dev/null || echo "No existing PM2 process"
pm2 start ecosystem.config.js --env production
pm2 save

# Setup PM2 startup
if ! pm2 startup | grep -q "already"; then
    pm2 startup
fi

# Setup Nginx
echo "🌐 Setting up Nginx..."
if [ -f "nginx.conf" ]; then
    sudo cp nginx.conf /etc/nginx/sites-available/$APP_NAME
    sudo ln -sf /etc/nginx/sites-available/$APP_NAME /etc/nginx/sites-enabled/
    sudo rm -f /etc/nginx/sites-enabled/default
    
    # Test Nginx configuration
    if sudo nginx -t; then
        sudo systemctl reload nginx
        echo "✅ Nginx configured successfully"
    else
        echo "❌ Nginx configuration failed"
    fi
fi

# Setup SSL (Let's Encrypt)
if command -v certbot &> /dev/null; then
    echo "🔒 SSL certificate already available"
else
    echo "🔒 Setting up SSL certificate..."
    sudo apt-get install -y certbot python3-certbot-nginx
    sudo certbot --nginx -d www.olalaundry.com --non-interactive --agree-tos --email admin@olalaundry.com || echo "SSL setup failed"
fi

# Health check
echo "🏥 Performing health check..."
sleep 10

# Check PM2 status
if pm2 status | grep -q $APP_NAME; then
    echo "✅ PM2 process running"
else
    echo "❌ PM2 process not running"
    pm2 logs $APP_NAME --lines 20
    exit 1
fi

# Check health endpoint
if curl -f http://localhost:3000/health > /dev/null 2>&1; then
    echo "✅ Local health check passed"
else
    echo "❌ Local health check failed"
    pm2 logs $APP_NAME --lines 20
    exit 1
fi

# Check domain health (if accessible)
if curl -f https://www.olalaundry.com/health > /dev/null 2>&1; then
    echo "✅ Domain health check passed"
else
    echo "⚠️ Domain health check failed (check DNS/SSL)"
fi

echo ""
echo "🎉 DEPLOYMENT COMPLETED SUCCESSFULLY!"
echo "====================================="
echo "Application: https://www.olalaundry.com"
echo "Health Check: https://www.olalaundry.com/health"
echo "AI Operations: https://www.olalaundry.com/tenant/ola-laundry/ai-operations"
echo ""
echo "Management Commands:"
echo "- Check status: pm2 status"
echo "- View logs: pm2 logs $APP_NAME"
echo "- Restart: pm2 restart $APP_NAME"
echo "- Stop: pm2 stop $APP_NAME"
echo ""
echo "Next Steps:"
echo "1. Verify application is working"
echo "2. Test critical user journeys"
echo "3. Monitor logs for errors"
echo "4. Setup monitoring alerts"

ENDSSH

# Run smoke tests from local machine
log_step "Running smoke tests..."
if ssh -i "$SSH_KEY" "$SERVER_USER@$SERVER_IP" "cd /var/www/olalaundry && [ -f scripts/smoke-test.sh ] && ./scripts/smoke-test.sh https://$DOMAIN"; then
    log_info "✅ Smoke tests passed"
else
    log_warn "⚠️ Some smoke tests failed - check manually"
fi

echo ""
echo "🎉 NAMECHEAP DEPLOYMENT COMPLETE!"
echo "================================="
echo "🌐 Application: https://$DOMAIN"
echo "🏥 Health Check: https://$DOMAIN/health"
echo "🤖 AI Operations: https://$DOMAIN/tenant/ola-laundry/ai-operations"
echo ""
echo "📊 To monitor the application:"
echo "ssh -i $SSH_KEY $SERVER_USER@$SERVER_IP"
echo "pm2 status"
echo "pm2 logs olalaundry"
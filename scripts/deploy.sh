#!/bin/bash
set -e

echo "=== OLA LAUNDRY MASTER DEPLOYMENT ==="

# Configuration
APP_NAME="olalaundry"
APP_DIR="/var/www/olalaundry"
LOG_DIR="/var/log/olalaundry"
BACKUP_DIR="/var/backups/olalaundry"
DOMAIN="www.olalaundry.com"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

log_info() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

log_warn() {
    echo -e "${YELLOW}[WARN]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if running as root
if [[ $EUID -eq 0 ]]; then
   log_error "This script should not be run as root for security reasons"
   exit 1
fi

# Create directories
log_info "Creating directories..."
sudo mkdir -p $APP_DIR $LOG_DIR $BACKUP_DIR
sudo chown -R $USER:$USER $APP_DIR $LOG_DIR $BACKUP_DIR

# Install system dependencies
log_info "Installing system dependencies..."
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get update
sudo apt-get install -y nodejs nginx postgresql-client git build-essential

# Install PM2 globally
log_info "Installing PM2..."
sudo npm install -g pm2

# Clone or update repository
if [ -d "$APP_DIR/.git" ]; then
    log_info "Updating existing repository..."
    cd $APP_DIR
    git fetch origin
    git reset --hard origin/main
else
    log_info "Cloning repository..."
    git clone https://github.com/sajidabbas3156/Ola-laundry-master.git $APP_DIR
    cd $APP_DIR
fi

# Install dependencies
log_info "Installing dependencies..."
npm ci --production=false

# Build application
log_info "Building application..."
npm run build

# Verify build
if [ ! -d "dist" ]; then
    log_error "Build failed - no dist/ directory found"
    exit 1
fi

log_info "Build completed successfully"

# Setup environment
if [ ! -f ".env" ]; then
    log_warn "No .env file found. Please create one before continuing."
    cp .env.production .env
    log_info "Created .env from .env.production template"
    log_warn "IMPORTANT: Edit .env with your production values before continuing"
    read -p "Press Enter after editing .env..."
fi

# Database backup (if exists)
log_info "Creating database backup..."
if [ ! -z "$DATABASE_URL" ]; then
    pg_dump $DATABASE_URL > $BACKUP_DIR/backup_$(date +%Y%m%d_%H%M%S).sql 2>/dev/null || log_warn "No existing database to backup"
fi

# Run database migrations
log_info "Running database migrations..."
npm run db:push

# Setup PM2
log_info "Setting up PM2..."
pm2 delete $APP_NAME 2>/dev/null || log_info "No existing PM2 process to delete"
pm2 start ecosystem.config.js --env production
pm2 save
pm2 startup

# Setup Nginx
log_info "Setting up Nginx..."
sudo cp nginx.conf /etc/nginx/sites-available/$APP_NAME
sudo ln -sf /etc/nginx/sites-available/$APP_NAME /etc/nginx/sites-enabled/
sudo rm -f /etc/nginx/sites-enabled/default

# Test Nginx configuration
sudo nginx -t
if [ $? -ne 0 ]; then
    log_error "Nginx configuration test failed"
    exit 1
fi

sudo systemctl reload nginx

# Setup SSL with Let's Encrypt
log_info "Setting up SSL certificate..."
sudo apt-get install -y certbot python3-certbot-nginx
sudo certbot --nginx -d $DOMAIN --non-interactive --agree-tos --email admin@$DOMAIN || log_warn "SSL setup failed - continuing without SSL"

# Setup log rotation
log_info "Setting up log rotation..."
sudo tee /etc/logrotate.d/$APP_NAME > /dev/null <<EOF
$LOG_DIR/*.log {
    daily
    missingok
    rotate 52
    compress
    delaycompress
    notifempty
    create 644 $USER $USER
    postrotate
        pm2 reloadLogs
    endscript
}
EOF

# Health check
log_info "Performing health checks..."
sleep 10

# Check PM2 status
pm2 status | grep -q $APP_NAME || {
    log_error "PM2 process not running"
    pm2 logs $APP_NAME --lines 20
    exit 1
}

# Check local health endpoint
curl -f http://localhost:3000/health > /dev/null || {
    log_error "Local health check failed"
    pm2 logs $APP_NAME --lines 20
    exit 1
}

# Check domain health endpoint (if SSL is setup)
if curl -f https://$DOMAIN/health > /dev/null 2>&1; then
    log_info "Domain health check passed"
else
    log_warn "Domain health check failed - check DNS and SSL configuration"
fi

# Setup monitoring cron job
log_info "Setting up monitoring..."
(crontab -l 2>/dev/null; echo "*/5 * * * * curl -f https://$DOMAIN/health || echo 'Health check failed' | mail -s 'OLA Laundry Down' admin@$DOMAIN") | crontab -

log_info "=== DEPLOYMENT COMPLETED SUCCESSFULLY ==="
log_info "Application: https://$DOMAIN"
log_info "Health Check: https://$DOMAIN/health"
log_info "PM2 Status: pm2 status"
log_info "Logs: pm2 logs $APP_NAME"

echo ""
log_info "Next steps:"
echo "1. Verify the application is working at https://$DOMAIN"
echo "2. Test critical user journeys"
echo "3. Monitor logs for any errors"
echo "4. Setup additional monitoring as needed"
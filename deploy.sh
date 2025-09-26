#!/bin/bash

# OLA Laundry Master - Production Deployment Script
# For AlmaLinux VPS: 159.198.32.97
# Domain: www.olalaundry.com

set -e

echo "🚀 Starting OLA Laundry Master deployment..."

# Configuration
SERVER_IP="159.198.32.97"
SERVER_USER="root"
DOMAIN="www.olalaundry.com"
APP_DIR="/var/www/olalaundry"
SERVICE_NAME="olalaundry"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

print_status() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

# Check if we're running locally
if [[ $(hostname -I | grep -c "159.198.32.97") -eq 0 ]]; then
    echo "📦 Building application locally..."
    
    # Install dependencies
    print_status "Installing dependencies..."
    npm ci --production=false
    
    # Build the application
    print_status "Building application..."
    npm run build
    
    # Create deployment package
    print_status "Creating deployment package..."
    tar -czf olalaundry-deploy.tar.gz \
        dist/ \
        server/ \
        shared/ \
        migrations/ \
        package.json \
        package-lock.json \
        .env.production \
        database-setup.sql \
        ecosystem.config.js \
        nginx.conf
    
    print_status "Deployment package created: olalaundry-deploy.tar.gz"
    
    # Upload to server
    print_status "Uploading to server..."
    scp olalaundry-deploy.tar.gz root@${SERVER_IP}:/tmp/
    
    # Run deployment on server
    print_status "Running deployment on server..."
    ssh root@${SERVER_IP} "bash -s" < deploy-server.sh
    
    # Cleanup
    rm olalaundry-deploy.tar.gz
    
    print_status "🎉 Deployment completed successfully!"
    print_status "🌐 Your application is available at: https://${DOMAIN}"
    
else
    echo "🖥️  Running server-side deployment..."
    
    # Server-side deployment
    cd /tmp
    
    # Extract deployment package
    print_status "Extracting deployment package..."
    tar -xzf olalaundry-deploy.tar.gz
    
    # Create application directory
    print_status "Setting up application directory..."
    mkdir -p ${APP_DIR}
    
    # Copy files
    cp -r dist/ ${APP_DIR}/
    cp -r server/ ${APP_DIR}/
    cp -r shared/ ${APP_DIR}/
    cp -r migrations/ ${APP_DIR}/
    cp package*.json ${APP_DIR}/
    cp .env.production ${APP_DIR}/.env
    cp ecosystem.config.js ${APP_DIR}/
    
    # Set permissions
    chown -R root:root ${APP_DIR}
    chmod -R 755 ${APP_DIR}
    
    # Install Node.js dependencies
    cd ${APP_DIR}
    print_status "Installing production dependencies..."
    npm ci --production
    
    # Run database migrations
    print_status "Running database migrations..."
    npm run db:push || print_warning "Database migration failed - check manually"
    
    # Setup PM2 service
    print_status "Setting up PM2 service..."
    pm2 delete ${SERVICE_NAME} 2>/dev/null || true
    pm2 start ecosystem.config.js
    pm2 save
    
    # Setup Nginx
    print_status "Configuring Nginx..."
    cp nginx.conf /etc/nginx/sites-available/${DOMAIN}
    ln -sf /etc/nginx/sites-available/${DOMAIN} /etc/nginx/sites-enabled/
    nginx -t && systemctl reload nginx
    
    # Cleanup
    rm -rf /tmp/olalaundry-deploy.tar.gz
    
    print_status "Server deployment completed!"
fi
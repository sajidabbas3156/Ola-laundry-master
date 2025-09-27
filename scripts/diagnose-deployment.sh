#!/bin/bash

# OLA Laundry Master - Deployment Diagnostics Script
# This script helps diagnose common deployment issues

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

log_check() {
    echo -e "${BLUE}[CHECK]${NC} $1"
}

echo "🔍 OLA LAUNDRY MASTER - DEPLOYMENT DIAGNOSTICS"
echo "=============================================="

# Check if we're on the server
if [ -d "/var/www/olalaundry" ]; then
    APP_DIR="/var/www/olalaundry"
    log_info "Running diagnostics on server"
else
    log_error "Not running on server. Please run this script on your Namecheap VPS"
    echo "Usage: ssh root@your-vps-ip 'bash -s' < scripts/diagnose-deployment.sh"
    exit 1
fi

cd $APP_DIR

echo ""
log_check "1. CHECKING APPLICATION FILES"
echo "================================"

# Check if application exists
if [ -d "$APP_DIR" ]; then
    log_info "✅ Application directory exists: $APP_DIR"
else
    log_error "❌ Application directory missing: $APP_DIR"
    exit 1
fi

# Check if build exists
if [ -d "$APP_DIR/dist" ]; then
    log_info "✅ Build directory exists"
    if [ -f "$APP_DIR/dist/index.js" ]; then
        log_info "✅ Server build file exists"
    else
        log_error "❌ Server build file missing: dist/index.js"
    fi
    
    if [ -f "$APP_DIR/dist/public/index.html" ]; then
        log_info "✅ Client build file exists"
    else
        log_error "❌ Client build file missing: dist/public/index.html"
    fi
else
    log_error "❌ Build directory missing. Run: npm run build"
fi

# Check environment file
if [ -f "$APP_DIR/.env" ]; then
    log_info "✅ Environment file exists"
    
    # Check critical env vars
    source .env
    
    if [ -n "$DATABASE_URL" ]; then
        log_info "✅ DATABASE_URL is set"
    else
        log_error "❌ DATABASE_URL not set in .env"
    fi
    
    if [ -n "$JWT_SECRET" ]; then
        log_info "✅ JWT_SECRET is set"
    else
        log_error "❌ JWT_SECRET not set in .env"
    fi
    
    if [ -n "$PORT" ]; then
        log_info "✅ PORT is set to: $PORT"
    else
        log_warn "⚠️ PORT not set, using default 3000"
        PORT=3000
    fi
    
else
    log_error "❌ Environment file missing. Copy from .env.production"
fi

echo ""
log_check "2. CHECKING SYSTEM SERVICES"
echo "============================"

# Check Node.js
if command -v node &> /dev/null; then
    NODE_VERSION=$(node --version)
    log_info "✅ Node.js installed: $NODE_VERSION"
else
    log_error "❌ Node.js not installed"
fi

# Check PM2
if command -v pm2 &> /dev/null; then
    log_info "✅ PM2 installed"
    
    # Check PM2 processes
    if pm2 list | grep -q "olalaundry"; then
        log_info "✅ PM2 process exists"
        
        # Check if process is running
        if pm2 list | grep "olalaundry" | grep -q "online"; then
            log_info "✅ PM2 process is online"
        else
            log_error "❌ PM2 process is not online"
            echo "PM2 Status:"
            pm2 list
        fi
    else
        log_error "❌ PM2 process 'olalaundry' not found"
        echo "Available PM2 processes:"
        pm2 list
    fi
else
    log_error "❌ PM2 not installed"
fi

# Check Nginx
if command -v nginx &> /dev/null; then
    log_info "✅ Nginx installed"
    
    # Check if Nginx is running
    if systemctl is-active --quiet nginx; then
        log_info "✅ Nginx is running"
    else
        log_error "❌ Nginx is not running"
    fi
    
    # Check Nginx configuration
    if nginx -t &> /dev/null; then
        log_info "✅ Nginx configuration is valid"
    else
        log_error "❌ Nginx configuration has errors"
        nginx -t
    fi
else
    log_error "❌ Nginx not installed"
fi

echo ""
log_check "3. CHECKING NETWORK CONNECTIVITY"
echo "================================="

# Check if application responds locally
if curl -f http://localhost:${PORT:-3000}/health &> /dev/null; then
    log_info "✅ Application responds locally on port ${PORT:-3000}"
else
    log_error "❌ Application not responding locally on port ${PORT:-3000}"
    
    # Check what's listening on the port
    if command -v netstat &> /dev/null; then
        echo "Processes listening on port ${PORT:-3000}:"
        netstat -tlnp | grep ":${PORT:-3000}"
    fi
fi

# Check if port 80 is accessible
if curl -f http://localhost:80 &> /dev/null; then
    log_info "✅ Port 80 is accessible"
else
    log_error "❌ Port 80 not accessible"
fi

# Check if port 443 is accessible
if curl -f https://localhost:443 &> /dev/null; then
    log_info "✅ Port 443 (HTTPS) is accessible"
else
    log_warn "⚠️ Port 443 (HTTPS) not accessible - SSL may not be configured"
fi

echo ""
log_check "4. CHECKING DATABASE CONNECTION"
echo "==============================="

if [ -n "$DATABASE_URL" ]; then
    if command -v pg_isready &> /dev/null; then
        if pg_isready -d "$DATABASE_URL" &> /dev/null; then
            log_info "✅ Database connection successful"
        else
            log_error "❌ Database connection failed"
            echo "Database URL: $DATABASE_URL"
        fi
    else
        log_warn "⚠️ pg_isready not available, cannot test database connection"
    fi
else
    log_error "❌ DATABASE_URL not set"
fi

echo ""
log_check "5. CHECKING LOGS"
echo "================"

# Check PM2 logs
if command -v pm2 &> /dev/null && pm2 list | grep -q "olalaundry"; then
    echo "Recent PM2 logs:"
    pm2 logs olalaundry --lines 10 --nostream
else
    log_warn "⚠️ Cannot check PM2 logs - process not found"
fi

# Check system logs
if [ -f "/var/log/olalaundry/error.log" ]; then
    echo ""
    echo "Recent error logs:"
    tail -10 /var/log/olalaundry/error.log
fi

echo ""
log_check "6. QUICK FIXES"
echo "=============="

echo "Based on the diagnostics above, here are potential fixes:"
echo ""

# Suggest fixes based on common issues
if [ ! -f "$APP_DIR/.env" ]; then
    echo "🔧 Missing .env file:"
    echo "   cp .env.production .env"
    echo "   nano .env  # Edit with your values"
    echo ""
fi

if ! pm2 list | grep -q "olalaundry"; then
    echo "🔧 PM2 process not running:"
    echo "   pm2 start ecosystem.config.js --env production"
    echo "   pm2 save"
    echo ""
fi

if ! curl -f http://localhost:${PORT:-3000}/health &> /dev/null; then
    echo "🔧 Application not responding:"
    echo "   pm2 restart olalaundry"
    echo "   pm2 logs olalaundry"
    echo ""
fi

if ! systemctl is-active --quiet nginx; then
    echo "🔧 Nginx not running:"
    echo "   sudo systemctl start nginx"
    echo "   sudo systemctl enable nginx"
    echo ""
fi

echo "🔧 General troubleshooting commands:"
echo "   pm2 status                    # Check PM2 processes"
echo "   pm2 logs olalaundry          # View application logs"
echo "   pm2 restart olalaundry       # Restart application"
echo "   sudo systemctl status nginx  # Check Nginx status"
echo "   sudo nginx -t                # Test Nginx config"
echo "   curl http://localhost:3000/health  # Test local health"
echo ""

echo "📞 If issues persist:"
echo "   1. Check the full logs: pm2 logs olalaundry"
echo "   2. Verify environment variables in .env"
echo "   3. Ensure database is accessible"
echo "   4. Check firewall settings"
echo "   5. Verify domain DNS settings"
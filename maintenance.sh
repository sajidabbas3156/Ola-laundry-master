#!/bin/bash

# OLA Laundry Master - Maintenance Script
# Performs routine maintenance tasks

set -e

echo "🔧 Starting OLA Laundry Master maintenance..."

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

print_status() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

# System updates
print_status "Checking for system updates..."
dnf check-update > /dev/null 2>&1 || true

# Clean package cache
print_status "Cleaning package cache..."
dnf clean all

# Update Node.js packages (security updates only)
print_status "Checking for security updates..."
cd /var/www/olalaundry
npm audit fix --production || print_warning "Some security issues may require manual attention"

# Clean PM2 logs
print_status "Rotating PM2 logs..."
pm2 flush olalaundry

# Clean application logs
print_status "Cleaning old application logs..."
find /var/log/olalaundry -name "*.log" -mtime +7 -exec truncate -s 0 {} \;

# Database maintenance
print_status "Running database maintenance..."
PGPASSWORD="OLA_Secure_2024!@#" psql -h localhost -U ola_user -d ola_laundry_production -c "VACUUM ANALYZE;" > /dev/null

# Check disk space
print_status "Checking disk space..."
DISK_USAGE=$(df / | awk 'NR==2 {print $5}' | sed 's/%//')
if [ $DISK_USAGE -gt 80 ]; then
    print_warning "Disk usage is at ${DISK_USAGE}% - consider cleaning up"
fi

# Check memory usage
print_status "Checking memory usage..."
MEMORY_USAGE=$(free | awk 'NR==2{printf "%.0f", $3*100/$2}')
if [ $MEMORY_USAGE -gt 80 ]; then
    print_warning "Memory usage is at ${MEMORY_USAGE}% - consider restarting services"
fi

# Check SSL certificate expiration
print_status "Checking SSL certificate..."
CERT_DAYS=$(openssl x509 -in /etc/letsencrypt/live/www.olalaundry.com/cert.pem -noout -dates | grep notAfter | cut -d= -f2 | xargs -I {} date -d {} +%s)
CURRENT_DAYS=$(date +%s)
DAYS_LEFT=$(( ($CERT_DAYS - $CURRENT_DAYS) / 86400 ))

if [ $DAYS_LEFT -lt 30 ]; then
    print_warning "SSL certificate expires in $DAYS_LEFT days"
else
    print_status "SSL certificate valid for $DAYS_LEFT days"
fi

# Check service status
print_status "Checking service status..."
systemctl is-active --quiet nginx || print_warning "Nginx is not running"
systemctl is-active --quiet postgresql-15 || print_warning "PostgreSQL is not running"
systemctl is-active --quiet redis || print_warning "Redis is not running"
pm2 describe olalaundry > /dev/null || print_warning "OLA Laundry app is not running"

# Test application health
print_status "Testing application health..."
if curl -s -f http://localhost:3000/api/health > /dev/null; then
    print_status "Application health check passed"
else
    print_warning "Application health check failed"
fi

# Check for failed login attempts (security)
print_status "Checking security logs..."
FAILED_LOGINS=$(grep "authentication failure" /var/log/secure 2>/dev/null | wc -l || echo "0")
if [ $FAILED_LOGINS -gt 10 ]; then
    print_warning "Detected $FAILED_LOGINS failed login attempts"
fi

# Generate maintenance report
REPORT_FILE="/var/log/olalaundry/maintenance_$(date +%Y%m%d).log"
cat > $REPORT_FILE << EOF
OLA Laundry Master Maintenance Report
Date: $(date)
Server: $(hostname)
Uptime: $(uptime)
Disk Usage: ${DISK_USAGE}%
Memory Usage: ${MEMORY_USAGE}%
SSL Certificate: ${DAYS_LEFT} days remaining
Failed Logins: ${FAILED_LOGINS}
Application Status: $(pm2 describe olalaundry 2>/dev/null | grep status || echo "Unknown")
EOF

print_status "🎉 Maintenance completed successfully!"
print_status "📊 Report saved to: $REPORT_FILE"

# Log maintenance completion
echo "$(date): Maintenance completed successfully" >> /var/log/olalaundry/maintenance.log
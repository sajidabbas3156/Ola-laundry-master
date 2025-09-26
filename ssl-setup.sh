#!/bin/bash

# SSL Setup Script for OLA Laundry Master
# Domain: www.olalaundry.com
# Server: 159.198.32.97

set -e

echo "🔒 Setting up SSL certificate for www.olalaundry.com..."

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

print_status() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

DOMAIN="www.olalaundry.com"
EMAIL="admin@olalaundry.com"

# Check if running as root
if [[ $EUID -ne 0 ]]; then
   print_error "This script must be run as root"
   exit 1
fi

# Check if domain points to this server
print_status "Checking DNS configuration..."
SERVER_IP=$(curl -s ifconfig.me)
DOMAIN_IP=$(dig +short $DOMAIN)

if [[ "$DOMAIN_IP" != "$SERVER_IP" ]]; then
    print_warning "Domain $DOMAIN does not point to this server ($SERVER_IP)"
    print_warning "Current DNS points to: $DOMAIN_IP"
    print_warning "Please update your DNS records and try again"
    exit 1
fi

print_status "DNS configuration verified ✓"

# Stop nginx temporarily
print_status "Stopping Nginx temporarily..."
systemctl stop nginx

# Obtain SSL certificate
print_status "Obtaining SSL certificate from Let's Encrypt..."
certbot certonly \
    --standalone \
    --email $EMAIL \
    --agree-tos \
    --no-eff-email \
    --domains $DOMAIN,olalaundry.com

# Start nginx
print_status "Starting Nginx..."
systemctl start nginx

# Test nginx configuration
print_status "Testing Nginx configuration..."
nginx -t

if [[ $? -eq 0 ]]; then
    print_status "Nginx configuration is valid"
    systemctl reload nginx
else
    print_error "Nginx configuration has errors"
    exit 1
fi

# Setup auto-renewal
print_status "Setting up SSL certificate auto-renewal..."
(crontab -l 2>/dev/null; echo "0 12 * * * /usr/bin/certbot renew --quiet --post-hook 'systemctl reload nginx'") | crontab -

# Test SSL certificate
print_status "Testing SSL certificate..."
sleep 5

if curl -s -I https://$DOMAIN | grep -q "200 OK"; then
    print_status "✅ SSL certificate is working correctly!"
    print_status "🌐 Your site is now available at: https://$DOMAIN"
else
    print_warning "SSL test failed. Please check manually."
fi

# Display certificate information
print_status "Certificate information:"
certbot certificates

print_status "🎉 SSL setup completed successfully!"
echo ""
echo "Next steps:"
echo "1. Test your website: https://$DOMAIN"
echo "2. Check SSL rating: https://www.ssllabs.com/ssltest/analyze.html?d=$DOMAIN"
echo "3. Monitor certificate expiration (auto-renewal is configured)"
echo ""
print_status "Your OLA Laundry Master application is now secured with SSL!"
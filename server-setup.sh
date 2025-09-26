#!/bin/bash

# OLA Laundry Master - Server Setup Script for AlmaLinux VPS
# Run this script on your server: 159.198.32.97

set -e

echo "🔧 Setting up AlmaLinux VPS for OLA Laundry Master..."

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

# Update system
print_status "Updating system packages..."
dnf update -y

# Install EPEL repository
print_status "Installing EPEL repository..."
dnf install -y epel-release

# Install Node.js 20
print_status "Installing Node.js 20..."
dnf module install -y nodejs:20/common
node --version
npm --version

# Install PostgreSQL 15
print_status "Installing PostgreSQL 15..."
dnf install -y postgresql15-server postgresql15
postgresql-15-setup initdb
systemctl enable postgresql-15
systemctl start postgresql-15

# Install Nginx
print_status "Installing Nginx..."
dnf install -y nginx
systemctl enable nginx
systemctl start nginx

# Install PM2 globally
print_status "Installing PM2..."
npm install -g pm2

# Setup PM2 startup
pm2 startup systemd -u root --hp /root
systemctl enable pm2-root

# Install Redis (for sessions and caching)
print_status "Installing Redis..."
dnf install -y redis
systemctl enable redis
systemctl start redis

# Install Certbot for SSL
print_status "Installing Certbot for SSL..."
dnf install -y certbot python3-certbot-nginx

# Create application directory
print_status "Creating application directory..."
mkdir -p /var/www/olalaundry
mkdir -p /var/log/olalaundry

# Setup firewall
print_status "Configuring firewall..."
firewall-cmd --permanent --add-service=http
firewall-cmd --permanent --add-service=https
firewall-cmd --permanent --add-port=3000/tcp
firewall-cmd --reload

# Configure PostgreSQL
print_status "Configuring PostgreSQL..."
sudo -u postgres psql -c "ALTER USER postgres PASSWORD 'PostgresAdmin2024!';"

# Create database and user (run the SQL file later)
print_warning "Remember to run database-setup.sql after deployment"

# Setup log rotation
print_status "Setting up log rotation..."
cat > /etc/logrotate.d/olalaundry << EOF
/var/log/olalaundry/*.log {
    daily
    missingok
    rotate 52
    compress
    delaycompress
    notifempty
    create 644 root root
    postrotate
        pm2 reload olalaundry
    endscript
}
EOF

# Create systemd service for backup
print_status "Creating backup service..."
cat > /etc/systemd/system/olalaundry-backup.service << EOF
[Unit]
Description=OLA Laundry Database Backup
After=postgresql-15.service

[Service]
Type=oneshot
User=postgres
ExecStart=/usr/bin/pg_dump -h localhost -U ola_user ola_laundry_production > /var/backups/olalaundry-\$(date +\%Y\%m\%d-\%H\%M\%S).sql
EOF

cat > /etc/systemd/system/olalaundry-backup.timer << EOF
[Unit]
Description=Run OLA Laundry backup daily
Requires=olalaundry-backup.service

[Timer]
OnCalendar=daily
Persistent=true

[Install]
WantedBy=timers.target
EOF

# Create backup directory
mkdir -p /var/backups
chown postgres:postgres /var/backups

# Enable backup timer
systemctl enable olalaundry-backup.timer
systemctl start olalaundry-backup.timer

print_status "🎉 Server setup completed!"
print_status "Next steps:"
echo "1. Run database-setup.sql in PostgreSQL"
echo "2. Deploy your application using deploy.sh"
echo "3. Setup SSL certificate with: certbot --nginx -d www.olalaundry.com"
echo "4. Test your application"

print_status "Server is ready for OLA Laundry Master deployment!"
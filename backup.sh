#!/bin/bash

# OLA Laundry Master - Backup Script
# Creates full backup of database and application files

set -e

# Configuration
BACKUP_DIR="/var/backups/olalaundry"
APP_DIR="/var/www/olalaundry"
DB_NAME="ola_laundry_production"
DB_USER="ola_user"
RETENTION_DAYS=30

# Create backup directory
mkdir -p $BACKUP_DIR

# Generate timestamp
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
BACKUP_FILE="olalaundry_backup_$TIMESTAMP"

echo "🔄 Starting OLA Laundry Master backup..."

# Database backup
echo "📊 Backing up database..."
PGPASSWORD="OLA_Secure_2024!@#" pg_dump -h localhost -U $DB_USER $DB_NAME > "$BACKUP_DIR/${BACKUP_FILE}_database.sql"

# Application files backup
echo "📁 Backing up application files..."
tar -czf "$BACKUP_DIR/${BACKUP_FILE}_files.tar.gz" \
    -C /var/www \
    --exclude='node_modules' \
    --exclude='*.log' \
    --exclude='.git' \
    olalaundry/

# Environment backup
echo "⚙️  Backing up configuration..."
cp /var/www/olalaundry/.env "$BACKUP_DIR/${BACKUP_FILE}_env.backup"

# Nginx configuration backup
cp /etc/nginx/sites-available/www.olalaundry.com "$BACKUP_DIR/${BACKUP_FILE}_nginx.conf"

# PM2 configuration backup
cp /var/www/olalaundry/ecosystem.config.js "$BACKUP_DIR/${BACKUP_FILE}_pm2.config.js"

# Create backup manifest
cat > "$BACKUP_DIR/${BACKUP_FILE}_manifest.txt" << EOF
OLA Laundry Master Backup Manifest
Created: $(date)
Server: $(hostname)
Database: $DB_NAME
Files: ${BACKUP_FILE}_files.tar.gz
Database: ${BACKUP_FILE}_database.sql
Environment: ${BACKUP_FILE}_env.backup
Nginx Config: ${BACKUP_FILE}_nginx.conf
PM2 Config: ${BACKUP_FILE}_pm2.config.js
EOF

# Compress all backup files
echo "🗜️  Compressing backup..."
tar -czf "$BACKUP_DIR/${BACKUP_FILE}_complete.tar.gz" \
    -C $BACKUP_DIR \
    "${BACKUP_FILE}_database.sql" \
    "${BACKUP_FILE}_files.tar.gz" \
    "${BACKUP_FILE}_env.backup" \
    "${BACKUP_FILE}_nginx.conf" \
    "${BACKUP_FILE}_pm2.config.js" \
    "${BACKUP_FILE}_manifest.txt"

# Remove individual files (keep only compressed)
rm "$BACKUP_DIR/${BACKUP_FILE}_database.sql" \
   "$BACKUP_DIR/${BACKUP_FILE}_files.tar.gz" \
   "$BACKUP_DIR/${BACKUP_FILE}_env.backup" \
   "$BACKUP_DIR/${BACKUP_FILE}_nginx.conf" \
   "$BACKUP_DIR/${BACKUP_FILE}_pm2.config.js" \
   "$BACKUP_DIR/${BACKUP_FILE}_manifest.txt"

# Set permissions
chmod 600 "$BACKUP_DIR/${BACKUP_FILE}_complete.tar.gz"

# Clean old backups
echo "🧹 Cleaning old backups (older than $RETENTION_DAYS days)..."
find $BACKUP_DIR -name "olalaundry_backup_*.tar.gz" -mtime +$RETENTION_DAYS -delete

# Display backup info
BACKUP_SIZE=$(du -h "$BACKUP_DIR/${BACKUP_FILE}_complete.tar.gz" | cut -f1)
echo "✅ Backup completed successfully!"
echo "📦 Backup file: ${BACKUP_FILE}_complete.tar.gz"
echo "📏 Backup size: $BACKUP_SIZE"
echo "📍 Location: $BACKUP_DIR"

# Log backup
echo "$(date): Backup completed - ${BACKUP_FILE}_complete.tar.gz ($BACKUP_SIZE)" >> /var/log/olalaundry/backup.log
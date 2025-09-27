#!/bin/bash
set -e

# Configuration
APP_NAME="olalaundry"
APP_DIR="/var/www/olalaundry"
BACKUP_DIR="/var/backups/olalaundry"

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
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

# Check if running as correct user
if [[ $EUID -eq 0 ]]; then
   log_error "This script should not be run as root"
   exit 1
fi

echo "=== EMERGENCY ROLLBACK PROCEDURE ==="

# Quick rollback (restart current version)
if [ "$1" = "quick" ]; then
    log_info "Performing quick rollback (restart only)..."
    pm2 restart $APP_NAME
    sleep 5
    
    # Health check
    if curl -f http://localhost:3000/health > /dev/null 2>&1; then
        log_info "Quick rollback successful"
        exit 0
    else
        log_error "Quick rollback failed - proceeding with full rollback"
    fi
fi

# Full rollback procedure
log_warn "Performing FULL ROLLBACK - this will revert to previous version"
read -p "Are you sure? (y/N): " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    log_info "Rollback cancelled"
    exit 0
fi

cd $APP_DIR

# Stop current application
log_info "Stopping current application..."
pm2 stop $APP_NAME

# Get current commit for potential recovery
CURRENT_COMMIT=$(git rev-parse HEAD)
log_info "Current commit: $CURRENT_COMMIT"

# Rollback to previous commit
log_info "Rolling back to previous version..."
git checkout HEAD~1

# Backup current database
log_info "Backing up current database..."
if [ ! -z "$DATABASE_URL" ]; then
    pg_dump $DATABASE_URL > $BACKUP_DIR/rollback_backup_$(date +%Y%m%d_%H%M%S).sql 2>/dev/null || log_warn "Database backup failed"
fi

# Restore previous database backup if requested
if [ "$2" = "with-db" ]; then
    log_warn "Database rollback requested"
    LATEST_BACKUP=$(ls -t $BACKUP_DIR/backup_*.sql 2>/dev/null | head -1)
    
    if [ -n "$LATEST_BACKUP" ]; then
        log_info "Restoring database from: $LATEST_BACKUP"
        read -p "This will overwrite current database. Continue? (y/N): " -n 1 -r
        echo
        if [[ $REPLY =~ ^[Yy]$ ]]; then
            psql $DATABASE_URL < $LATEST_BACKUP
            log_info "Database restored"
        else
            log_info "Database rollback skipped"
        fi
    else
        log_warn "No database backup found"
    fi
fi

# Reinstall dependencies and rebuild
log_info "Installing dependencies..."
npm ci --production

log_info "Building application..."
npm run build

# Verify build
if [ ! -d "dist" ]; then
    log_error "Build failed after rollback"
    log_info "Attempting to restore to current version..."
    git checkout $CURRENT_COMMIT
    npm ci --production
    npm run build
    
    if [ ! -d "dist" ]; then
        log_error "Critical failure - manual intervention required"
        exit 1
    fi
fi

# Restart application
log_info "Starting application..."
pm2 start $APP_NAME

# Wait for startup
sleep 10

# Health check
log_info "Performing health check..."
if curl -f http://localhost:3000/health > /dev/null 2>&1; then
    log_info "✅ Rollback completed successfully"
    
    # Show status
    pm2 status
    
    # Show current version
    ROLLED_BACK_COMMIT=$(git rev-parse HEAD)
    log_info "Rolled back to commit: $ROLLED_BACK_COMMIT"
    
    echo ""
    log_info "Rollback completed. Monitor the application closely."
    log_info "If issues persist, check logs: pm2 logs $APP_NAME"
    
else
    log_error "❌ Rollback failed - application not responding"
    log_info "Check logs: pm2 logs $APP_NAME"
    exit 1
fi

echo ""
log_warn "IMPORTANT: Investigate the root cause of the issue that required rollback"
log_warn "Consider implementing additional monitoring and testing"
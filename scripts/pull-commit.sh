#!/bin/bash
set -e

# Pull Commit Script for OLA Laundry Master
# Safely pulls and integrates commits while maintaining rollback capability

# Configuration
APP_NAME="olalaundry"
APP_DIR="/var/www/olalaundry"
BACKUP_DIR="/var/backups/olalaundry"

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

log_debug() {
    echo -e "${BLUE}[DEBUG]${NC} $1"
}

# Function to create backup before pulling changes
create_backup() {
    local backup_name="backup_$(date +%Y%m%d_%H%M%S)"
    log_info "Creating backup: $backup_name"
    
    # Try to create backup directory, fallback to local if permission denied
    if ! mkdir -p "$BACKUP_DIR" 2>/dev/null; then
        log_warn "Cannot create $BACKUP_DIR, using local backup directory"
        BACKUP_DIR="./backups"
        mkdir -p "$BACKUP_DIR"
    fi
    
    # Get current commit for backup reference
    local current_commit=$(git rev-parse HEAD)
    log_debug "Current commit: $current_commit"
    
    # Create backup file with commit info
    echo "BACKUP_COMMIT=$current_commit" > "$BACKUP_DIR/$backup_name.info"
    echo "BACKUP_DATE=$(date)" >> "$BACKUP_DIR/$backup_name.info"
    echo "BACKUP_BRANCH=$(git branch --show-current)" >> "$BACKUP_DIR/$backup_name.info"
    
    log_info "Backup created successfully at: $BACKUP_DIR/$backup_name.info"
    echo "$backup_name"
}

# Function to check if we can safely pull
check_pull_safety() {
    log_info "Checking pull safety..."
    
    # Check if working directory is clean
    if ! git diff --quiet; then
        log_error "Working directory has uncommitted changes"
        log_warn "Please commit or stash your changes before pulling"
        git status --porcelain
        return 1
    fi
    
    # Check if we're behind remote
    git fetch --quiet
    local behind=$(git rev-list --count HEAD..@{u} 2>/dev/null || echo "0")
    
    if [ "$behind" -eq 0 ]; then
        log_info "Already up to date with remote"
        return 2
    fi
    
    log_info "Found $behind commits to pull"
    return 0
}

# Function to perform safe pull
safe_pull() {
    local strategy=${1:-"merge"}
    
    log_info "Performing safe pull with strategy: $strategy"
    
    case $strategy in
        "merge")
            git pull --no-edit
            ;;
        "rebase")
            git pull --rebase
            ;;
        "fast-forward")
            git pull --ff-only
            ;;
        *)
            log_error "Unknown pull strategy: $strategy"
            return 1
            ;;
    esac
}

# Function to test build after pull
test_build() {
    log_info "Testing build after pull..."
    
    # Install/update dependencies (include dev dependencies for build)
    log_info "Installing dependencies..."
    npm ci
    
    # Run build
    log_info "Building application..."
    if npm run build; then
        # Check if build artifacts exist
        if [ ! -d "dist" ]; then
            log_error "Build failed - dist directory not found"
            return 1
        fi
        log_info "Build successful"
        return 0
    else
        log_warn "Build command failed - this may be due to existing code issues"
        log_warn "Note: Build failures may be related to duplicate functions mentioned in ROLLBACK_DOCUMENTATION.md"
        log_warn "Consider using --skip-build flag if build issues are unrelated to your pull"
        return 1
    fi
}

# Function to restart application
restart_application() {
    log_info "Restarting application..."
    
    # Check if PM2 is managing the app
    if pm2 list | grep -q "$APP_NAME"; then
        pm2 restart "$APP_NAME"
        sleep 5
        
        # Health check
        if curl -f http://localhost:3000/health > /dev/null 2>&1; then
            log_info "Application restarted successfully"
            return 0
        else
            log_error "Health check failed after restart"
            return 1
        fi
    else
        log_warn "PM2 process not found, application may need manual start"
        return 0
    fi
}

# Function to rollback if pull fails
rollback_pull() {
    local backup_name=$1
    local backup_dir=${2:-$BACKUP_DIR}
    
    log_warn "Rolling back due to pull failure..."
    
    if [ -f "$backup_dir/$backup_name.info" ]; then
        local backup_commit=$(grep "BACKUP_COMMIT=" "$backup_dir/$backup_name.info" | cut -d'=' -f2)
        
        log_info "Rolling back to commit: $backup_commit"
        git reset --hard "$backup_commit"
        
        # Restart application
        restart_application
        
        log_info "Rollback completed"
    else
        log_error "Backup info not found at $backup_dir/$backup_name.info, manual rollback required"
        return 1
    fi
}

# Main execution
main() {
    echo "=== OLA LAUNDRY MASTER - PULL COMMIT ==="
    
    local pull_strategy="merge"
    local skip_build=false
    local skip_restart=false
    
    # Parse command line arguments
    while [[ $# -gt 0 ]]; do
        case $1 in
            --strategy)
                pull_strategy="$2"
                shift 2
                ;;
            --skip-build)
                skip_build=true
                shift
                ;;
            --skip-restart)
                skip_restart=true
                shift
                ;;
            --help)
                echo "Usage: $0 [OPTIONS]"
                echo "Options:"
                echo "  --strategy STRATEGY    Pull strategy: merge, rebase, fast-forward (default: merge)"
                echo "  --skip-build          Skip build testing"
                echo "  --skip-restart        Skip application restart"
                echo "  --help                Show this help"
                exit 0
                ;;
            *)
                log_error "Unknown option: $1"
                exit 1
                ;;
        esac
    done
    
    # Change to app directory if specified and exists
    if [ -d "$APP_DIR" ] && [ "$(pwd)" != "$APP_DIR" ]; then
        log_info "Changing to app directory: $APP_DIR"
        cd "$APP_DIR"
    fi
    
    # Check if we're in a git repository
    if ! git rev-parse --git-dir > /dev/null 2>&1; then
        log_error "Not in a git repository"
        exit 1
    fi
    
    # Check pull safety
    case $(check_pull_safety; echo $?) in
        0)
            # Can pull
            ;;
        1)
            # Unsafe to pull
            exit 1
            ;;
        2)
            # Already up to date
            log_info "Nothing to pull"
            exit 0
            ;;
    esac
    
    # Create backup
    backup_result=$(create_backup)
    backup_name=${backup_result}
    
    # Store the actual backup directory used
    if [ -f "./backups/$backup_name.info" ]; then
        actual_backup_dir="./backups"
    else
        actual_backup_dir="$BACKUP_DIR"
    fi
    
    # Perform pull
    if ! safe_pull "$pull_strategy"; then
        log_error "Pull failed"
        rollback_pull "$backup_name" "$actual_backup_dir"
        exit 1
    fi
    
    log_info "Pull completed successfully"
    
    # Test build unless skipped
    if [ "$skip_build" = false ]; then
        if ! test_build; then
            log_error "Build test failed"
            rollback_pull "$backup_name" "$actual_backup_dir"
            exit 1
        fi
    fi
    
    # Restart application unless skipped
    if [ "$skip_restart" = false ]; then
        if ! restart_application; then
            log_error "Application restart failed"
            rollback_pull "$backup_name" "$actual_backup_dir"
            exit 1
        fi
    fi
    
    log_info "✅ Pull commit completed successfully"
    log_info "Backup created: $backup_name at $actual_backup_dir"
    
    # Show current status
    log_info "Current commit: $(git rev-parse HEAD)"
    log_info "Current branch: $(git branch --show-current)"
    
    echo ""
    log_info "Pull commit process completed. Monitor the application closely."
}

# Run main function with all arguments
main "$@"
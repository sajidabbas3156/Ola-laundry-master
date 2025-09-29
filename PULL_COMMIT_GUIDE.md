# 🔄 OLA Laundry Master - Pull Commit Guide

## 📋 Overview

The Pull Commit functionality provides a safe way to pull and integrate commits from remote repositories while maintaining the ability to rollback if issues occur. This complements the existing rollback infrastructure documented in [ROLLBACK_DOCUMENTATION.md](ROLLBACK_DOCUMENTATION.md).

---

## 🚀 Quick Start

### Basic Usage
```bash
# Pull latest commits safely
./scripts/pull-commit.sh

# Pull with specific strategy
./scripts/pull-commit.sh --strategy rebase

# Pull without building (for testing)
./scripts/pull-commit.sh --skip-build

# View help
./scripts/pull-commit.sh --help
```

---

## 🔧 Pull Strategies

### 1. Merge (Default)
```bash
./scripts/pull-commit.sh --strategy merge
```
- Creates merge commits
- Preserves branch history
- Safest for most scenarios

### 2. Rebase
```bash
./scripts/pull-commit.sh --strategy rebase
```
- Linear history
- No merge commits
- Clean commit history

### 3. Fast-Forward Only
```bash
./scripts/pull-commit.sh --strategy fast-forward
```
- Only pulls if no divergence
- Prevents merge commits
- Fails if local branch has diverged

---

## 🛡️ Safety Features

### Automatic Backup
- Creates backup before any changes
- Stores commit info and metadata
- Enables quick rollback if needed

### Pre-Pull Checks
- ✅ Working directory is clean
- ✅ No uncommitted changes
- ✅ Remote changes available
- ✅ Git repository validation

### Post-Pull Validation
- ✅ Build testing
- ✅ Dependency installation
- ✅ Application restart
- ✅ Health checks

### Automatic Rollback
- Triggers on any failure
- Restores previous commit
- Restarts application
- Maintains system stability

---

## 📂 Command Options

| Option | Description | Example |
|--------|-------------|---------|
| `--strategy STRATEGY` | Pull strategy (merge/rebase/fast-forward) | `--strategy rebase` |
| `--skip-build` | Skip build testing | `--skip-build` |
| `--skip-restart` | Skip application restart | `--skip-restart` |
| `--help` | Show help message | `--help` |

---

## 🔄 Integration with Existing Scripts

### Works With Rollback Script
```bash
# If pull-commit fails, use rollback for additional options
./scripts/pull-commit.sh
# If issues persist:
./scripts/rollback.sh quick
```

### Production Deployment
```bash
# Development pull
./scripts/pull-commit.sh --strategy merge

# Production deployment (after testing)
./scripts/deploy.sh
```

---

## 📋 Step-by-Step Process

### 1. Pre-Flight Checks
- Verify git repository
- Check working directory status
- Fetch remote changes
- Validate pull safety

### 2. Backup Creation
- Create timestamped backup
- Store current commit info
- Store branch information
- Create backup metadata

### 3. Pull Execution
- Execute git pull with chosen strategy
- Handle merge conflicts if any
- Validate pull success

### 4. Build Testing
- Install/update dependencies
- Run application build
- Verify build artifacts
- Test compilation

### 5. Application Restart
- Restart PM2 processes
- Perform health checks
- Validate application status
- Monitor startup

### 6. Success Confirmation
- Log successful completion
- Display current status
- Provide backup information
- Show monitoring guidance

---

## 🚨 Error Handling

### Build Failures
```bash
[ERROR] Build failed - dist directory not found
[INFO] Rolling back to commit: abc1234
[INFO] Rollback completed
```

### Health Check Failures
```bash
[ERROR] Health check failed after restart
[INFO] Rolling back due to pull failure...
[INFO] Rolling back to commit: abc1234
```

### Working Directory Issues
```bash
[ERROR] Working directory has uncommitted changes
[WARN] Please commit or stash your changes before pulling
```

---

## 🔗 Related Documentation

- **[ROLLBACK_DOCUMENTATION.md](ROLLBACK_DOCUMENTATION.md)** - Emergency rollback procedures
- **[DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md)** - Full deployment process
- **[QUICK_DEPLOY.md](QUICK_DEPLOY.md)** - Quick deployment options
- **[TROUBLESHOOTING.md](TROUBLESHOOTING.md)** - Common issues and solutions

---

## 🎯 Best Practices

### Before Pulling
1. **Check Status**: Ensure clean working directory
2. **Review Changes**: Check what commits will be pulled
3. **Test Environment**: Verify system is stable
4. **Backup Strategy**: Understand rollback options

### During Pull
1. **Monitor Output**: Watch for errors or warnings
2. **Review Conflicts**: Handle merge conflicts carefully
3. **Validate Build**: Ensure build completes successfully
4. **Test Health**: Verify application starts correctly

### After Pull
1. **Monitor Application**: Watch logs and performance
2. **Test Functionality**: Verify core features work
3. **Keep Backup**: Maintain backup until stability confirmed
4. **Document Changes**: Update relevant documentation

---

## 🔧 Advanced Usage

### Custom App Directory
```bash
# If running from different directory
cd /var/www/olalaundry
./scripts/pull-commit.sh
```

### Development Workflow
```bash
# Pull latest development changes
git checkout develop
./scripts/pull-commit.sh --strategy rebase

# Test thoroughly then merge to main
git checkout main
git merge develop
./scripts/pull-commit.sh --strategy fast-forward
```

### Production Updates
```bash
# Safer production update
./scripts/pull-commit.sh --strategy fast-forward
# Monitor application closely
pm2 logs olalaundry
```

---

## 📊 Monitoring and Logs

### Check Application Status
```bash
# PM2 status
pm2 status olalaundry

# Application logs
pm2 logs olalaundry

# Health check
curl -f http://localhost:3000/health
```

### Backup Information
```bash
# List backups
ls -la /var/backups/olalaundry/

# View backup info
cat /var/backups/olalaundry/backup_YYYYMMDD_HHMMSS.info
```

---

## 🆘 Emergency Procedures

### If Pull Commit Fails
1. **Automatic Rollback**: Script automatically rolls back
2. **Manual Rollback**: Use `./scripts/rollback.sh quick`
3. **Full Rollback**: Use `./scripts/rollback.sh` for complete rollback
4. **Check Logs**: Review PM2 logs for issues

### If System is Unstable
1. **Quick Restart**: `pm2 restart olalaundry`
2. **Emergency Rollback**: `./scripts/rollback.sh quick`
3. **Full Recovery**: Follow [ROLLBACK_DOCUMENTATION.md](ROLLBACK_DOCUMENTATION.md)

---

**✨ Ready to pull commits safely!** Use `./scripts/pull-commit.sh --help` for more options.
# 🔧 TROUBLESHOOTING - OLA Laundry Master

## 🚨 QUICK FIXES FOR COMMON ISSUES

### **Issue: Application hosted but not accessible online**

#### **Step 1: Run Diagnostics**
```bash
# SSH into your Namecheap VPS
ssh root@your-vps-ip

# Run diagnostics
cd /var/www/olalaundry
./scripts/diagnose-deployment.sh
```

#### **Step 2: Run Auto-Fix**
```bash
# Run the fix script
./scripts/fix-deployment.sh
```

#### **Step 3: Manual Checks**

**Check if application is running:**
```bash
pm2 status
pm2 logs olalaundry
```

**Check if application responds locally:**
```bash
curl http://localhost:3000/health
```

**Check if Nginx is running:**
```bash
sudo systemctl status nginx
sudo nginx -t
```

**Check firewall:**
```bash
sudo ufw status
```

## 🔍 COMMON PROBLEMS & SOLUTIONS

### **1. PM2 Process Not Running**
```bash
# Start PM2 process
pm2 start ecosystem.config.js --env production
pm2 save
pm2 startup
```

### **2. Build Files Missing**
```bash
# Rebuild application
npm ci --production=false
npm run build
pm2 restart olalaundry
```

### **3. Environment Variables Missing**
```bash
# Create .env file
cp .env.production .env
nano .env  # Edit with your values

# Required variables:
# DATABASE_URL=postgresql://user:pass@localhost:5432/db
# JWT_SECRET=your-secure-secret-32-chars-min
# CORS_ORIGIN=https://your-domain.com
```

### **4. Database Connection Issues**
```bash
# Test database connection
pg_isready -d "$DATABASE_URL"

# Run migrations
npm run db:push
```

### **5. Nginx Not Configured**
```bash
# Copy Nginx config
sudo cp nginx.conf /etc/nginx/sites-available/olalaundry
sudo ln -sf /etc/nginx/sites-available/olalaundry /etc/nginx/sites-enabled/
sudo rm -f /etc/nginx/sites-enabled/default
sudo nginx -t
sudo systemctl restart nginx
```

### **6. Firewall Blocking Connections**
```bash
# Open required ports
sudo ufw allow 22/tcp   # SSH
sudo ufw allow 80/tcp   # HTTP
sudo ufw allow 443/tcp  # HTTPS
sudo ufw enable
```

### **7. Domain Not Pointing to Server**
- Check DNS settings in your domain registrar
- Ensure A record points to your VPS IP address
- Wait for DNS propagation (up to 24 hours)

### **8. SSL Certificate Issues**
```bash
# Install SSL certificate
sudo apt-get install -y certbot python3-certbot-nginx
sudo certbot --nginx -d your-domain.com
```

## 🧪 TESTING COMMANDS

### **Local Testing (on VPS):**
```bash
# Health check
curl http://localhost:3000/health

# Full application
curl http://localhost:3000/

# Through Nginx
curl http://localhost/health
```

### **External Testing (from your computer):**
```bash
# Replace YOUR_VPS_IP with actual IP
curl http://YOUR_VPS_IP/health
curl http://YOUR_VPS_IP/

# With domain
curl http://your-domain.com/health
```

## 📊 MONITORING COMMANDS

### **Check Application Status:**
```bash
pm2 status
pm2 logs olalaundry
pm2 monit
```

### **Check System Services:**
```bash
sudo systemctl status nginx
sudo systemctl status postgresql  # if using local DB
```

### **Check Network:**
```bash
netstat -tlnp | grep :3000  # Application port
netstat -tlnp | grep :80    # HTTP port
netstat -tlnp | grep :443   # HTTPS port
```

### **Check Logs:**
```bash
# Application logs
pm2 logs olalaundry

# Nginx logs
sudo tail -f /var/log/nginx/access.log
sudo tail -f /var/log/nginx/error.log

# System logs
sudo journalctl -u nginx -f
```

## 🆘 EMERGENCY PROCEDURES

### **If Application is Completely Down:**
```bash
# Quick restart
pm2 restart olalaundry

# Full restart
pm2 delete olalaundry
pm2 start ecosystem.config.js --env production
```

### **If Database is Corrupted:**
```bash
# Restore from backup
ls /var/backups/olalaundry/
pg_restore -d $DATABASE_URL /var/backups/olalaundry/backup_YYYYMMDD_HHMMSS.sql
```

### **If Need to Rollback:**
```bash
# Quick rollback
./scripts/rollback.sh quick

# Full rollback
./scripts/rollback.sh full
```

## 📞 GETTING HELP

### **Check These First:**
1. **Application logs**: `pm2 logs olalaundry`
2. **Health endpoint**: `curl http://localhost:3000/health`
3. **PM2 status**: `pm2 status`
4. **Nginx status**: `sudo systemctl status nginx`

### **Common Error Messages:**

**"EADDRINUSE: address already in use"**
- Another process is using port 3000
- Solution: `sudo lsof -i :3000` then kill the process

**"Database connection failed"**
- Check DATABASE_URL in .env
- Ensure PostgreSQL is running
- Test with: `pg_isready -d "$DATABASE_URL"`

**"502 Bad Gateway"**
- Application not running on port 3000
- Check: `pm2 status` and `pm2 logs olalaundry`

**"404 Not Found"**
- Nginx not configured properly
- Check: `sudo nginx -t`

### **Still Need Help?**

1. **Run full diagnostics**: `./scripts/diagnose-deployment.sh`
2. **Try auto-fix**: `./scripts/fix-deployment.sh`
3. **Check all logs**: `pm2 logs olalaundry --lines 50`
4. **Verify environment**: `cat .env` (hide sensitive values)

---

## 🎯 QUICK CHECKLIST

- [ ] PM2 process running: `pm2 status`
- [ ] Application responds: `curl http://localhost:3000/health`
- [ ] Nginx running: `sudo systemctl status nginx`
- [ ] Nginx config valid: `sudo nginx -t`
- [ ] Firewall allows traffic: `sudo ufw status`
- [ ] Domain points to VPS IP
- [ ] Environment variables set in `.env`
- [ ] Database accessible: `pg_isready -d "$DATABASE_URL"`

**If all checkboxes are ✅ but still not working, the issue is likely DNS or external firewall.**
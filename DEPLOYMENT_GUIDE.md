# 🚀 OLA Laundry Master - Production Deployment Guide

## 🎯 **Deployment Overview**

This guide will help you deploy OLA Laundry Master to your AlmaLinux VPS at **www.olalaundry.com** (159.198.32.97).

---

## 📋 **Prerequisites**

### **Server Information**
- **Server IP**: 159.198.32.97
- **Domain**: www.olalaundry.com
- **OS**: AlmaLinux
- **User**: root
- **Password**: A0jR0iCk6TfYp1Ek78

### **Required Services**
- Node.js 20+
- PostgreSQL 15+
- Nginx
- PM2
- Redis
- Certbot (for SSL)

---

## 🔧 **Step 1: Server Setup**

### **Connect to Your Server**
```bash
ssh root@159.198.32.97
# Password: A0jR0iCk6TfYp1Ek78
```

### **Run Server Setup Script**
```bash
# Upload and run the server setup script
curl -O https://raw.githubusercontent.com/your-repo/ola-laundry-master/main/server-setup.sh
chmod +x server-setup.sh
./server-setup.sh
```

**Or manually copy the `server-setup.sh` file to your server and run it.**

---

## 🗄️ **Step 2: Database Setup**

### **Configure PostgreSQL**
```bash
# Switch to postgres user
sudo -u postgres psql

# Run the database setup commands
\i /path/to/database-setup.sql

# Exit PostgreSQL
\q
```

### **Update Database Password**
Update the `.env.production` file with your actual database credentials.

---

## 📦 **Step 3: Application Deployment**

### **Option A: Automated Deployment**
```bash
# From your local machine, run:
./deploy.sh
```

### **Option B: Manual Deployment**

#### **1. Build Application Locally**
```bash
npm ci
npm run build
```

#### **2. Create Deployment Package**
```bash
tar -czf olalaundry-deploy.tar.gz \
    dist/ \
    server/ \
    shared/ \
    migrations/ \
    package.json \
    package-lock.json \
    .env.production \
    ecosystem.config.js \
    nginx.conf
```

#### **3. Upload to Server**
```bash
scp olalaundry-deploy.tar.gz root@159.198.32.97:/tmp/
```

#### **4. Deploy on Server**
```bash
ssh root@159.198.32.97

# Extract files
cd /tmp
tar -xzf olalaundry-deploy.tar.gz

# Create application directory
mkdir -p /var/www/olalaundry
cp -r * /var/www/olalaundry/
cd /var/www/olalaundry

# Install dependencies
npm ci --production

# Copy environment file
cp .env.production .env

# Run database migrations
npm run db:push

# Start application with PM2
pm2 start ecosystem.config.js
pm2 save
```

---

## 🌐 **Step 4: Nginx Configuration**

### **Configure Nginx**
```bash
# Copy nginx configuration
cp /var/www/olalaundry/nginx.conf /etc/nginx/sites-available/www.olalaundry.com

# Enable site
ln -sf /etc/nginx/sites-available/www.olalaundry.com /etc/nginx/sites-enabled/

# Test configuration
nginx -t

# Reload Nginx
systemctl reload nginx
```

---

## 🔒 **Step 5: SSL Setup**

### **Install SSL Certificate**
```bash
# Run SSL setup script
./ssl-setup.sh
```

**Or manually:**
```bash
# Stop Nginx temporarily
systemctl stop nginx

# Get SSL certificate
certbot certonly --standalone -d www.olalaundry.com -d olalaundry.com

# Start Nginx
systemctl start nginx

# Setup auto-renewal
echo "0 12 * * * /usr/bin/certbot renew --quiet --post-hook 'systemctl reload nginx'" | crontab -
```

---

## 🔄 **Step 6: Setup Backups and Maintenance**

### **Setup Automated Backups**
```bash
# Copy backup script
cp /var/www/olalaundry/backup.sh /usr/local/bin/
chmod +x /usr/local/bin/backup.sh

# Setup daily backup cron job
echo "0 2 * * * /usr/local/bin/backup.sh" | crontab -
```

### **Setup Maintenance Tasks**
```bash
# Copy maintenance script
cp /var/www/olalaundry/maintenance.sh /usr/local/bin/
chmod +x /usr/local/bin/maintenance.sh

# Setup weekly maintenance
echo "0 3 * * 0 /usr/local/bin/maintenance.sh" | crontab -
```

---

## ✅ **Step 7: Verification**

### **Check Services**
```bash
# Check PM2 status
pm2 status

# Check Nginx status
systemctl status nginx

# Check PostgreSQL status
systemctl status postgresql-15

# Check application health
curl http://localhost:3000/api/health
```

### **Test Website**
1. **HTTP**: http://www.olalaundry.com (should redirect to HTTPS)
2. **HTTPS**: https://www.olalaundry.com
3. **API**: https://www.olalaundry.com/api/health

---

## 🎯 **Post-Deployment Tasks**

### **1. Update DNS Records**
Ensure your domain points to **159.198.32.97**:
```
A Record: www.olalaundry.com → 159.198.32.97
A Record: olalaundry.com → 159.198.32.97
```

### **2. Configure Email (Optional)**
Update SMTP settings in `.env` for email notifications.

### **3. Setup Monitoring**
Consider setting up monitoring tools like:
- PM2 monitoring
- Nginx access logs
- Database monitoring

### **4. Security Hardening**
- Change default passwords
- Setup fail2ban
- Configure firewall rules
- Regular security updates

---

## 🛠️ **Management Commands**

### **Application Management**
```bash
# Start application
npm run start:prod

# Stop application
npm run stop

# Restart application
npm run restart

# View logs
npm run logs

# Manual backup
/usr/local/bin/backup.sh

# Manual maintenance
/usr/local/bin/maintenance.sh
```

### **Database Management**
```bash
# Connect to database
PGPASSWORD="OLA_Secure_2024!@#" psql -h localhost -U ola_user -d ola_laundry_production

# Run migrations
npm run db:push

# Database studio (development)
npm run db:studio
```

---

## 🚨 **Troubleshooting**

### **Common Issues**

#### **Application Won't Start**
```bash
# Check PM2 logs
pm2 logs olalaundry

# Check environment variables
cat /var/www/olalaundry/.env

# Check database connection
npm run db:push
```

#### **SSL Issues**
```bash
# Check certificate
certbot certificates

# Renew certificate
certbot renew

# Check Nginx configuration
nginx -t
```

#### **Database Issues**
```bash
# Check PostgreSQL status
systemctl status postgresql-15

# Check database logs
tail -f /var/lib/pgsql/15/data/log/postgresql-*.log
```

---

## 📞 **Support**

### **Log Locations**
- **Application**: `/var/log/olalaundry/`
- **Nginx**: `/var/log/nginx/`
- **PostgreSQL**: `/var/lib/pgsql/15/data/log/`
- **PM2**: `pm2 logs`

### **Backup Location**
- **Backups**: `/var/backups/olalaundry/`

---

## 🎉 **Success!**

Your OLA Laundry Master application should now be running at:
**https://www.olalaundry.com**

The deployment includes:
- ✅ Production-ready Node.js application
- ✅ PostgreSQL database with proper security
- ✅ Nginx reverse proxy with SSL
- ✅ PM2 process management
- ✅ Automated backups and maintenance
- ✅ Security hardening and monitoring

**Your laundry management system is ready for business!** 🚀
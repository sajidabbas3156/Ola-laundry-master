# 🚀 Quick Deploy to Namecheap - OLA Laundry Master

## Option 1: Auto-Deployment (Recommended)

### Step 1: Setup GitHub Secrets
1. Go to: https://github.com/sajidabbas3156/Ola-laundry-master/settings/secrets/actions
2. Add these secrets:
   - `HOST`: Your VPS IP (e.g., `159.198.32.97`)
   - `USERNAME`: Your VPS username (e.g., `root`)
   - `SSH_PRIVATE_KEY`: Your SSH private key content

### Step 2: Setup SSH Key on VPS
```bash
# Generate SSH key (if needed)
ssh-keygen -t rsa -b 4096 -C "your-email@example.com"

# Copy public key to VPS
ssh-copy-id root@your-vps-ip

# Or manually:
cat ~/.ssh/id_rsa.pub | ssh root@your-vps-ip "mkdir -p ~/.ssh && cat >> ~/.ssh/authorized_keys"
```

### Step 3: Trigger Deployment
- **Automatic**: Push to `main` branch
- **Manual**: Go to Actions → "Deploy to Production" → Run workflow

## Option 2: Manual Deployment

### Quick Command
```bash
./scripts/deploy-namecheap.sh YOUR_VPS_IP YOUR_USERNAME
```

### Example
```bash
./scripts/deploy-namecheap.sh 159.198.32.97 root
```

## Option 3: Direct VPS Setup

### SSH into your VPS and run:
```bash
# Clone repository
git clone https://github.com/sajidabbas3156/Ola-laundry-master.git /var/www/olalaundry
cd /var/www/olalaundry

# Run deployment script
chmod +x scripts/deploy.sh
./scripts/deploy.sh
```

## Verification

After deployment, check:
- 🌐 **Website**: https://www.olalaundry.com
- 🏥 **Health**: https://www.olalaundry.com/health
- 🤖 **AI Center**: https://www.olalaundry.com/tenant/ola-laundry/ai-operations

## Emergency Rollback

If something goes wrong:

### GitHub Actions (Recommended)
1. Go to Actions → "Emergency Rollback"
2. Select rollback type: `quick`, `full`, or `with-db`
3. Type "CONFIRM" and run

### SSH Command
```bash
ssh root@your-vps-ip
cd /var/www/olalaundry
./scripts/rollback.sh quick
```

## Support

- 📚 **Full Docs**: [docs/GITHUB_SECRETS_SETUP.md](docs/GITHUB_SECRETS_SETUP.md)
- 🔧 **Troubleshooting**: Check PM2 logs: `pm2 logs olalaundry`
- 🏥 **Health Check**: `curl http://localhost:3000/health`

---

**Ready to deploy? Choose your preferred option above!** 🚀
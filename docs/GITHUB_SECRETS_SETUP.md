# GitHub Secrets Setup for Auto-Deployment

## Required GitHub Secrets

To enable auto-deployment to Namecheap VPS, you need to configure the following secrets in your GitHub repository:

### 1. Navigate to GitHub Secrets
1. Go to your repository: https://github.com/sajidabbas3156/Ola-laundry-master
2. Click on **Settings** tab
3. In the left sidebar, click **Secrets and variables** → **Actions**
4. Click **New repository secret**

### 2. Add Required Secrets

#### `HOST`
- **Name**: `HOST`
- **Value**: Your Namecheap VPS IP address
- **Example**: `159.198.32.97`

#### `USERNAME`
- **Name**: `USERNAME`
- **Value**: Your VPS username
- **Example**: `root` or `deploy`

#### `SSH_PRIVATE_KEY`
- **Name**: `SSH_PRIVATE_KEY`
- **Value**: Your SSH private key content
- **How to get**:
  ```bash
  # Generate SSH key pair if you don't have one
  ssh-keygen -t rsa -b 4096 -C "your-email@example.com"
  
  # Copy private key content
  cat ~/.ssh/id_rsa
  ```
- **Important**: Copy the entire private key including:
  ```
  -----BEGIN OPENSSH PRIVATE KEY-----
  [key content]
  -----END OPENSSH PRIVATE KEY-----
  ```

#### `PORT` (Optional)
- **Name**: `PORT`
- **Value**: SSH port (default: 22)
- **Example**: `22`

## 3. Setup SSH Key on VPS

After adding the private key to GitHub secrets, you need to add the public key to your VPS:

```bash
# On your local machine, copy the public key
cat ~/.ssh/id_rsa.pub

# SSH into your VPS
ssh root@your-vps-ip

# Add the public key to authorized_keys
mkdir -p ~/.ssh
echo "your-public-key-content" >> ~/.ssh/authorized_keys
chmod 600 ~/.ssh/authorized_keys
chmod 700 ~/.ssh
```

## 4. Test SSH Connection

Test the SSH connection from your local machine:

```bash
ssh -i ~/.ssh/id_rsa root@your-vps-ip
```

## 5. Trigger Auto-Deployment

Once secrets are configured, auto-deployment will trigger:

### Automatic Deployment
- **Trigger**: Push to `main` branch
- **Action**: Automatically deploys to production

### Manual Deployment
- **Trigger**: Go to Actions tab → "Deploy to Production" → "Run workflow"
- **Action**: Manually trigger deployment

### Emergency Rollback
- **Trigger**: Go to Actions tab → "Emergency Rollback" → "Run workflow"
- **Options**: 
  - `quick`: Restart application
  - `full`: Revert to previous version
  - `with-db`: Revert with database restore
- **Confirmation**: Type "CONFIRM" to proceed

## 6. Verify Deployment

After deployment, verify:

1. **GitHub Actions**: Check the workflow run status
2. **Application**: Visit https://www.olalaundry.com
3. **Health Check**: Visit https://www.olalaundry.com/health
4. **AI Features**: Visit https://www.olalaundry.com/tenant/ola-laundry/ai-operations

## 7. Monitoring

Monitor your deployment:

```bash
# SSH into VPS
ssh root@your-vps-ip

# Check PM2 status
pm2 status

# View logs
pm2 logs olalaundry

# Check health
curl http://localhost:3000/health
```

## 8. Troubleshooting

### Common Issues

**SSH Connection Failed**:
- Verify IP address and username
- Check SSH key format (include headers/footers)
- Ensure public key is in VPS authorized_keys

**Build Failed**:
- Check GitHub Actions logs
- Verify Node.js version compatibility
- Check for TypeScript errors

**Health Check Failed**:
- Check PM2 logs: `pm2 logs olalaundry`
- Verify environment variables
- Check database connection

**Domain Not Accessible**:
- Verify DNS settings point to VPS IP
- Check Nginx configuration
- Verify SSL certificate

### Emergency Procedures

**If deployment fails**:
1. Check GitHub Actions logs
2. SSH into VPS and check PM2 status
3. Use emergency rollback workflow
4. Contact support if needed

**If application is down**:
1. Use emergency rollback: "quick" option
2. Check logs for errors
3. If rollback fails, use "full" option

## 9. Security Best Practices

- **SSH Keys**: Use strong SSH keys (4096-bit RSA minimum)
- **Secrets**: Never commit secrets to repository
- **Access**: Limit SSH access to specific IPs if possible
- **Monitoring**: Set up alerts for failed deployments
- **Backups**: Regular database and application backups

## 10. Support

For deployment issues:
- Check GitHub Actions logs first
- Review VPS logs: `pm2 logs olalaundry`
- Check health endpoint: `/health`
- Review documentation: `/docs/`

---

**Next Steps**: After setting up secrets, push to main branch to trigger your first auto-deployment!
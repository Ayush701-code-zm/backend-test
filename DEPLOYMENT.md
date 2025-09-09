# CI/CD Deployment Guide

This guide explains how to set up automated deployment for your CRUD backend using GitHub Actions.

## 🚀 CI/CD Pipeline Overview

The pipeline includes:
- **Test & Lint**: Code quality checks and testing
- **Security Scan**: Vulnerability scanning with npm audit and Snyk
- **Build**: Production build validation
- **Deploy Staging**: Auto-deploy to staging on `develop` branch
- **Deploy Production**: Auto-deploy to production on `main` branch
- **Notifications**: Success/failure notifications

## 📋 Setup Instructions

```bash
# Initialize git repository (if not done)
git init
git add .
git commit -m "Initial commit: CRUD backend with CI/CD"

# Add remote repository
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git

# Create branches
git branch develop
git push -u origin main
git push -u origin develop
```

### 2. GitHub Secrets Configuration

Go to your GitHub repository → Settings → Secrets and variables → Actions

#### Required Secrets:

**For Staging Environment:**
```
STAGING_HOST=your-staging-server-ip
STAGING_USER=ubuntu
STAGING_SSH_KEY=your-private-ssh-key
STAGING_PORT=22
STAGING_PATH=/home/ubuntu/backend-test
```

**For Production Environment:**
```
PROD_HOST=your-production-server-ip
PROD_USER=ubuntu
PROD_SSH_KEY=your-private-ssh-key
PROD_PORT=22
PROD_PATH=/home/ubuntu/backend-test
```

**Optional (for security scanning):**
```
SNYK_TOKEN=your-snyk-token
```

### 3. SSH Key Setup

#### Generate SSH Key Pair:
```bash
# On your local machine
ssh-keygen -t rsa -b 4096 -C "github-actions@yourdomain.com"
# Save as: ~/.ssh/github_actions_key
```

#### Add Public Key to Servers:
```bash
# Copy public key to your servers
ssh-copy-id -i ~/.ssh/github_actions_key.pub ubuntu@your-server-ip

# Or manually add to ~/.ssh/authorized_keys on servers
cat ~/.ssh/github_actions_key.pub >> ~/.ssh/authorized_keys
```

#### Add Private Key to GitHub Secrets:
```bash
# Copy private key content
cat ~/.ssh/github_actions_key

# Paste the entire content (including -----BEGIN/END-----) 
# into GitHub secret: STAGING_SSH_KEY and PROD_SSH_KEY
```

### 4. Server Prerequisites

Ensure your servers have:
```bash
# Node.js 18+
node --version

# PM2
pm2 --version

# Git
git --version

# nginx (configured)
sudo systemctl status nginx
```

### 5. Environment Setup on Servers

#### Create deployment directory:
```bash
sudo mkdir -p /home/ubuntu/backend-test
sudo chown ubuntu:ubuntu /home/ubuntu/backend-test
```

#### Clone repository:
```bash
cd /home/ubuntu/backend-test
git clone https://github.com/YOUR_USERNAME/YOUR_REPO.git .
```

#### Setup environment file:
```bash
# Create .env file
cat > .env << EOF
PORT=5000
MONGODB_URI=mongodb+srv://w5434676_db_user:yD9AnRc4yL2AfET0@cluster0.voibnl5.mongodb.net/crud_database
JWT_SECRET=your_super_secret_jwt_key_here_change_this_in_production
NODE_ENV=production
EOF
```

## 🔄 Deployment Workflow

### Staging Deployment (Automatic)
```bash
# Push to develop branch triggers staging deployment
git checkout develop
git add .
git commit -m "Feature: new functionality"
git push origin develop
```

### Production Deployment (Automatic)
```bash
# Merge to main branch triggers production deployment
git checkout main
git merge develop
git push origin main
```

### Manual Deployment
```bash
# If you need to deploy manually
npm run pm2:restart
```

## 📊 Monitoring Deployments

### GitHub Actions
- View deployment status: Repository → Actions tab
- Check logs for each deployment step
- Monitor success/failure notifications

### Server Monitoring
```bash
# Check PM2 status
pm2 status

# View application logs
pm2 logs crud-backend

# Monitor nginx
sudo tail -f /var/log/nginx/access.log
sudo tail -f /var/log/nginx/error.log

# Health check
curl http://localhost/api/health
```

## 🔧 Customization

### Add Real Testing
Update `package.json`:
```json
{
  "scripts": {
    "test": "jest",
    "test:watch": "jest --watch",
    "test:coverage": "jest --coverage"
  },
  "devDependencies": {
    "jest": "^29.0.0",
    "supertest": "^6.3.0"
  }
}
```

### Add Linting
```json
{
  "scripts": {
    "lint": "eslint .",
    "lint:fix": "eslint . --fix"
  },
  "devDependencies": {
    "eslint": "^8.0.0"
  }
}
```

### Add Notifications
In `.github/workflows/ci.yml`, replace notification steps with:

```yaml
- name: Slack Notification
  uses: 8398a7/action-slack@v3
  with:
    status: ${{ job.status }}
    webhook_url: ${{ secrets.SLACK_WEBHOOK }}
```

## 🐛 Troubleshooting

### Common Issues:

1. **SSH Connection Failed**
   ```bash
   # Test SSH connection
   ssh -i ~/.ssh/github_actions_key ubuntu@your-server-ip
   ```

2. **PM2 Command Not Found**
   ```bash
   # Install PM2 globally on server
   sudo npm install -g pm2
   ```

3. **Permission Denied**
   ```bash
   # Fix file permissions
   sudo chown -R ubuntu:ubuntu /home/ubuntu/backend-test
   ```

4. **Health Check Failed**
   ```bash
   # Check if app is running
   pm2 status
   
   # Check logs
   pm2 logs crud-backend
   
   # Test manually
   curl http://localhost:5000/api/health
   ```

## 🔒 Security Best Practices

1. **Rotate SSH Keys** regularly
2. **Use separate keys** for staging and production
3. **Limit SSH access** to specific IPs if possible
4. **Monitor deployment logs** for suspicious activity
5. **Keep secrets secure** - never commit them to code

## 📈 Advanced Features

### Blue-Green Deployment
- Modify PM2 commands to use cluster mode
- Implement health checks before switching traffic

### Database Migrations
- Add migration steps in deployment scripts
- Backup database before major deployments

### Environment-Specific Configurations
- Use different MongoDB databases for staging/production
- Configure different logging levels

---

Your CI/CD pipeline is now ready! 🚀

Every push to `develop` will deploy to staging, and every push to `main` will deploy to production with zero downtime.

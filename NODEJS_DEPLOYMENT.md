# Node.js Backend Deployment Guide

This guide will help you deploy your Node.js Express API backend to Ubuntu 18.04 with Nginx and PM2.

## Prerequisites
- A domain name pointing to your server
- A fresh Ubuntu 18.04 (64 Bit) server
- A user with sudo privileges
- Your Node.js application code

## Step 1 — Update Your System

```bash
sudo apt update && sudo apt upgrade -y
```

## Step 2 — Install Node.js and NPM

```bash
# Install Node.js 18.x
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# Verify installation
node --version
npm --version
```

## Step 3 — Install PM2 Globally

```bash
sudo npm install pm2 -g

# Verify installation
pm2 --version
```

## Step 4 — Install and Configure Nginx

```bash
# Install Nginx
sudo apt install nginx -y

# Start and enable Nginx
sudo systemctl start nginx
sudo systemctl enable nginx

# Check status
sudo systemctl status nginx
```

## Step 5 — Configure Firewall

```bash
# Allow Nginx and SSH
sudo ufw allow 'Nginx Full'
sudo ufw allow OpenSSH

# Enable firewall
sudo ufw enable

# Check status
sudo ufw status
```

## Step 6 — Deploy Your Application

### Create Application Directory

```bash
# Create directory for your app
sudo mkdir -p /var/www/crud-backend
sudo chown -R $USER:$USER /var/www/crud-backend
```

### Upload Your Code

```bash
# Navigate to app directory
cd /var/www/crud-backend

# Clone your repository (replace with your actual repo)
git clone https://github.com/YOUR_USERNAME/YOUR_REPO.git .

# Or upload your files using SCP/SFTP
# scp -r /path/to/your/local/project/* ubuntu@your-server-ip:/var/www/crud-backend/
```

### Install Dependencies

```bash
cd /var/www/crud-backend
npm install --production
```

### Create Environment File


```bash
# Create .env file
nano .env
```

Add your environment variables:
```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
NODE_ENV=production
```

### Create Logs Directory

```bash
mkdir -p logs
```

## Step 7 — Configure Nginx

### Create Nginx Configuration


sudo nano /etc/nginx/sites-available/crud-backend
```bash
# Copy the provided nginx configuration
sudo cp nginx/nodejs-app.conf /etc/nginx/sites-available/crud-backend

# Edit the configuration
sudo nano /etc/nginx/sites-available/crud-backend
```

Update the `server_name` in the configuration:
```nginx
server_name your-domain.com; # Replace with your actual domain
```

### Enable the Site

```bash
# Create symbolic link
sudo ln -s /etc/nginx/sites-available/crud-backend /etc/nginx/sites-enabled/

# Remove default site
sudo rm /etc/nginx/sites-enabled/default

# Test Nginx configuration
sudo nginx -t

# Restart Nginx
sudo systemctl restart nginx
```

## Step 8 — Start Your Application with PM2

```bash
# Navigate to your app directory
cd /var/www/crud-backend

# Start the application using the ecosystem file
pm2 start ecosystem.config.js --env production

# Save PM2 configuration
pm2 save

# Setup PM2 to start on boot
pm2 startup
# Follow the instructions provided by the command above

# Check status
pm2 status
pm2 logs crud-backend
```

## Step 9 — Install SSL Certificate (Optional but Recommended)

### Install Certbot

```bash
sudo apt install certbot python3-certbot-nginx -y
```

### Get SSL Certificate

```bash
# Replace with your actual domain
sudo certbot --nginx -d your-domain.com

# Test automatic renewal
sudo certbot renew --dry-run
```

## Step 10 — Verify Deployment

### Check Application Status

```bash
# Check PM2 status
pm2 status

# Check Nginx status
sudo systemctl status nginx

# Check application logs
pm2 logs crud-backend

# Test health endpoint
curl http://your-domain.com/api/health
```

### Test Your API

```bash
# Test root endpoint
curl http://your-domain.com/

# Test health check
curl http://your-domain.com/api/health

# Test users endpoint (if you have data)
curl http://your-domain.com/api/users
```

## Useful Commands

### PM2 Commands

```bash
# View all processes
pm2 list

# Restart application
pm2 restart crud-backend

# Stop application
pm2 stop crud-backend

# Delete application
pm2 delete crud-backend

# View logs
pm2 logs crud-backend

# Monitor in real-time
pm2 monit
```

### Nginx Commands

```bash
# Test configuration
sudo nginx -t

# Reload configuration
sudo systemctl reload nginx

# Restart Nginx
sudo systemctl restart nginx

# View error logs
sudo tail -f /var/log/nginx/error.log

# View access logs
sudo tail -f /var/log/nginx/access.log
```

### Application Management

```bash
# Update application
cd /var/www/crud-backend
git pull origin main
npm install --production
pm2 restart crud-backend

# View application logs
pm2 logs crud-backend --lines 100

# Monitor system resources
pm2 monit
```

## Troubleshooting

### Common Issues

1. **Application won't start**
   ```bash
   # Check logs
   pm2 logs crud-backend
   
   # Check if port is in use
   sudo netstat -tlnp | grep :5000
   ```

2. **Nginx 502 Bad Gateway**
   ```bash
   # Check if app is running
   pm2 status
   
   # Check Nginx error logs
   sudo tail -f /var/log/nginx/error.log
   ```

3. **Permission Issues**
   ```bash
   # Fix ownership
   sudo chown -R $USER:$USER /var/www/crud-backend
   
   # Fix permissions
   chmod -R 755 /var/www/crud-backend
   ```

4. **Database Connection Issues**
   ```bash
   # Check environment variables
   cat .env
   
   # Test database connection
   node -e "console.log(process.env.MONGODB_URI)"
   ```

## Security Considerations

1. **Keep your system updated**
   ```bash
   sudo apt update && sudo apt upgrade -y
   ```

2. **Configure firewall properly**
   ```bash
   sudo ufw status
   ```

3. **Use strong passwords and keys**
4. **Regularly backup your data**
5. **Monitor logs for suspicious activity**

## Performance Optimization

1. **Enable PM2 cluster mode** (for production)
   ```bash
   # Edit ecosystem.config.js
   instances: 'max',
   exec_mode: 'cluster'
   ```

2. **Configure Nginx caching** (if needed)
3. **Monitor resource usage**
   ```bash
   pm2 monit
   ```

---

Your Node.js backend is now deployed and running! 🚀

The application will be accessible at `http://your-domain.com` and will automatically restart if it crashes thanks to PM2.

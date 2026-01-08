# Production Node.js Backend Deployment Guide (Nginx + PM2)

This guide shows the **correct, clean, production-ready way** to deploy a **Node.js (Express/Fastify/Nest) backend API** on **Ubuntu** using **Nginx** and **PM2**.

> This version avoids duplication, outdated practices, and confusion.

---

## Prerequisites

* Ubuntu **20.04 or 22.04** (recommended)
* Domain name pointing to server IP (optional but recommended)
* Non-root user with `sudo` privileges
* Node.js backend repository

---

## Step 1 — Update the System

```bash
sudo apt update && sudo apt upgrade -y
```

---

## Step 2 — Install Node.js 18 (LTS)

```bash
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs
```

Verify:

```bash
node --version
npm --version
```

---

## Step 3 — Install PM2 Globally

```bash
sudo npm install -g pm2
pm2 --version
```

---

## Step 4 — Install and Enable Nginx

```bash
sudo apt install nginx -y
sudo systemctl start nginx
sudo systemctl enable nginx
```

Verify:

```bash
sudo systemctl status nginx
```

---

## Step 5 — Configure Firewall (UFW)

```bash
sudo ufw allow OpenSSH
sudo ufw allow 'Nginx Full'
sudo ufw enable
sudo ufw status
```

---

## Step 6 — Deploy Application Code

### Create App Directory

```bash
sudo mkdir -p /var/www/crud-backend
sudo chown -R $USER:$USER /var/www/crud-backend
cd /var/www/crud-backend
```

### Clone Repository

```bash
git clone https://github.com/YOUR_USERNAME/YOUR_REPO.git
cd YOUR_REPO
```

---

## Step 7 — Install Dependencies

```bash
npm install --production
```

---

## Step 8 — Environment Variables (Server Only)

Create `.env` in the app root:

```bash
nano .env
```

Example:

```env
PORT=5000
NODE_ENV=production
JWT_SECRET=your_jwt_secret
DATABASE_URL=your_database_url
```

> `.env` should **never be committed** to GitHub.

---

## Step 9 — Start App Using PM2 Ecosystem File (From Repo)

> `ecosystem.config.js` **must already exist in your repository** and be committed.

Example file (already in repo):

```js
module.exports = {
  apps: [
    {
      name: "crud-backend",
      script: "index.js",
      instances: "max",
      exec_mode: "cluster",
      env: {
        NODE_ENV: "production",
        PORT: 5000
      }
    }
  ]
};
```

Start the app:

```bash
pm2 start ecosystem.config.js --env production
pm2 save
pm2 startup
```

Run the command PM2 prints (with `sudo`).

Verify:

```bash
pm2 status
pm2 logs crud-backend
```

---

## Step 10 — Configure Nginx Reverse Proxy

Create config:

```bash
sudo nano /etc/nginx/sites-available/crud-backend
```

Paste:

```nginx
server {
    listen 80;
    server_name your-domain.com www.your-domain.com;

    server_tokens off;

    location / {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;

        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;

        proxy_cache_bypass $http_upgrade;
    }
}
```

Enable site:

```bash
sudo ln -s /etc/nginx/sites-available/crud-backend /etc/nginx/sites-enabled/
sudo rm /etc/nginx/sites-enabled/default
sudo nginx -t
sudo systemctl reload nginx
```

---

## Step 11 — Install SSL Certificate (Recommended)

```bash
sudo apt install certbot python3-certbot-nginx -y
sudo certbot --nginx -d your-domain.com -d www.your-domain.com
sudo certbot renew --dry-run
```

Certbot automatically enables HTTPS and HTTP → HTTPS redirect.

---

## Step 12 — Final Verification

```bash
pm2 status
curl http://localhost:5000
curl https://your-domain.com
```

---

## Final Architecture

```
Internet
  ↓
Nginx (80 → 443)
  ↓
Node.js API (PM2 Cluster Mode)
  ↓
Database / External Services
```

---

## Best Practices

* Keep `ecosystem.config.js` in the repo
* Never commit `.env`
* Avoid NVM on production servers
* Always run `nginx -t` before reload
* Monitor with `pm2 monit`

This setup is stable, clean, and production-proven.


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

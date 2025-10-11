# Hostinger Domain Setup Guide for egypt-fisher.com

## 🎯 Your Goal

Access **egypt-fisher.com** and see your Angular app (currently on `http://72.61.18.171:4000/en`) WITHOUT the URL changing in the browser.

## 📋 Prerequisites

- Domain: **egypt-fisher.com** (purchased from Hostinger) ✅
- Server IP: **72.61.18.171** ✅
- Frontend running on port: **4000** ✅
- Backend running on port: **5000** ✅

---

## 🚀 Recommended Solution: DNS + Nginx Reverse Proxy

This is the **BEST** and most professional approach.

### Step 1: Configure DNS at Hostinger (5 minutes)

1. **Log in to Hostinger**

   - Go to: https://hpanel.hostinger.com/

2. **Navigate to DNS Management**

   - Click on **Domains**
   - Select **egypt-fisher.com**
   - Click **DNS / Nameservers**

3. **Add/Update DNS Records**

   Delete any existing A records and add these:

   ```
   Type    Name    Points to       TTL
   ────────────────────────────────────────────
   A       @       72.61.18.171    3600
   A       www     72.61.18.171    3600
   ```

   **What this does:**

   - `@` points root domain (egypt-fisher.com) to your server
   - `www` points www.egypt-fisher.com to your server

4. **Save Changes**

5. **Wait for DNS Propagation** (5-30 minutes)

   Check if DNS has updated:

   ```bash
   nslookup egypt-fisher.com
   # Should show: 72.61.18.171
   ```

---

### Step 2: Setup Nginx on Your Server (10 minutes)

#### A. Connect to Your Server

```bash
ssh root@72.61.18.171
# Or use PuTTY on Windows
```

#### B. Install Nginx

```bash
sudo apt update
sudo apt install nginx -y
```

#### C. Create Nginx Configuration

```bash
sudo nano /etc/nginx/sites-available/egypt-fisher
```

Paste this configuration:

```nginx
# Redirect www to non-www
server {
    listen 80;
    listen [::]:80;
    server_name www.egypt-fisher.com;
    return 301 http://egypt-fisher.com$request_uri;
}

# Main server
server {
    listen 80;
    listen [::]:80;
    server_name egypt-fisher.com;

    # Logs
    access_log /var/log/nginx/egypt-fisher-access.log;
    error_log /var/log/nginx/egypt-fisher-error.log;

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;

    # Gzip compression
    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml;

    # Frontend (Angular app on port 4000)
    location / {
        proxy_pass http://localhost:4000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }

    # Backend API (on port 5000)
    location /api {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }
}
```

**Save and exit**: `Ctrl + X`, then `Y`, then `Enter`

#### D. Enable the Site

```bash
# Create symbolic link
sudo ln -s /etc/nginx/sites-available/egypt-fisher /etc/nginx/sites-enabled/

# Remove default site
sudo rm /etc/nginx/sites-enabled/default

# Test configuration
sudo nginx -t

# Restart Nginx
sudo systemctl restart nginx

# Enable Nginx to start on boot
sudo systemctl enable nginx
```

#### E. Configure Firewall

```bash
# Allow HTTP (port 80)
sudo ufw allow 80/tcp

# Allow HTTPS (port 443) - for later SSL setup
sudo ufw allow 443/tcp

# Allow SSH (important!)
sudo ufw allow OpenSSH

# Enable firewall
sudo ufw enable
```

---

### Step 3: Keep Your Apps Running with PM2 (5 minutes)

PM2 ensures your apps restart automatically if they crash or server reboots.

#### Install PM2

```bash
sudo npm install -g pm2
```

#### Stop Current Running Apps

```bash
# Find and kill any running node processes
pkill -f node
```

#### Start Apps with PM2

```bash
# Navigate to your project
cd /path/to/your/project

# Start backend
cd backend
pm2 start npm --name "egypt-fisher-backend" -- start

# Start frontend
cd ../frontend
pm2 start npm --name "egypt-fisher-frontend" -- start

# Save PM2 configuration
pm2 save

# Setup PM2 to start on system boot
pm2 startup systemd
# Copy and run the command PM2 outputs
```

#### Useful PM2 Commands

```bash
pm2 status          # Check app status
pm2 logs            # View logs
pm2 restart all     # Restart all apps
pm2 stop all        # Stop all apps
pm2 delete all      # Remove all apps from PM2
```

---

### Step 4: Test Your Setup (2 minutes)

1. **Wait for DNS propagation** (5-30 minutes after Step 1)

2. **Check DNS resolution**:

   ```bash
   nslookup egypt-fisher.com
   # Should return: 72.61.18.171
   ```

3. **Test in browser**:

   - Open: http://egypt-fisher.com
   - Should show your Angular app
   - URL should stay as `egypt-fisher.com` (no redirect!)

4. **Test different routes**:
   - http://egypt-fisher.com/en
   - http://egypt-fisher.com/ar
   - http://egypt-fisher.com/en/products
   - http://egypt-fisher.com/en/contact

---

### Step 5: Setup SSL (HTTPS) - Optional but Recommended (5 minutes)

Free SSL certificate with Let's Encrypt:

```bash
# Install Certbot
sudo apt install certbot python3-certbot-nginx -y

# Get SSL certificate (will auto-configure Nginx)
sudo certbot --nginx -d egypt-fisher.com -d www.egypt-fisher.com

# Follow the prompts:
# - Enter your email
# - Agree to terms
# - Choose to redirect HTTP to HTTPS (recommended)

# Test auto-renewal
sudo certbot renew --dry-run
```

**After SSL setup:**

- Your site will be: https://egypt-fisher.com
- HTTP will automatically redirect to HTTPS
- Free certificate, auto-renews every 90 days

---

## 🔧 Troubleshooting

### Problem: DNS not resolving

**Check DNS propagation:**

```bash
nslookup egypt-fisher.com
dig egypt-fisher.com
```

**Solutions:**

1. Wait longer (can take up to 48 hours, usually 5-30 minutes)
2. Clear local DNS cache:
   - Windows: `ipconfig /flushdns`
   - Mac: `sudo dscacheutil -flushcache`
3. Try different DNS: https://www.whatsmydns.net/#A/egypt-fisher.com

### Problem: "Connection refused" or "Can't connect"

**Check if apps are running:**

```bash
pm2 status
```

**Check if Nginx is running:**

```bash
sudo systemctl status nginx
```

**Check if ports are open:**

```bash
sudo netstat -tulpn | grep :4000
sudo netstat -tulpn | grep :5000
sudo netstat -tulpn | grep :80
```

**Restart everything:**

```bash
pm2 restart all
sudo systemctl restart nginx
```

### Problem: "502 Bad Gateway"

This means Nginx is running but can't connect to your app.

**Check app status:**

```bash
pm2 logs
```

**Restart apps:**

```bash
pm2 restart all
```

### Problem: Nginx configuration error

**Test configuration:**

```bash
sudo nginx -t
```

**View error log:**

```bash
sudo tail -f /var/log/nginx/error.log
```

---

## 📊 Architecture Diagram

```
                    Internet
                       │
                       ↓
              egypt-fisher.com (DNS)
               Points to: 72.61.18.171
                       │
                       ↓
                Server (72.61.18.171)
                       │
                       ↓
                   Nginx (Port 80)
                  /            \
                 /              \
                ↓                ↓
      Frontend (Port 4000)   Backend (Port 5000)
      Angular SSR App         Node.js API
```

**How it works:**

1. User visits **egypt-fisher.com**
2. DNS resolves to **72.61.18.171**
3. Request hits **Nginx** on port 80
4. Nginx forwards to:
   - Port 4000 for frontend pages
   - Port 5000 for API calls (/api/\*)
5. User sees content, URL stays as **egypt-fisher.com**

---

## ✅ Verification Checklist

- [ ] DNS A records point to 72.61.18.171
- [ ] DNS propagation complete (nslookup works)
- [ ] Nginx installed and running
- [ ] Nginx configuration created and enabled
- [ ] Frontend running on port 4000 (PM2)
- [ ] Backend running on port 5000 (PM2)
- [ ] Firewall allows ports 80, 443
- [ ] http://egypt-fisher.com loads correctly
- [ ] URL stays as egypt-fisher.com (no redirect)
- [ ] All routes work (/en, /ar, /products, etc.)
- [ ] API calls work
- [ ] SSL certificate installed (optional)

---

## 🆘 Need More Help?

### Check Server Status

```bash
# System status
systemctl status nginx
pm2 status

# View logs
sudo tail -f /var/log/nginx/access.log
sudo tail -f /var/log/nginx/error.log
pm2 logs

# Check resource usage
htop
df -h
```

### Quick Commands Reference

```bash
# Restart everything
pm2 restart all && sudo systemctl restart nginx

# Stop everything
pm2 stop all && sudo systemctl stop nginx

# View all logs
pm2 logs --lines 100
```

---

## 📝 Summary

**What you did:**

1. ✅ Pointed DNS to your server (Step 1)
2. ✅ Installed Nginx as reverse proxy (Step 2)
3. ✅ Configured Nginx to forward requests (Step 2)
4. ✅ Started apps with PM2 (Step 3)
5. ✅ Tested the setup (Step 4)
6. ✅ Added SSL certificate (Step 5)

**Result:**

- Users visit: **egypt-fisher.com**
- They see: Your Angular app
- URL stays: **egypt-fisher.com** (no redirect!)
- Everything works: Frontend, Backend, API
- Secure: HTTPS enabled
- Reliable: Auto-restarts with PM2

🎉 **Congratulations! Your site is live!**

---

**Last Updated**: October 11, 2025
**Domain**: egypt-fisher.com
**Server IP**: 72.61.18.171

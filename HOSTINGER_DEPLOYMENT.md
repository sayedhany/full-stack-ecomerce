# 🚀 Hostinger VPS Deployment Guide

Complete step-by-step guide to deploy your e-commerce application on Hostinger VPS.

---

## 📋 Prerequisites

- [ ] Hostinger VPS account ([Sign up here](https://www.hostinger.com/vps-hosting))
- [ ] VPS plan (KVM 2 or higher recommended - 2 vCPU, 4GB RAM)
- [ ] Domain name (optional, can use IP address initially)

---

## 💰 Recommended Hostinger VPS Plan

| Plan         | vCPU | RAM  | Storage   | Price   | For                          |
| ------------ | ---- | ---- | --------- | ------- | ---------------------------- |
| KVM 1        | 1    | 4GB  | 50GB SSD  | ~$5/mo  | Testing only                 |
| **KVM 2** ⭐ | 2    | 8GB  | 100GB SSD | ~$8/mo  | **Production (Recommended)** |
| KVM 4        | 4    | 16GB | 200GB SSD | ~$15/mo | High traffic                 |

**Recommendation:** Start with KVM 2 - perfect balance of performance and cost.

---

## 🎯 Step-by-Step Deployment

### Step 1: Access Your Hostinger VPS

#### 1.1 Get Your VPS Credentials

After purchasing Hostinger VPS:

1. Go to [Hostinger hPanel](https://hpanel.hostinger.com)
2. Click on "VPS" in the sidebar
3. Click on your VPS
4. Note down:
   - **IP Address:** (e.g., 123.45.67.89)
   - **SSH Access:** Username and password (or SSH key)
   - **Root Password:** (you may need to set this)

#### 1.2 Connect via SSH

**Option A: Using Hostinger's Browser Terminal**

1. In hPanel, click "Open Browser SSH Terminal"
2. Login with your credentials
3. ✅ You're in!

**Option B: Using Your Computer's Terminal**

**Windows (PowerShell or Git Bash):**

```bash
ssh root@YOUR_VPS_IP
# Example: ssh root@123.45.67.89
# Enter password when prompted
```

**Mac/Linux:**

```bash
ssh root@YOUR_VPS_IP
# Example: ssh root@123.45.67.89
```

---

### Step 2: Update System and Install Docker

Once connected to your VPS, run these commands:

```bash
# Update system packages
apt update && apt upgrade -y

# Install essential tools
apt install -y curl wget git nano ufw

# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sh get-docker.sh

# Install Docker Compose
apt-get install docker-compose-plugin

# Verify installations
docker --version
docker compose version

# Start Docker on boot
systemctl enable docker
systemctl start docker
```

✅ **Expected output:**

```
Docker version 24.x.x
Docker Compose version v2.x.x
```

---

### Step 3: Configure Firewall

```bash
# Configure UFW firewall
ufw allow 22/tcp    # SSH (IMPORTANT: Don't lock yourself out!)
ufw allow 80/tcp    # HTTP
ufw allow 443/tcp   # HTTPS

# Enable firewall
ufw --force enable

# Check status
ufw status
```

✅ **Expected output:**

```
Status: active
To                         Action      From
--                         ------      ----
22/tcp                     ALLOW       Anywhere
80/tcp                     ALLOW       Anywhere
443/tcp                    ALLOW       Anywhere
```

---

### Step 4: Clone Your Application

```bash
# Navigate to home directory
cd ~

# Clone your repository
git clone https://github.com/sayedhany/full-stack-ecomerce.git

# Navigate to project
cd full-stack-ecomerce

# List files to verify
ls -la
```

✅ You should see: `backend/`, `frontend/`, `docker-compose.yml`, etc.

---

### Step 5: Configure Environment Variables

```bash
# Create .env file from example
cp .env.example .env

# Generate a strong JWT secret
openssl rand -base64 32
```

**Copy the generated secret**, then edit `.env`:

```bash
nano .env
```

**Paste this configuration (update the values):**

```env
# MongoDB Configuration
MONGODB_URI=mongodb://admin:YOUR_SECURE_MONGO_PASSWORD@mongodb:27017/egyptfishar?authSource=admin
MONGO_USERNAME=admin
MONGO_PASSWORD=YOUR_SECURE_MONGO_PASSWORD
MONGO_DATABASE=egyptfishar

# Backend Configuration
NODE_ENV=production
PORT=5000

# JWT Configuration (paste the generated secret)
JWT_SECRET=PASTE_YOUR_GENERATED_JWT_SECRET_HERE
JWT_EXPIRE=7d

# CORS Configuration (update with your domain or IP)
ALLOWED_ORIGINS=http://YOUR_VPS_IP,http://yourdomain.com,https://yourdomain.com
```

**Example with real values:**

```env
MONGODB_URI=mongodb://admin:MySecureP@ssw0rd!@mongodb:27017/egyptfishar?authSource=admin
MONGO_USERNAME=admin
MONGO_PASSWORD=MySecureP@ssw0rd!
MONGO_DATABASE=egyptfishar

NODE_ENV=production
PORT=5000

JWT_SECRET=8xKp2vN9mQ4wL5tR1sU7jH3fY6bA0cE9dG8hM2nP5qW1xZ4vB7rT0yU3jI6k
JWT_EXPIRE=7d

ALLOWED_ORIGINS=http://123.45.67.89,http://myshop.com,https://myshop.com
```

**Save and exit:**

- Press `Ctrl + X`
- Press `Y` to confirm
- Press `Enter` to save

---

### Step 6: Deploy Your Application

```bash
# Make sure you're in the project directory
cd ~/full-stack-ecomerce

# Start all services
docker compose up -d

# This will take 5-10 minutes on first run
# Docker will download images and build your application
```

✅ **Wait for the build to complete...**

---

### Step 7: Verify Deployment

```bash
# Check if all services are running
docker compose ps
```

✅ **Expected output (all should show "healthy"):**

```
NAME                    STATUS              PORTS
ecommerce-api          Up (healthy)        0.0.0.0:5000->5000/tcp
ecommerce-db           Up (healthy)        0.0.0.0:27017->27017/tcp
ecommerce-frontend     Up (healthy)        0.0.0.0:4000->4000/tcp
ecommerce-nginx        Up (healthy)        0.0.0.0:80->80/tcp, 443/tcp
```

```bash
# View logs to ensure no errors
docker compose logs -f

# Press Ctrl+C to exit logs
```

---

### Step 8: Access Your Application

🎉 **Your application is now live!**

**Access from anywhere:**

- **Website:** http://YOUR_VPS_IP (e.g., http://123.45.67.89)
- **Backend API:** http://YOUR_VPS_IP:5000/api
- **API Documentation:** http://YOUR_VPS_IP:5000/api-docs

**Example:**
If your Hostinger VPS IP is `123.45.67.89`:

- Website: http://123.45.67.89
- API: http://123.45.67.89:5000/api/health

✅ **Test it:** Open the website on your phone, tablet, or any device!

---

### Step 9: Add Your Domain (Optional but Recommended)

If you have a domain name (e.g., myshop.com):

#### 9.1 Configure DNS in Hostinger

1. Go to [Hostinger hPanel](https://hpanel.hostinger.com)
2. Click "Domains" → Select your domain
3. Click "DNS / Nameservers"
4. Add/Edit these records:

| Type | Name | Points to   | TTL   |
| ---- | ---- | ----------- | ----- |
| A    | @    | YOUR_VPS_IP | 14400 |
| A    | www  | YOUR_VPS_IP | 14400 |

**Example:**
| Type | Name | Points to | TTL |
|------|------|-----------|-----|
| A | @ | 123.45.67.89 | 14400 |
| A | www | 123.45.67.89 | 14400 |

5. Click "Save"
6. Wait 5-30 minutes for DNS propagation

#### 9.2 Install SSL Certificate (HTTPS)

Back in your VPS SSH terminal:

```bash
# Stop Nginx temporarily
docker compose stop nginx

# Install Certbot
apt-get install certbot -y

# Get SSL certificate (replace with your domain)
certbot certonly --standalone -d myshop.com -d www.myshop.com

# Follow the prompts:
# - Enter your email
# - Agree to terms
# - Wait for certificate generation
```

✅ **Certificate saved!** Location: `/etc/letsencrypt/live/myshop.com/`

```bash
# Copy certificates to project
mkdir -p ssl
cp /etc/letsencrypt/live/myshop.com/fullchain.pem ssl/
cp /etc/letsencrypt/live/myshop.com/privkey.pem ssl/

# Edit Nginx configuration
nano backend/nginx-fullstack.conf
```

**Find this section (around line 111) and uncomment it:**

```nginx
# Uncomment this entire section:
server {
    listen 443 ssl http2;
    server_name myshop.com www.myshop.com;  # ← Update with YOUR domain

    ssl_certificate /etc/nginx/ssl/fullchain.pem;
    ssl_certificate_key /etc/nginx/ssl/privkey.pem;
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;
    ssl_prefer_server_ciphers on;

    # Same location blocks as HTTP (copy from above)
    location /api { ... }
    location /uploads { ... }
    location / { ... }
}
```

**Save:** `Ctrl+X`, `Y`, `Enter`

```bash
# Restart services
docker compose start nginx

# Or restart everything
docker compose restart
```

🎉 **Now access:** https://myshop.com (with green padlock 🔒)

#### 9.3 Auto-Renew SSL Certificate

```bash
# Set up automatic renewal
crontab -e

# Choose nano (option 1)
# Add this line at the end:
0 3 * * * certbot renew --quiet && cp /etc/letsencrypt/live/myshop.com/*.pem ~/full-stack-ecomerce/ssl/ && cd ~/full-stack-ecomerce && docker compose restart nginx
```

**Save:** `Ctrl+X`, `Y`, `Enter`

---

## 📊 Monitoring Your Application

### Check Service Status

```bash
# View all services
docker compose ps

# View logs
docker compose logs -f

# View specific service logs
docker compose logs -f ecommerce-backend
docker compose logs -f ecommerce-frontend
```

### Check Resource Usage

```bash
# Check disk space
df -h

# Check memory usage
free -h

# Check Docker resources
docker stats
```

---

## 🔄 Update Your Application

When you make changes and push to GitHub:

```bash
# SSH into your VPS
ssh root@YOUR_VPS_IP

# Navigate to project
cd ~/full-stack-ecomerce

# Pull latest changes
git pull origin master

# Rebuild and restart
docker compose up -d --build

# View logs to ensure no errors
docker compose logs -f
```

---

## 💾 Backup Your Data

### Automated Backup Script

```bash
# Create backup directory
mkdir -p ~/backups

# Create backup script
nano ~/backup.sh
```

**Paste this:**

```bash
#!/bin/bash
DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR=~/backups

# Backup MongoDB
docker exec ecommerce-db mongodump --out=/data/backup/$DATE

# Copy to host
docker cp ecommerce-db:/data/backup/$DATE $BACKUP_DIR/

# Backup uploads
docker cp ecommerce-api:/app/server/uploads $BACKUP_DIR/uploads_$DATE

# Keep only last 7 days
find $BACKUP_DIR -mtime +7 -delete

echo "Backup completed: $DATE"
```

**Save:** `Ctrl+X`, `Y`, `Enter`

```bash
# Make executable
chmod +x ~/backup.sh

# Test it
~/backup.sh

# Set up daily automatic backups at 2 AM
crontab -e

# Add this line:
0 2 * * * ~/backup.sh
```

### Manual Backup

```bash
# Backup MongoDB
docker exec ecommerce-db mongodump --out=/data/backup/manual_backup
docker cp ecommerce-db:/data/backup/manual_backup ~/backups/

# Restore backup
docker cp ~/backups/manual_backup ecommerce-db:/data/backup/restore
docker exec ecommerce-db mongorestore /data/backup/restore
```

---

## 🐛 Troubleshooting

### Services Not Starting

```bash
# Check logs
docker compose logs

# Restart services
docker compose restart

# Rebuild if needed
docker compose down
docker compose up -d --build
```

### Out of Memory

```bash
# Check memory
free -h

# Check what's using memory
docker stats

# Restart services to free memory
docker compose restart
```

### Website Not Accessible

```bash
# Check if services are running
docker compose ps

# Check firewall
ufw status

# Check Nginx logs
docker compose logs nginx

# Test locally
curl http://localhost
```

### Port Already in Use

```bash
# Check what's using port 80
netstat -tlnp | grep :80

# Kill the process (replace PID)
kill -9 PID

# Or restart Docker
systemctl restart docker
docker compose up -d
```

---

## 📈 Performance Optimization

### Enable Swap (if not already enabled)

```bash
# Check if swap exists
swapon --show

# If no output, create swap (4GB)
fallocate -l 4G /swapfile
chmod 600 /swapfile
mkswap /swapfile
swapon /swapfile

# Make permanent
echo '/swapfile none swap sw 0 0' >> /etc/fstab
```

### Monitor Performance

```bash
# Install monitoring tools
apt install htop

# Run htop to see resource usage
htop

# Press F10 to exit
```

---

## 🔐 Security Best Practices

### Change Root Password

```bash
passwd root
# Enter new strong password
```

### Create Non-Root User (Recommended)

```bash
# Create user
adduser deploy

# Add to sudo group
usermod -aG sudo deploy

# Add to docker group
usermod -aG docker deploy

# Switch to new user
su - deploy
```

### Disable Root SSH Login (Optional)

```bash
nano /etc/ssh/sshd_config

# Change this line:
PermitRootLogin no

# Save and restart SSH
systemctl restart sshd
```

---

## 📞 Quick Reference

### Common Commands

```bash
# Start services
docker compose up -d

# Stop services
docker compose down

# Restart services
docker compose restart

# View logs
docker compose logs -f

# Check status
docker compose ps

# Update app
cd ~/full-stack-ecomerce && git pull && docker compose up -d --build

# Backup
~/backup.sh
```

### Important Paths

- **Project:** `~/full-stack-ecomerce/`
- **Env file:** `~/full-stack-ecomerce/.env`
- **SSL certs:** `~/full-stack-ecomerce/ssl/`
- **Backups:** `~/backups/`
- **Nginx config:** `~/full-stack-ecomerce/backend/nginx-fullstack.conf`

### Your Server Info

Fill this out for quick reference:

```
VPS IP: _______________________
Domain: _______________________
SSH Command: ssh root@_______________________
Website URL: http://_______________________
API URL: http://_______________________:5000/api
MongoDB Password: _______________________ (keep secure!)
JWT Secret: _______________________ (keep secure!)
```

---

## 🎉 You're Live on Hostinger!

Your e-commerce application is now running on Hostinger VPS and accessible worldwide!

**Next Steps:**

1. ✅ Test your website from different devices
2. ✅ Set up monitoring (UptimeRobot)
3. ✅ Configure daily backups
4. ✅ Add your domain and SSL
5. ✅ Share your website URL!

---

## 💬 Need Help?

- **Hostinger Support:** Available 24/7 via live chat
- **Docker Issues:** Check `docker compose logs`
- **Application Issues:** Check backend/frontend logs
- **Other Guides:** See `DEPLOYMENT_GUIDE.md` and `ACCESS_GUIDE.md`

---

**Cost Summary:**

- Hostinger VPS KVM 2: ~$8/month
- Domain (optional): ~$10/year
- SSL Certificate: FREE (Let's Encrypt)
- **Total: ~$8-9/month** 🎉

---

Made with ❤️ - Deployed on Hostinger VPS

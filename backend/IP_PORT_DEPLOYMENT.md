# 🌐 IP + Port Deployment Guide

## Deploy Backend Using IP Address and Port (No Domain Required)

This guide shows how to deploy your backend accessible via IP address and port directly.

---

## 🎯 Deployment Options

### Option 1: VPS/Server Deployment (Recommended)

### Option 2: Local Network Deployment

### Option 3: Cloud VM with Public IP

---

## 🖥️ Option 1: VPS/Server Deployment

### Step 1: Get a VPS Server

**Popular VPS Providers:**

- **DigitalOcean Droplet** - $4/month
- **Linode** - $5/month
- **Vultr** - $3.50/month
- **AWS EC2** - Variable pricing
- **Google Cloud VM** - Variable pricing

**Recommended Specs:**

- **CPU:** 1 vCPU
- **RAM:** 1GB (minimum)
- **Storage:** 25GB SSD
- **OS:** Ubuntu 22.04 LTS

### Step 2: Server Setup

```bash
# 1. Connect to your server via SSH
ssh root@YOUR_SERVER_IP

# 2. Update system
apt update && apt upgrade -y

# 3. Install Node.js 20
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
apt install -y nodejs

# 4. Install pnpm
npm install -g pnpm

# 5. Install Git
apt install -y git

# 6. Install Docker (optional)
curl -fsSL https://get.docker.com -o get-docker.sh
sh get-docker.sh

# 7. Install Docker Compose (optional)
apt install -y docker-compose
```

### Step 3: Deploy Your Application

```bash
# 1. Clone your repository
git clone https://github.com/YOUR_USERNAME/YOUR_REPO.git
cd YOUR_REPO/backend

# 2. Install dependencies
pnpm install

# 3. Create production environment file
nano .env
```

Add this to `.env`:

```env
MONGODB_URI=mongodb+srv://sayed591999:sayed591999@cluster0.dwfjqjn.mongodb.net/egyptfishar?retryWrites=true&w=majority&appName=Cluster0
PORT=5000
NODE_ENV=production
JWT_SECRET=your-super-secure-production-jwt-secret-2024
JWT_EXPIRE=7d
```

```bash
# 4. Start the application
pnpm start

# Or run in background with PM2
npm install -g pm2
pm2 start server/server.js --name ecommerce-backend
pm2 startup
pm2 save
```

### Step 4: Configure Firewall

```bash
# Allow SSH (port 22)
ufw allow 22

# Allow your backend port (5000)
ufw allow 5000

# Enable firewall
ufw enable

# Check status
ufw status
```

### Step 5: Access Your API

Your backend will be accessible at:

```
http://YOUR_SERVER_IP:5000
```

**Example URLs:**

```bash
# Health check
curl http://142.93.45.123:5000/api/health

# API documentation
http://142.93.45.123:5000/api-docs

# Products endpoint
curl http://142.93.45.123:5000/api/products

# Register user
curl -X POST http://142.93.45.123:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test","email":"test@example.com","password":"test123"}'
```

---

## 🐳 Option 2: Docker Deployment on VPS

### Step 1: Upload Your Code

```bash
# On your local machine
scp -r backend/ root@YOUR_SERVER_IP:/root/

# SSH to server
ssh root@YOUR_SERVER_IP
cd /root/backend
```

### Step 2: Create Environment File

```bash
# Create .env file
cat > .env << EOF
MONGODB_URI=mongodb+srv://sayed591999:sayed591999@cluster0.dwfjqjn.mongodb.net/egyptfishar?retryWrites=true&w=majority&appName=Cluster0
PORT=5000
NODE_ENV=production
JWT_SECRET=your-super-secure-production-jwt-secret-2024
JWT_EXPIRE=7d
EOF
```

### Step 3: Deploy with Docker

```bash
# Build and run with Docker
docker build -t ecommerce-backend .

# Run container
docker run -d \
  --name ecommerce-api \
  --restart unless-stopped \
  -p 5000:5000 \
  --env-file .env \
  ecommerce-backend

# Check if running
docker ps

# View logs
docker logs -f ecommerce-api
```

### Step 4: Test Deployment

```bash
# Test locally on server
curl http://localhost:5000/api/health

# Test from your computer
curl http://YOUR_SERVER_IP:5000/api/health
```

---

## 🏠 Option 3: Local Network Deployment

### For Local Development/Testing on Your Network

```bash
# 1. Find your local IP
ipconfig  # Windows
# Look for "IPv4 Address" under your network adapter

# 2. Start your backend
cd d:/small-ecommerce/backend
pnpm run dev

# 3. Your API will be accessible from other devices on your network at:
# http://YOUR_LOCAL_IP:5000
# Example: http://192.168.1.50:5000
```

---

## 🔧 Quick VPS Setup Script

Save this as `deploy.sh` and run on your VPS:

```bash
#!/bin/bash

# VPS Deployment Script
echo "🚀 Starting E-commerce Backend Deployment..."

# Update system
apt update && apt upgrade -y

# Install Node.js 20
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
apt install -y nodejs

# Install pnpm and PM2
npm install -g pnpm pm2

# Clone repository (replace with your repo URL)
git clone https://github.com/YOUR_USERNAME/YOUR_REPO.git /opt/ecommerce-backend
cd /opt/ecommerce-backend/backend

# Install dependencies
pnpm install

# Create environment file
cat > .env << EOF
MONGODB_URI=mongodb+srv://sayed591999:sayed591999@cluster0.dwfjqjn.mongodb.net/egyptfishar?retryWrites=true&w=majority&appName=Cluster0
PORT=5000
NODE_ENV=production
JWT_SECRET=your-super-secure-production-jwt-secret-2024
JWT_EXPIRE=7d
EOF

# Configure firewall
ufw allow 22
ufw allow 5000
ufw --force enable

# Start application with PM2
pm2 start server/server.js --name ecommerce-backend
pm2 startup
pm2 save

echo "✅ Deployment complete!"
echo "🌐 Your API is accessible at: http://$(curl -s ifconfig.me):5000"
echo "📚 API Documentation: http://$(curl -s ifconfig.me):5000/api-docs"
```

## 🏃‍♂️ Quick Start Commands

### For VPS Deployment:

```bash
# 1. SSH to your server
ssh root@YOUR_SERVER_IP

# 2. Download and run deployment script
wget https://raw.githubusercontent.com/YOUR_USERNAME/YOUR_REPO/main/deploy.sh
chmod +x deploy.sh
./deploy.sh

# 3. Test your API
curl http://YOUR_SERVER_IP:5000/api/health
```

### For Local Development:

```bash
# 1. Start your backend
cd d:/small-ecommerce/backend
pnpm run dev

# 2. Find your IP address
ipconfig | findstr "IPv4"

# 3. Access from other devices
# http://YOUR_LOCAL_IP:5000
```

---

## 📱 Testing Your Deployment

### From Command Line:

```bash
# Replace IP with your actual server IP
export SERVER_IP="142.93.45.123"
export API_URL="http://$SERVER_IP:5000"

# Test health
curl $API_URL/api/health

# Test registration
curl -X POST $API_URL/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "password": "test123"
  }'

# Test login
curl -X POST $API_URL/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "test123"
  }'

# Get products
curl $API_URL/api/products
```

### From Browser:

```
# API Documentation
http://YOUR_SERVER_IP:5000/api-docs

# Health check
http://YOUR_SERVER_IP:5000/api/health

# Get products
http://YOUR_SERVER_IP:5000/api/products
```

### Update Postman Collection:

1. Open Postman
2. Import your collection
3. Update the `baseUrl` variable to: `http://YOUR_SERVER_IP:5000`
4. Test all endpoints

---

## 🔒 Security for IP-based Deployment

### 1. Firewall Configuration

```bash
# Only allow SSH and your API port
ufw allow 22/tcp
ufw allow 5000/tcp
ufw deny incoming
ufw allow outgoing
ufw enable
```

### 2. Change Default SSH Port (Optional)

```bash
# Edit SSH config
nano /etc/ssh/sshd_config

# Change port 22 to something else, e.g., 2222
Port 2222

# Restart SSH
systemctl restart ssh

# Update firewall
ufw allow 2222/tcp
ufw delete allow 22/tcp
```

### 3. Nginx Reverse Proxy (Optional)

```bash
# Install Nginx
apt install nginx

# Create config
cat > /etc/nginx/sites-available/ecommerce << EOF
server {
    listen 80;
    server_name YOUR_SERVER_IP;

    location / {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_cache_bypass \$http_upgrade;
    }
}
EOF

# Enable site
ln -s /etc/nginx/sites-available/ecommerce /etc/nginx/sites-enabled/
nginx -t
systemctl restart nginx

# Update firewall for HTTP
ufw allow 80/tcp
```

---

## 📊 Popular VPS Providers

| Provider         | Price/Month | Specs           | IP         | Setup Time |
| ---------------- | ----------- | --------------- | ---------- | ---------- |
| **DigitalOcean** | $4          | 1GB RAM, 1 vCPU | Static IP  | 5 min      |
| **Linode**       | $5          | 1GB RAM, 1 vCPU | Static IP  | 5 min      |
| **Vultr**        | $3.50       | 1GB RAM, 1 vCPU | Static IP  | 5 min      |
| **AWS EC2**      | ~$8         | t3.micro        | Elastic IP | 10 min     |
| **Google Cloud** | ~$7         | e2-micro        | Static IP  | 10 min     |

### Recommended: DigitalOcean Droplet

```bash
# Quick setup commands for DigitalOcean:
# 1. Create droplet with Ubuntu 22.04
# 2. SSH: ssh root@YOUR_DROPLET_IP
# 3. Run the deployment script above
# 4. Access: http://YOUR_DROPLET_IP:5000
```

---

## 🎯 Access Your API

Once deployed, your API will be accessible at:

### **Main API URL:**

```
http://YOUR_SERVER_IP:5000
```

### **Key Endpoints:**

```
Health Check:    http://YOUR_SERVER_IP:5000/api/health
API Docs:        http://YOUR_SERVER_IP:5000/api-docs
Products:        http://YOUR_SERVER_IP:5000/api/products
Categories:      http://YOUR_SERVER_IP:5000/api/categories
Auth:            http://YOUR_SERVER_IP:5000/api/auth
```

### **Examples with Real IP:**

```bash
# If your server IP is 142.93.45.123
curl http://142.93.45.123:5000/api/health
curl http://142.93.45.123:5000/api/products

# View in browser
http://142.93.45.123:5000/api-docs
```

---

## ✅ Deployment Checklist

### Pre-Deployment:

- [ ] VPS server ready (Ubuntu 22.04 recommended)
- [ ] SSH access to server
- [ ] GitHub repository with your code
- [ ] MongoDB Atlas connection string
- [ ] Strong JWT secret for production

### Deployment Steps:

- [ ] Connect to server via SSH
- [ ] Install Node.js 20 and pnpm
- [ ] Clone your repository
- [ ] Install dependencies
- [ ] Create production .env file
- [ ] Configure firewall (allow port 5000)
- [ ] Start application with PM2
- [ ] Test endpoints

### Post-Deployment:

- [ ] Verify health endpoint works
- [ ] Test user registration/login
- [ ] Create admin user
- [ ] Test file uploads
- [ ] Update Postman collection with server IP
- [ ] Monitor logs for errors

---

## 🔄 Continuous Deployment

### Auto-deploy on code changes:

```bash
# Create deployment script on server
cat > /opt/ecommerce-backend/update.sh << EOF
#!/bin/bash
cd /opt/ecommerce-backend/backend
git pull origin main
pnpm install
pm2 restart ecommerce-backend
echo "✅ Deployment updated!"
EOF

chmod +x /opt/ecommerce-backend/update.sh

# Run whenever you want to update
/opt/ecommerce-backend/update.sh
```

### Or set up webhook for auto-deploy:

```bash
# Install webhook listener
npm install -g webhook

# Create webhook endpoint to auto-deploy on git push
# (Advanced setup - requires GitHub webhook configuration)
```

---

## 🎉 You're Live!

Your e-commerce backend is now accessible via IP address and port:

**🌐 API URL:** `http://YOUR_SERVER_IP:5000`  
**📚 Documentation:** `http://YOUR_SERVER_IP:5000/api-docs`  
**✅ Health Check:** `http://YOUR_SERVER_IP:5000/api/health`

**No domain needed - just IP and port!** 🚀

### Next Steps:

1. **Test all endpoints** with Postman
2. **Create admin user** for content management
3. **Set up monitoring** (PM2 provides basic monitoring)
4. **Configure backups** (MongoDB Atlas handles database backups)
5. **Scale horizontally** when needed (add more servers)

**Perfect for MVP, development, or when you don't need a custom domain!**

# 🚀 Full-Stack E-commerce Deployment Guide

Complete Docker deployment guide for your Angular + Node.js + MongoDB e-commerce application.

---

## 📦 What's Included

Your application now has complete Docker support:

- ✅ **Backend Dockerfile** (Node.js + Express API)
- ✅ **Frontend Dockerfile** (Angular 18 with SSR)
- ✅ **Docker Compose** (Full stack orchestration)
- ✅ **Nginx Reverse Proxy** (Production-ready routing)
- ✅ **MongoDB** (Database with initialization)
- ✅ **Health Checks** (All services monitored)
- ✅ **Volume Persistence** (Data & uploads saved)

---

## 🎯 Quick Start (Local Testing)

### Prerequisites

- Docker Desktop installed ([Download](https://www.docker.com/products/docker-desktop))
- Git Bash or WSL2 (Windows)

### 1. Setup Environment Variables

```bash
# Copy example environment file
cp .env.example .env

# Edit .env with your values (use nano, vim, or any text editor)
nano .env
```

**Important:** Change the `JWT_SECRET` to a strong random string!

```bash
# Generate a secure JWT secret (Git Bash/WSL)
openssl rand -base64 32
```

### 2. Start All Services

```bash
# Build and start everything (first time will take 5-10 minutes)
docker-compose up -d

# View logs
docker-compose logs -f

# Check status
docker-compose ps
```

### 3. Access Your Application (Local Testing Only)

**On the same computer:**

- **Frontend:** http://localhost (via Nginx) or http://localhost:4000 (direct)
- **Backend API:** http://localhost:5000/api
- **Swagger Docs:** http://localhost:5000/api-docs
- **MongoDB:** localhost:27017

**From other devices on the same network:**

- Find your computer's IP address:
  - Windows: Run `ipconfig` → look for IPv4 Address (e.g., 192.168.1.100)
  - Mac/Linux: Run `ifconfig` or `ip addr` → look for inet (e.g., 192.168.1.100)
- Access from other devices:
  - **Frontend:** http://YOUR_IP (e.g., http://192.168.1.100)
  - **Backend API:** http://YOUR_IP:5000/api

**⚠️ Note:** This is for local testing only. For production (accessible from internet), deploy to a cloud server (see Cloud Deployment Options below).

### 4. Stop Services

```bash
# Stop all services
docker-compose down

# Stop and remove volumes (⚠️ deletes all data)
docker-compose down -v
```

---

## 🌐 Cloud Deployment Options

### Option 1: Hostinger VPS (Recommended for Beginners) ⭐

**Best for:** Affordable, easy to use, great support

**Quick Setup:**
See detailed guide: **[HOSTINGER_DEPLOYMENT.md](./HOSTINGER_DEPLOYMENT.md)**

1. Get Hostinger VPS (~$8/month)
2. SSH into server
3. Install Docker
4. Clone repository
5. Start services
6. Access at your VPS IP

**Estimated Cost:** $8-15/month

---

### Option 2: AWS EC2 / DigitalOcean Droplet

**Step 1: Provision Server**

```bash
# Choose a provider:
# - AWS EC2 t3.medium (2 vCPU, 4GB RAM) - ~$30/month
# - DigitalOcean Droplet (2 vCPU, 4GB RAM) - $24/month
# - Linode (2 vCPU, 4GB RAM) - $24/month

# OS: Ubuntu 22.04 LTS
```

**Step 2: Connect & Install Docker**

```bash
# SSH into your server
ssh root@your-server-ip

# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sh get-docker.sh

# Install Docker Compose
apt-get update
apt-get install docker-compose-plugin

# Verify installation
docker --version
docker compose version
```

**Step 3: Deploy Your App**

```bash
# Clone your repository
git clone https://github.com/sayedhany/full-stack-ecomerce.git
cd full-stack-ecomerce

# Create .env file
nano .env
# Paste your production environment variables

# Generate strong JWT secret
openssl rand -base64 32

# Start services
docker compose up -d

# View logs
docker compose logs -f
```

**Step 3.5: Access Your Application**

Your application is now accessible from anywhere on the internet!

- **Frontend:** http://YOUR_SERVER_IP (e.g., http://123.45.67.89)
- **Backend API:** http://YOUR_SERVER_IP:5000/api
- **Swagger Docs:** http://YOUR_SERVER_IP:5000/api-docs

**Example:**
If your server IP is `123.45.67.89`, anyone can access:

- Website: http://123.45.67.89
- API: http://123.45.67.89:5000/api

Share this IP with anyone, and they can access your website from their phone, tablet, or computer!

**Step 4: Configure Domain (Optional)**

```bash
# Point your domain to server IP (A record)
# Example: yourdomain.com -> 123.456.789.0

# Install Certbot for SSL
apt-get install certbot

# Get SSL certificate
certbot certonly --standalone -d yourdomain.com -d www.yourdomain.com

# Copy certificates
mkdir -p ssl
cp /etc/letsencrypt/live/yourdomain.com/fullchain.pem ssl/
cp /etc/letsencrypt/live/yourdomain.com/privkey.pem ssl/

# Update nginx-fullstack.conf (uncomment HTTPS section)
nano backend/nginx-fullstack.conf

# Restart services
docker compose restart nginx
```

---

### Option 2: AWS Elastic Container Service (ECS)

**Best for:** Auto-scaling, managed infrastructure

1. Push images to Amazon ECR (Elastic Container Registry)
2. Create ECS cluster
3. Define task definitions for each service
4. Configure load balancer
5. Set up RDS for MongoDB (or use MongoDB Atlas)

**Estimated Cost:** $50-100/month (depending on traffic)

---

### Option 3: Google Cloud Run

**Best for:** Serverless, pay-per-use

1. Build and push images to Google Container Registry
2. Deploy each service to Cloud Run
3. Use Cloud SQL or MongoDB Atlas
4. Configure Cloud Load Balancer

**Estimated Cost:** $10-50/month (low traffic)

---

### Option 4: Azure Container Instances

**Best for:** Simple deployment, Microsoft ecosystem

1. Push images to Azure Container Registry
2. Create container instances
3. Use Azure Cosmos DB or MongoDB Atlas
4. Configure Azure Application Gateway

**Estimated Cost:** $30-80/month

---

### Option 5: Heroku (Easiest)

**Best for:** Quick deployment, no DevOps knowledge needed

```bash
# Install Heroku CLI
curl https://cli-assets.heroku.com/install.sh | sh

# Login
heroku login

# Create apps
heroku create your-app-backend
heroku create your-app-frontend

# Add MongoDB
heroku addons:create mongolab:sandbox -a your-app-backend

# Deploy backend
cd backend
git init
heroku git:remote -a your-app-backend
git add .
git commit -m "Deploy backend"
git push heroku master

# Deploy frontend (similar process)
cd ../frontend
# ... repeat steps
```

**Estimated Cost:** $7-25/month

---

### Option 6: Railway.app (Ultra Simple)

**Best for:** Fastest deployment, GitHub integration

1. Go to [railway.app](https://railway.app)
2. Connect GitHub repository
3. Railway auto-detects Docker configuration
4. Add MongoDB service
5. Deploy with one click

**Estimated Cost:** $5-20/month

---

## 🔐 Production Checklist

Before deploying to production, ensure:

- [ ] Strong `JWT_SECRET` generated
- [ ] MongoDB password changed from default
- [ ] `NODE_ENV=production` set
- [ ] SSL certificate configured (HTTPS)
- [ ] Firewall configured (only ports 80, 443 open)
- [ ] Regular backups enabled
- [ ] Monitoring set up (Uptime Robot, DataDog, etc.)
- [ ] Domain configured with DNS
- [ ] CORS origins updated for production domains
- [ ] API rate limiting enabled
- [ ] Database indexes created
- [ ] Error logging configured

---

## 📊 Monitoring & Maintenance

### View Logs

```bash
# All services
docker compose logs -f

# Specific service
docker compose logs -f ecommerce-backend
docker compose logs -f ecommerce-frontend
```

### Restart Services

```bash
# Restart all
docker compose restart

# Restart specific service
docker compose restart ecommerce-backend
```

### Update Application

```bash
# Pull latest code
git pull origin master

# Rebuild and restart
docker compose up -d --build

# Remove old images
docker image prune -f
```

### Backup Database

```bash
# Backup MongoDB
docker exec ecommerce-db mongodump --out=/data/backup

# Copy backup to host
docker cp ecommerce-db:/data/backup ./mongodb-backup-$(date +%Y%m%d)

# Restore backup
docker exec ecommerce-db mongorestore /data/backup
```

---

## 🐛 Troubleshooting

### Services won't start

```bash
# Check logs
docker compose logs

# Check service status
docker compose ps

# Restart services
docker compose restart
```

### Port already in use

```bash
# Find process using port 80
netstat -ano | findstr :80

# Kill process (Windows)
taskkill /PID <PID> /F

# Change ports in docker-compose.yml if needed
```

### MongoDB connection issues

```bash
# Check MongoDB logs
docker compose logs mongodb

# Verify connection string in .env
# Ensure MongoDB is healthy
docker compose ps mongodb
```

### Frontend can't reach backend

```bash
# Check network
docker network inspect ecommerce-network

# Verify API_URL environment variable
docker compose config

# Check backend health
curl http://localhost:5000/api/health
```

---

## 💰 Cost Comparison

| Platform     | Easy Setup | Monthly Cost | Scaling     | Support   |
| ------------ | ---------- | ------------ | ----------- | --------- |
| Railway.app  | ⭐⭐⭐⭐⭐ | $5-20        | Auto        | Good      |
| Heroku       | ⭐⭐⭐⭐⭐ | $7-25        | Manual      | Excellent |
| DigitalOcean | ⭐⭐⭐⭐   | $24+         | Manual      | Good      |
| AWS EC2      | ⭐⭐⭐     | $30+         | Manual/Auto | Excellent |
| AWS ECS      | ⭐⭐       | $50+         | Auto        | Excellent |
| Google Cloud | ⭐⭐⭐     | $10-50       | Auto        | Good      |

---

## 📞 Support

### Common Commands Cheat Sheet

```bash
# Start services
docker compose up -d

# Stop services
docker compose down

# View logs
docker compose logs -f

# Rebuild after code changes
docker compose up -d --build

# Check service status
docker compose ps

# Access container shell
docker exec -it ecommerce-backend sh
docker exec -it ecommerce-frontend sh

# Clean everything
docker compose down -v
docker system prune -a
```

### Getting Help

- Docker Documentation: https://docs.docker.com
- Docker Compose: https://docs.docker.com/compose
- MongoDB Docker: https://hub.docker.com/_/mongo
- Nginx: https://nginx.org/en/docs

---

## 🎉 You're Ready!

Your application is now ready for deployment. Choose your preferred platform and follow the steps above.

**Recommended Path:**

1. Test locally with `docker-compose up -d`
2. Deploy to Railway.app or Heroku for quick launch
3. Migrate to DigitalOcean/AWS as you scale

Good luck with your deployment! 🚀

# 🎯 Production Deployment Quick Reference

This is a simplified checklist focused on **production deployment only** (no localhost testing).

---

## 🚀 Choose Your Deployment Platform

Pick ONE option below based on your needs:

### Option 1: Hostinger VPS ⭐ (BEST VALUE - Recommended)

**Time:** 30 minutes | **Cost:** $8-15/month | **Difficulty:** ⭐⭐

**Complete step-by-step guide:** [HOSTINGER_DEPLOYMENT.md](./HOSTINGER_DEPLOYMENT.md)

- [ ] Get Hostinger VPS (KVM 2 plan recommended)
- [ ] SSH into your server
- [ ] Install Docker and Docker Compose
- [ ] Clone repository and configure .env
- [ ] Start services with `docker compose up -d`
- [ ] Access at your VPS IP address
- [ ] (Optional) Add domain and SSL certificate

**Why Hostinger VPS?**

- ✅ Affordable ($8/month for production-ready server)
- ✅ Easy-to-use hPanel
- ✅ 24/7 support
- ✅ Good performance
- ✅ One-click VPS creation

---

### Option 2: Railway.app (EASIEST - No server management)

**Time:** 10 minutes | **Cost:** $5-20/month | **Difficulty:** ⭐

- [ ] Create account at [railway.app](https://railway.app)
- [ ] Connect GitHub repository
- [ ] Deploy with one click
- [ ] Add environment variables in Railway dashboard
- [ ] Get your deployment URL (e.g., `your-app.railway.app`)

---

### Option 2: Render.com (Easy with free tier)

**Time:** 20 minutes | **Cost:** Free-$25/month | **Difficulty:** ⭐⭐

- [ ] Create account at [render.com](https://render.com)
- [ ] Create "Web Service" for backend (root: `backend`)
- [ ] Create "Web Service" for frontend (root: `frontend`)
- [ ] Add MongoDB Atlas (free tier)
- [ ] Set environment variables for each service
- [ ] Get your deployment URLs

---

### Option 4: Other VPS Providers (DigitalOcean, AWS, Linode, etc.)

**Time:** 1 hour | **Cost:** $24-30/month | **Difficulty:** ⭐⭐⭐

#### Step 1: Create Server

- [ ] Choose provider: DigitalOcean, AWS EC2, or Linode
- [ ] Select Ubuntu 22.04 LTS
- [ ] Choose size: 2 vCPU, 4GB RAM minimum
- [ ] Note your server IP address: `_______________`

#### Step 2: SSH and Install Docker

```bash
# Connect to your server
ssh root@YOUR_SERVER_IP

# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sh get-docker.sh

# Install Docker Compose
apt-get update && apt-get install docker-compose-plugin

# Verify installation
docker --version
docker compose version
```

- [ ] Docker installed successfully

#### Step 3: Deploy Application

```bash
# Clone your repository
git clone https://github.com/sayedhany/full-stack-ecomerce.git
cd full-stack-ecomerce

# Create production .env file
nano .env
```

**Paste this into .env (update the values):**

```env
# MongoDB (use MongoDB Atlas or change password!)
MONGODB_URI=mongodb://admin:CHANGE_THIS_PASSWORD@mongodb:27017/egyptfishar?authSource=admin
MONGO_USERNAME=admin
MONGO_PASSWORD=CHANGE_THIS_PASSWORD
MONGO_DATABASE=egyptfishar

# Backend
NODE_ENV=production
PORT=5000

# JWT - GENERATE A SECURE SECRET!
# Run: openssl rand -base64 32
JWT_SECRET=PASTE_YOUR_GENERATED_SECRET_HERE
JWT_EXPIRE=7d

# CORS - Add your domain
ALLOWED_ORIGINS=http://YOUR_SERVER_IP,http://YOUR_DOMAIN.com
```

```bash
# Generate JWT secret
openssl rand -base64 32
# Copy the output and paste it into .env as JWT_SECRET

# Start all services
docker compose up -d

# Check if everything is running
docker compose ps

# View logs
docker compose logs -f
```

- [ ] All services running (should show "healthy")
- [ ] No errors in logs

#### Step 4: Access Your Application

- [ ] Frontend: `http://YOUR_SERVER_IP`
- [ ] Backend API: `http://YOUR_SERVER_IP/api/health`
- [ ] Swagger Docs: `http://YOUR_SERVER_IP/api-docs`

#### Step 5 (Optional): Add Domain & SSL

```bash
# Stop nginx temporarily
docker compose stop nginx

# Install Certbot
apt-get install certbot

# Get SSL certificate (replace with your domain)
certbot certonly --standalone -d yourdomain.com -d www.yourdomain.com

# Copy certificates
mkdir -p ssl
cp /etc/letsencrypt/live/yourdomain.com/fullchain.pem ssl/
cp /etc/letsencrypt/live/yourdomain.com/privkey.pem ssl/

# Edit nginx config
nano backend/nginx-fullstack.conf
# Uncomment the HTTPS section (around line 111)
# Update "server_name yourdomain.com;"

# Restart nginx
docker compose start nginx
```

- [ ] HTTPS working at `https://yourdomain.com`

---

## ✅ Production Testing

Once deployed, verify these work:

- [ ] ✅ Website loads at your production URL
- [ ] ✅ Can register a new user
- [ ] ✅ Can login
- [ ] ✅ Products display correctly
- [ ] ✅ Categories work
- [ ] ✅ Admin panel accessible
- [ ] ✅ Can upload product images
- [ ] ✅ Language switch works (EN/AR)
- [ ] ✅ Mobile responsive

---

## 🔒 Security (IMPORTANT!)

Before going live:

- [ ] Changed MongoDB password from default
- [ ] Generated strong JWT_SECRET (32+ characters)
- [ ] Updated ALLOWED_ORIGINS with your production domain
- [ ] HTTPS enabled (if using custom domain)
- [ ] Firewall configured (only ports 80, 443 open)

---

## 📊 Monitoring Setup

Sign up for free monitoring:

- [ ] [UptimeRobot](https://uptimerobot.com) - Monitor if site is up
  - Add monitor for your main URL
  - Add monitor for `/api/health`
  - Set up email alerts

---

## 💾 Backup (Recommended)

```bash
# SSH into your server
ssh root@YOUR_SERVER_IP

# Create backup script
nano backup.sh
```

Paste this:

```bash
#!/bin/bash
DATE=$(date +%Y%m%d_%H%M%S)
docker exec ecommerce-db mongodump --out=/data/backup/$DATE
docker cp ecommerce-db:/data/backup/$DATE ./backups/
echo "Backup created: $DATE"
```

```bash
# Make it executable
chmod +x backup.sh

# Run it
./backup.sh

# Set up daily backups (optional)
crontab -e
# Add this line: 0 2 * * * /root/full-stack-ecomerce/backup.sh
```

- [ ] Backup script created
- [ ] Tested backup successfully

---

## 🆘 Quick Commands

```bash
# View all services status
docker compose ps

# View logs
docker compose logs -f

# Restart everything
docker compose restart

# Update app (after git push)
git pull origin master
docker compose up -d --build

# Stop everything
docker compose down

# Clean everything (⚠️ deletes data!)
docker compose down -v
```

---

## 📝 Save This Information

**Production Details:**

- Server IP: `_______________`
- Domain: `_______________`
- Frontend URL: `_______________`
- Backend API: `_______________/api`
- Swagger Docs: `_______________/api-docs`
- MongoDB URI: `_______________`
- SSH Command: `ssh root@_______________`
- Deployment Date: `_______________`

---

## 🎉 You're Live!

Your e-commerce application is now deployed and accessible to the world!

**Next Steps:**

1. Share your URL with users
2. Monitor for the first 24 hours
3. Set up automated backups
4. Consider adding a custom domain
5. Enable HTTPS with SSL certificate

---

## 💡 Cost Comparison

| Platform     | Setup Time | Monthly Cost | Best For                 |
| ------------ | ---------- | ------------ | ------------------------ |
| Railway.app  | 10 min     | $5-20        | Beginners, quick deploy  |
| Render.com   | 20 min     | Free-$25     | Testing, small projects  |
| DigitalOcean | 1 hour     | $24          | Full control, production |
| AWS EC2      | 1 hour     | $30+         | Enterprise, scaling      |

---

**Need help?** Check the full guide: [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md)

# 🎯 Deployment Checklist

Use this checklist to ensure a smooth deployment.

---

## ✅ Pre-Deployment (Local Testing)

- [ ] Docker Desktop installed and running
- [ ] Git repository cloned
- [ ] `.env` file created from `.env.example`
- [ ] JWT_SECRET generated and added to `.env`
- [ ] MongoDB credentials updated in `.env`
- [ ] Run `docker compose up -d` successfully
- [ ] Frontend accessible (default: http://localhost or http://localhost:4000)
- [ ] Backend API accessible (default: http://localhost:5000/api)
- [ ] Test API endpoints with Swagger (default: http://localhost:5000/api-docs)
- [ ] Create test products and categories
- [ ] Verify image uploads work
- [ ] Test both English and Arabic languages
- [ ] Verify admin functionality works
- [ ] All services healthy: `docker compose ps`

---

## 🌐 Cloud Deployment Preparation

### 1. Choose Your Platform

Select one of these options:

**Easiest Options (Recommended for beginners):**

- [ ] Railway.app - Auto-deployment from GitHub
- [ ] Render.com - Free tier available
- [ ] Heroku - Simple CLI deployment

**VPS Options (More control):**

- [ ] DigitalOcean Droplet
- [ ] AWS EC2
- [ ] Linode
- [ ] Vultr

**Serverless Options:**

- [ ] Google Cloud Run
- [ ] AWS Fargate
- [ ] Azure Container Instances

### 2. Domain & SSL (Optional but Recommended)

- [ ] Domain name purchased (Namecheap, Google Domains, etc.)
- [ ] DNS configured to point to server IP
- [ ] SSL certificate obtained (Let's Encrypt/Certbot)
- [ ] SSL certificates copied to `ssl/` folder
- [ ] Nginx HTTPS section uncommented in `nginx-fullstack.conf`

### 3. Database Setup

Choose one:

**Option A: Use Docker MongoDB (Included)**

- [ ] Change default MongoDB password in `.env`
- [ ] Set up MongoDB backups

**Option B: Use MongoDB Atlas (Cloud, Recommended)**

- [ ] Create MongoDB Atlas account
- [ ] Create free cluster
- [ ] Get connection string
- [ ] Update `MONGODB_URI` in `.env`
- [ ] Whitelist server IP

### 4. Security Configuration

- [ ] Generate strong JWT_SECRET (32+ characters)
- [ ] Change all default passwords
- [ ] Update `ALLOWED_ORIGINS` in `.env` with production domains
- [ ] Configure firewall rules (only ports 80, 443 open)
- [ ] Enable fail2ban or similar protection
- [ ] Set up monitoring (UptimeRobot, Pingdom, etc.)
- [ ] Configure backup strategy

---

## 🚀 Deployment Steps

### For VPS (DigitalOcean, AWS EC2, Linode, etc.)

#### Step 1: Server Setup

- [ ] Server created (Ubuntu 22.04 LTS recommended)
- [ ] SSH access configured
- [ ] Firewall configured (UFW or Security Groups)
- [ ] Non-root user created (optional but recommended)

#### Step 2: Install Docker

```bash
# SSH into server
ssh root@your-server-ip

# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sh get-docker.sh

# Install Docker Compose
apt-get update
apt-get install docker-compose-plugin

# Verify
docker --version
docker compose version
```

- [ ] Docker installed successfully
- [ ] Docker Compose installed successfully

#### Step 3: Deploy Application

```bash
# Clone repository
git clone https://github.com/sayedhany/full-stack-ecomerce.git
cd full-stack-ecomerce

# Create .env file
nano .env
# (Paste your production environment variables)

# Start services
docker compose up -d

# Check logs
docker compose logs -f
```

- [ ] Repository cloned
- [ ] `.env` file configured with production values
- [ ] Services started successfully
- [ ] All containers healthy

#### Step 4: Configure Domain & SSL

```bash
# Install Certbot
apt-get install certbot

# Get SSL certificate
certbot certonly --standalone -d yourdomain.com -d www.yourdomain.com

# Copy certificates
mkdir -p ssl
cp /etc/letsencrypt/live/yourdomain.com/fullchain.pem ssl/
cp /etc/letsencrypt/live/yourdomain.com/privkey.pem ssl/

# Update Nginx config
nano backend/nginx-fullstack.conf
# (Uncomment HTTPS section and update domain)

# Restart Nginx
docker compose restart nginx
```

- [ ] SSL certificate obtained
- [ ] Nginx configured for HTTPS
- [ ] HTTPS working at https://yourdomain.com

### For Railway.app (Easiest)

- [ ] Create Railway.app account
- [ ] Connect GitHub repository
- [ ] Railway auto-detects Docker configuration
- [ ] Add MongoDB service (or use MongoDB Atlas)
- [ ] Set environment variables in Railway dashboard
- [ ] Deploy with one click
- [ ] Access deployment URL
- [ ] Custom domain configured (optional)

### For Render.com

- [ ] Create Render.com account
- [ ] Create "New Web Service" for backend
- [ ] Connect GitHub repository
- [ ] Set root directory: `backend`
- [ ] Build command: `docker build -t backend .`
- [ ] Start command: `docker run backend`
- [ ] Add environment variables
- [ ] Create "New Web Service" for frontend
- [ ] Repeat for frontend with directory: `frontend`
- [ ] Add MongoDB (MongoDB Atlas recommended)
- [ ] Services deployed and accessible

---

## 🧪 Post-Deployment Testing

- [ ] Visit production URL (e.g., https://yourdomain.com or your cloud provider URL)
- [ ] Frontend loads correctly
- [ ] API health check responds: `/api/health`
- [ ] Swagger docs accessible: `/api-docs`
- [ ] Login/Register works
- [ ] Product listing works
- [ ] Category filtering works
- [ ] Admin panel accessible
- [ ] Image uploads work
- [ ] Both languages (English/Arabic) work
- [ ] Mobile responsive design works
- [ ] HTTPS (SSL) working with green padlock
- [ ] No console errors
- [ ] Load time acceptable

---

## 📊 Monitoring & Maintenance

### Setup Monitoring

- [ ] Create UptimeRobot account (free)
- [ ] Add monitor for main URL
- [ ] Add monitor for API health endpoint
- [ ] Configure alert notifications (email/SMS)
- [ ] Set up error logging (Sentry, LogRocket, etc.)
- [ ] Configure performance monitoring

### Regular Maintenance

- [ ] Set up automated backups (daily recommended)
- [ ] Test backup restoration process
- [ ] Update dependencies monthly
- [ ] Check Docker images for security updates
- [ ] Monitor disk space usage
- [ ] Review logs for errors
- [ ] Monitor resource usage (CPU, RAM, disk)

### Backup Strategy

- [ ] Database backups configured
- [ ] Uploads folder backups configured
- [ ] Backup storage location decided (S3, Backblaze, etc.)
- [ ] Backup retention policy defined
- [ ] Restoration process documented and tested

---

## 🔒 Security Hardening

- [ ] Change all default credentials
- [ ] JWT_SECRET is strong and unique
- [ ] HTTPS enforced
- [ ] CORS configured correctly
- [ ] Rate limiting enabled
- [ ] SQL injection protection (Mongoose handles this)
- [ ] XSS protection headers set
- [ ] CSRF protection implemented
- [ ] File upload validation working
- [ ] Maximum file size limits set
- [ ] Firewall rules configured
- [ ] SSH key authentication enabled (disable password auth)
- [ ] Fail2ban installed and configured
- [ ] Regular security updates scheduled

---

## 📈 Performance Optimization

- [ ] Nginx gzip compression enabled
- [ ] Static assets cached
- [ ] CDN configured (CloudFlare, AWS CloudFront, etc.)
- [ ] Image compression working
- [ ] Database indexes created
- [ ] API response times acceptable
- [ ] Frontend bundle size optimized
- [ ] Lazy loading implemented
- [ ] Server resources adequate for traffic

---

## 💰 Cost Management

- [ ] Server size appropriate for traffic
- [ ] Auto-scaling configured (if using cloud platform)
- [ ] Resource alerts set up
- [ ] Unnecessary services disabled
- [ ] Database size monitored
- [ ] Log rotation configured
- [ ] Backup costs considered

---

## 📞 Support & Documentation

- [ ] API documentation updated
- [ ] Deployment documentation complete
- [ ] Troubleshooting guide created
- [ ] Team trained on deployment process
- [ ] Emergency contact list created
- [ ] Support email/system configured
- [ ] Status page created (optional)

---

## 🎉 Go Live!

Once all items are checked:

- [ ] Announce launch
- [ ] Monitor closely for first 24-48 hours
- [ ] Be ready to rollback if needed
- [ ] Collect user feedback
- [ ] Plan for future iterations

---

## 🆘 Emergency Contacts & Commands

### Quick Recovery Commands

```bash
# Rollback to previous version
git checkout <previous-commit>
docker compose up -d --build

# Restore database backup
docker exec ecommerce-db mongorestore /data/backup/<date>

# View recent errors
docker compose logs --tail=100 ecommerce-backend
docker compose logs --tail=100 ecommerce-frontend

# Restart services
docker compose restart

# Check resource usage
docker stats
```

### Important URLs

- Repository: https://github.com/sayedhany/full-stack-ecomerce
- Production URL: ******\_\_\_******
- Admin Panel: ******\_\_\_******
- API Docs: ******\_\_\_******/api-docs
- Monitoring: ******\_\_\_******
- Server IP: ******\_\_\_******

### Credentials (Keep Secure!)

- Server SSH: ******\_\_\_******
- MongoDB URI: ******\_\_\_******
- Admin Email: ******\_\_\_******
- SSL Cert Location: ******\_\_\_******

---

## ✅ Final Check

Before marking complete:

- [ ] All sections above completed
- [ ] Application accessible and working
- [ ] Monitoring in place
- [ ] Backups configured
- [ ] Team trained
- [ ] Documentation updated
- [ ] Emergency procedures in place

---

**Deployment Date:** ******\_\_\_******  
**Deployed By:** ******\_\_\_******  
**Platform:** ******\_\_\_******  
**Production URL:** ******\_\_\_******

---

🎉 **Congratulations on your deployment!** 🎉

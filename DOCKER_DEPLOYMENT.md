# Egypt Fisher E-Commerce - Docker Deployment

> **Domain**: egypt-fisher.com  
> **Server**: 72.61.18.171  
> **Deployment**: Docker Compose

---

## 🚀 Quick Start (3 Steps)

### 1. Update DNS at Hostinger

```
A    @      72.61.18.171
A    www    72.61.18.171
```

### 2. Deploy with Docker

```bash
cd /root/full-stack-ecomerce
chmod +x quick-docker-deploy.sh
./quick-docker-deploy.sh
```

### 3. Test

```bash
curl -I http://egypt-fisher.com
```

**Done!** Your site is live at http://egypt-fisher.com 🎉

---

## 📋 What's Included

This Docker deployment includes:

- **Nginx** - Reverse proxy (port 80/443)
- **Frontend** - Angular SSR (port 4000)
- **Backend** - Node.js API (port 5000)
- **MongoDB** - Database (port 27017)

### Architecture

```
Internet → egypt-fisher.com
    ↓
Nginx Container (Port 80)
    ↓
    ├→ Frontend Container (Angular SSR)
    └→ Backend Container (Node.js API)
           ↓
       MongoDB Container
```

---

## 🛠️ Management Commands

### Deploy/Update

```bash
./quick-docker-deploy.sh
```

### Check Status

```bash
docker compose ps
```

### View Logs

```bash
# All services
docker compose logs -f

# Specific service
docker compose logs -f nginx
docker compose logs -f frontend
docker compose logs -f backend
```

### Restart

```bash
# Restart all
docker compose restart

# Restart specific service
docker compose restart nginx
docker compose restart frontend
docker compose restart backend
```

### Stop

```bash
docker compose down
```

### Start

```bash
docker compose up -d
```

---

## 🔒 SSL Setup (HTTPS)

After DNS is working:

```bash
# Stop Docker
docker compose down

# Install Certbot
apt install certbot -y

# Get SSL certificate
certbot certonly --standalone \
  -d egypt-fisher.com \
  -d www.egypt-fisher.com

# Certificates will be saved to:
# /etc/letsencrypt/live/egypt-fisher.com/fullchain.pem
# /etc/letsencrypt/live/egypt-fisher.com/privkey.pem
```

Then update `backend/nginx-fullstack.conf` to include SSL configuration (see SSL_SETUP.md).

---

## 📁 Project Structure

```
small-ecommerce/
├── docker-compose.yml          # Main Docker orchestration
├── quick-docker-deploy.sh      # Deployment script
├── backend/
│   ├── Dockerfile
│   ├── nginx-fullstack.conf    # Nginx configuration
│   └── server/
├── frontend/
│   ├── Dockerfile
│   └── src/
└── docs/
    ├── QUICK_START.md
    ├── HOSTINGER_SETUP_GUIDE.md
    └── DNS_SETUP_GUIDE.md
```

---

## 🔍 Troubleshooting

### Container won't start

```bash
docker compose logs <container-name>
```

### Port 80 in use

```bash
# Stop conflicting services
systemctl stop nginx
pm2 stop all

# Free port
fuser -k 80/tcp
```

### DNS not working

```bash
# Check DNS resolution
nslookup egypt-fisher.com

# Should return: 72.61.18.171
```

### API not responding

```bash
# Check backend logs
docker compose logs backend

# Restart backend
docker compose restart backend
```

---

## 📚 Documentation

- **[QUICK_START.md](./QUICK_START.md)** - Fastest deployment guide
- **[HOSTINGER_SETUP_GUIDE.md](./HOSTINGER_SETUP_GUIDE.md)** - Complete Hostinger guide
- **[DNS_SETUP_GUIDE.md](./DNS_SETUP_GUIDE.md)** - DNS configuration details
- **[VISUAL_GUIDE.md](./VISUAL_GUIDE.md)** - Visual diagrams
- **[IMPLEMENTATION_SUMMARY.md](./IMPLEMENTATION_SUMMARY.md)** - What was implemented

---

## ⚙️ Configuration

### Environment Variables

Edit `.env` file or set in `docker-compose.yml`:

```env
MONGO_USERNAME=admin
MONGO_PASSWORD=your-secure-password
MONGO_DATABASE=egyptfishar
JWT_SECRET=your-jwt-secret-key
```

### Nginx Configuration

Edit `backend/nginx-fullstack.conf` for:

- Server name (domain)
- SSL certificates
- Port configurations
- Proxy settings

---

## 🔄 Update Process

To update your application:

```bash
# Pull latest code
cd /root/full-stack-ecomerce
git pull

# Rebuild and restart
./quick-docker-deploy.sh
```

---

## 📊 Monitoring

### Check Container Health

```bash
docker compose ps
```

### Resource Usage

```bash
docker stats
```

### Disk Usage

```bash
docker system df
```

### Cleanup Unused Images

```bash
docker system prune -a
```

---

## 🆘 Emergency Commands

### Quick Restart Everything

```bash
docker compose down && docker compose up -d
```

### View All Logs

```bash
docker compose logs --tail=100
```

### Access Container Shell

```bash
docker exec -it ecommerce-nginx sh
docker exec -it ecommerce-api sh
docker exec -it ecommerce-frontend sh
```

---

## ✅ Success Checklist

- [ ] DNS points to 72.61.18.171
- [ ] Docker containers running
- [ ] http://egypt-fisher.com accessible
- [ ] Frontend loads correctly
- [ ] API endpoints working
- [ ] Database connected
- [ ] No errors in logs

---

## 🎯 Next Steps

1. ✅ Deploy with Docker
2. ⏳ Test all functionality
3. ⏳ Install SSL certificate
4. ⏳ Set up monitoring
5. ⏳ Configure backups
6. ⏳ Submit sitemap to search engines

---

## 📞 Support

**Issue with deployment?**

1. Check logs: `docker compose logs -f`
2. Check container status: `docker compose ps`
3. See troubleshooting section above
4. Review documentation in `/docs`

---

**Last Updated**: October 11, 2025  
**Version**: Docker Deployment 1.0  
**Status**: Production Ready ✅

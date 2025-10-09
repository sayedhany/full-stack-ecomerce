# 🚀 Full-Stack E-commerce Application

A complete e-commerce solution with Angular 18 (SSR), Node.js/Express backend, and MongoDB database.

## 🎯 Features

### Frontend (Angular 18)

- ✅ Server-Side Rendering (SSR)
- ✅ Bilingual support (English/Arabic)
- ✅ RTL/LTR layout switching
- ✅ Responsive design
- ✅ Product catalog with categories
- ✅ Admin dashboard
- ✅ Authentication & authorization

### Backend (Node.js/Express)

- ✅ RESTful API
- ✅ JWT authentication
- ✅ Role-based access control
- ✅ Image upload & compression
- ✅ Swagger API documentation
- ✅ CORS enabled
- ✅ MongoDB integration

### Database (MongoDB)

- ✅ User management
- ✅ Product catalog
- ✅ Categories
- ✅ Persistent storage

---

## 🚀 Quick Start

### Prerequisites

- [Docker Desktop](https://www.docker.com/products/docker-desktop) installed
- Git Bash or WSL2 (for Windows users)

### Deploy in 3 Steps

**1. Clone the repository:**

```bash
git clone https://github.com/sayedhany/full-stack-ecomerce.git
cd full-stack-ecomerce
```

**2. Run the deployment script:**

**Windows:**

```bash
deploy.bat
```

**Linux/Mac:**

```bash
chmod +x deploy.sh
./deploy.sh
```

**3. Access your application:**

- **Frontend:** http://localhost
- **Backend API:** http://localhost:5000/api
- **API Docs:** http://localhost:5000/api-docs

---

## 📦 What's Running?

After deployment, you'll have:

| Service  | Port    | Description                   |
| -------- | ------- | ----------------------------- |
| Nginx    | 80, 443 | Reverse proxy & load balancer |
| Frontend | 4000    | Angular app with SSR          |
| Backend  | 5000    | Node.js API server            |
| MongoDB  | 27017   | Database                      |

---

## 🔧 Manual Deployment

If you prefer manual control:

```bash
# 1. Create environment file
cp .env.example .env

# 2. Edit .env and set your JWT_SECRET
nano .env

# 3. Generate a secure JWT secret
openssl rand -base64 32

# 4. Start all services
docker compose up -d

# 5. View logs
docker compose logs -f

# 6. Stop services
docker compose down
```

---

## 🌐 Cloud Deployment

Deploy to production cloud platforms. See detailed guide: [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md)

### Recommended Options:

**Easiest (5 minutes):**

- [Railway.app](https://railway.app) - Auto-detects Docker, $5-20/month
- [Render.com](https://render.com) - Free tier available

**Best Value:**

- [DigitalOcean](https://digitalocean.com) - $24/month, 4GB RAM
- [Linode](https://linode.com) - $24/month, 4GB RAM

**Enterprise Scale:**

- AWS (EC2, ECS, or Fargate)
- Google Cloud Run
- Azure Container Instances

---

## 📚 Documentation

- **[DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md)** - Complete deployment guide with all cloud options
- **[backend/README.md](./backend/README.md)** - Backend API documentation
- **[backend/DOCKER_GUIDE.md](./backend/DOCKER_GUIDE.md)** - Docker-specific backend guide
- **[backend/API_TESTING.md](./backend/API_TESTING.md)** - API testing guide
- **[backend/SWAGGER_GUIDE.md](./backend/SWAGGER_GUIDE.md)** - Swagger documentation

---

## 🛠️ Development

### Local Development (Without Docker)

**Backend:**

```bash
cd backend
pnpm install
pnpm run dev
```

**Frontend:**

```bash
cd frontend
pnpm install
pnpm start
```

### With Docker

```bash
# Development mode with hot reload
docker compose -f docker-compose.dev.yml up

# Production mode
docker compose up -d
```

---

## 📊 Service Management

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

# Restart specific
docker compose restart ecommerce-backend
```

### Check Status

```bash
docker compose ps
```

### Update Application

```bash
git pull origin master
docker compose up -d --build
```

---

## 🔐 Environment Variables

Create a `.env` file in the root directory:

```env
# MongoDB
MONGODB_URI=mongodb://admin:password@mongodb:27017/egyptfishar?authSource=admin
MONGO_USERNAME=admin
MONGO_PASSWORD=your-secure-password
MONGO_DATABASE=egyptfishar

# Backend
NODE_ENV=production
PORT=5000

# JWT (CHANGE THIS!)
JWT_SECRET=your-super-secret-jwt-key-min-32-chars
JWT_EXPIRE=7d

# CORS
ALLOWED_ORIGINS=http://localhost:4000,http://localhost
```

**⚠️ IMPORTANT:** Always use a strong `JWT_SECRET` in production!

Generate one with:

```bash
openssl rand -base64 32
```

---

## 🐛 Troubleshooting

### Services won't start

```bash
docker compose logs
docker compose ps
```

### Port already in use

```bash
# Windows
netstat -ano | findstr :80
taskkill /PID <PID> /F

# Linux/Mac
lsof -ti:80 | xargs kill
```

### MongoDB connection issues

```bash
docker compose logs mongodb
docker exec -it ecommerce-db mongosh
```

### Clear everything and start fresh

```bash
docker compose down -v
docker system prune -a
docker compose up -d
```

---

## 📈 Production Checklist

Before deploying to production:

- [ ] Change default MongoDB password
- [ ] Generate strong JWT_SECRET
- [ ] Configure domain & SSL certificate
- [ ] Update CORS origins
- [ ] Enable firewall (ports 80, 443 only)
- [ ] Set up monitoring
- [ ] Configure backups
- [ ] Test all endpoints
- [ ] Update API documentation

---

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

---

## 📄 License

This project is licensed under the ISC License.

---

## 👨‍💻 Author

**Sayed Hany**

- GitHub: [@sayedhany](https://github.com/sayedhany)

---

## 🆘 Support

Need help? Check the documentation:

- [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md) - Deployment help
- [backend/API_TESTING.md](./backend/API_TESTING.md) - API testing
- [backend/SWAGGER_GUIDE.md](./backend/SWAGGER_GUIDE.md) - API docs

Or open an issue on GitHub.

---

## 🎉 Quick Commands Reference

```bash
# Start everything
docker compose up -d

# Stop everything
docker compose down

# View logs
docker compose logs -f

# Rebuild after changes
docker compose up -d --build

# Check status
docker compose ps

# Clean everything
docker compose down -v && docker system prune -a
```

---

Made with ❤️ using Docker, Angular, Node.js, and MongoDB

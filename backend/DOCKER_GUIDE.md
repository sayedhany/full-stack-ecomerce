# Docker Deployment Guide

## 🐳 Docker Configuration for E-commerce Backend

This guide explains how to build and run your e-commerce backend using Docker.

---

## 📁 Docker Files Created

### 1. `Dockerfile`

- **Base Image:** Node.js 20 Alpine (lightweight)
- **Package Manager:** pnpm
- **Security:** Non-root user
- **Health Check:** Built-in health monitoring
- **Port:** 5000

### 2. `.dockerignore`

- Excludes unnecessary files from Docker build
- Keeps image size small
- Protects sensitive files

### 3. `docker-compose.yml`

- Multi-service setup
- Backend + MongoDB + Nginx
- Persistent volumes
- Health checks

---

## 🚀 Quick Start

### Option 1: Docker only (using MongoDB Atlas)

```bash
# Build the image
docker build -t ecommerce-backend .

# Run the container
docker run -d \
  --name ecommerce-api \
  -p 5000:5000 \
  -e NODE_ENV=production \
  -e MONGODB_URI="your-mongodb-atlas-uri" \
  -e JWT_SECRET="your-strong-jwt-secret" \
  -e JWT_EXPIRE=7d \
  ecommerce-backend
```

### Option 2: Docker Compose (full stack)

```bash
# Create .env file first
cp .env.example .env

# Edit .env with your values
# Then start all services
docker-compose up -d
```

---

## 🔧 Detailed Setup

### Step 1: Prepare Environment Variables

Create `.env` file in the root directory:

```env
# MongoDB (use Atlas URI or local)
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/database
# Or for local MongoDB:
# MONGODB_URI=mongodb://admin:password@mongodb:27017/egyptfishar

# Server
NODE_ENV=production
PORT=5000

# JWT
JWT_SECRET=your-super-secure-jwt-secret-32-characters-minimum
JWT_EXPIRE=7d

# Optional CORS
ALLOWED_ORIGINS=https://yourdomain.com,https://www.yourdomain.com
```

### Step 2: Build Docker Image

```bash
# Build the image
docker build -t ecommerce-backend .

# Check the image
docker images | grep ecommerce-backend
```

### Step 3: Run Container

#### Option A: Simple Run (MongoDB Atlas)

```bash
docker run -d \
  --name ecommerce-api \
  -p 5000:5000 \
  --env-file .env \
  ecommerce-backend
```

#### Option B: With Local MongoDB

```bash
# Start MongoDB first
docker run -d \
  --name ecommerce-db \
  -p 27017:27017 \
  -e MONGO_INITDB_ROOT_USERNAME=admin \
  -e MONGO_INITDB_ROOT_PASSWORD=password \
  -e MONGO_INITDB_DATABASE=egyptfishar \
  -v mongodb_data:/data/db \
  mongo:7.0

# Then start the backend
docker run -d \
  --name ecommerce-api \
  -p 5000:5000 \
  --link ecommerce-db:mongodb \
  --env-file .env \
  ecommerce-backend
```

#### Option C: Docker Compose (Recommended)

```bash
# Start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop all services
docker-compose down
```

---

## 🔍 Container Management

### View Running Containers

```bash
docker ps
```

### Check Logs

```bash
# Backend logs
docker logs ecommerce-api

# Follow logs in real-time
docker logs -f ecommerce-api

# Docker Compose logs
docker-compose logs -f ecommerce-backend
```

### Access Container Shell

```bash
# Access running container
docker exec -it ecommerce-api sh

# Or with docker-compose
docker-compose exec ecommerce-backend sh
```

### Health Check

```bash
# Check container health
docker inspect ecommerce-api | grep Health -A 10

# Test API health endpoint
curl http://localhost:5000/api/health
```

---

## 📊 Docker Compose Services

### Services Included:

#### 1. **ecommerce-backend**

- Your Node.js API
- Port: 5000
- Health checks enabled
- Persistent uploads volume

#### 2. **mongodb** (Optional)

- MongoDB 7.0
- Port: 27017
- Persistent data volume
- Admin user: admin/password

#### 3. **nginx** (Optional)

- Reverse proxy
- Load balancing
- SSL termination
- Ports: 80, 443

### Volumes:

- `mongodb_data` - Database persistence
- `uploads_data` - File uploads persistence

---

## 🔧 Customization

### Environment Variables

| Variable          | Required | Default    | Description                    |
| ----------------- | -------- | ---------- | ------------------------------ |
| `MONGODB_URI`     | ✅       | -          | MongoDB connection string      |
| `NODE_ENV`        | ✅       | production | Environment mode               |
| `PORT`            | ❌       | 5000       | Server port                    |
| `JWT_SECRET`      | ✅       | -          | JWT signing secret (32+ chars) |
| `JWT_EXPIRE`      | ❌       | 7d         | JWT expiration time            |
| `ALLOWED_ORIGINS` | ❌       | -          | CORS allowed origins           |

### Volume Mounts

```yaml
volumes:
  # Persistent uploads
  - uploads_data:/app/server/uploads

  # Mount local uploads directory
  - ./server/uploads:/app/server/uploads

  # Mount logs directory
  - ./logs:/app/logs
```

### Port Mapping

```yaml
ports:
  # Map container port 5000 to host port 3000
  - "3000:5000"

  # Map to specific host IP
  - "127.0.0.1:5000:5000"
```

---

## 🔐 Security Best Practices

### Dockerfile Security:

- ✅ Non-root user (`ecommerce`)
- ✅ Alpine Linux (minimal attack surface)
- ✅ No sensitive files copied
- ✅ Minimal dependencies

### Runtime Security:

```bash
# Run with limited resources
docker run -d \
  --name ecommerce-api \
  --memory=512m \
  --cpus=0.5 \
  --restart=unless-stopped \
  --read-only \
  --tmpfs /tmp \
  -p 5000:5000 \
  ecommerce-backend
```

### Network Security:

```yaml
networks:
  ecommerce-network:
    driver: bridge
    ipam:
      config:
        - subnet: 172.20.0.0/16
```

---

## 🚀 Production Deployment

### Option 1: Single Container

```bash
# Production optimized run
docker run -d \
  --name ecommerce-api-prod \
  --restart=always \
  --memory=1g \
  --cpus=1.0 \
  -p 5000:5000 \
  --env-file .env.production \
  --log-driver=json-file \
  --log-opt max-size=10m \
  --log-opt max-file=3 \
  ecommerce-backend:latest
```

### Option 2: Docker Swarm

```bash
# Initialize swarm
docker swarm init

# Deploy stack
docker stack deploy -c docker-compose.yml ecommerce

# Scale services
docker service scale ecommerce_ecommerce-backend=3
```

### Option 3: Kubernetes

Create `k8s-deployment.yaml`:

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: ecommerce-backend
spec:
  replicas: 3
  selector:
    matchLabels:
      app: ecommerce-backend
  template:
    metadata:
      labels:
        app: ecommerce-backend
    spec:
      containers:
        - name: ecommerce-backend
          image: ecommerce-backend:latest
          ports:
            - containerPort: 5000
          env:
            - name: NODE_ENV
              value: "production"
            - name: MONGODB_URI
              valueFrom:
                secretKeyRef:
                  name: ecommerce-secrets
                  key: mongodb-uri
```

---

## 🔍 Troubleshooting

### Common Issues:

#### 1. Container won't start

```bash
# Check logs
docker logs ecommerce-api

# Check container status
docker inspect ecommerce-api
```

#### 2. Database connection failed

```bash
# Test MongoDB connection
docker exec -it ecommerce-api sh
# Inside container:
node -e "
const mongoose = require('mongoose');
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('✅ MongoDB connected'))
  .catch(err => console.error('❌ MongoDB error:', err));
"
```

#### 3. Port already in use

```bash
# Check what's using port 5000
lsof -i :5000

# Use different port
docker run -p 3000:5000 ecommerce-backend
```

#### 4. Permission denied for uploads

```bash
# Fix uploads directory permissions
docker exec -it ecommerce-api sh
chmod 755 /app/server/uploads
```

### Health Check Failures:

```bash
# Check health status
docker inspect ecommerce-api | grep Health -A 10

# Manual health check
curl -f http://localhost:5000/api/health
```

---

## 📈 Monitoring

### Container Stats

```bash
# Resource usage
docker stats ecommerce-api

# System information
docker system df
```

### Log Management

```bash
# Rotate logs (production)
docker run -d \
  --log-driver=json-file \
  --log-opt max-size=10m \
  --log-opt max-file=3 \
  ecommerce-backend
```

### Health Monitoring

```bash
# Docker healthcheck logs
docker inspect ecommerce-api --format='{{json .State.Health}}'
```

---

## 🔄 CI/CD Integration

### GitHub Actions Example:

```yaml
name: Build and Deploy
on:
  push:
    branches: [master]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Build Docker image
        run: docker build -t ecommerce-backend .
      - name: Push to registry
        run: |
          docker tag ecommerce-backend:latest registry.com/ecommerce-backend:latest
          docker push registry.com/ecommerce-backend:latest
```

---

## 📝 Quick Commands Reference

```bash
# Build
docker build -t ecommerce-backend .

# Run (development)
docker run -p 5000:5000 --env-file .env ecommerce-backend

# Run (production)
docker-compose up -d

# Logs
docker logs -f ecommerce-api

# Stop
docker stop ecommerce-api

# Remove
docker rm ecommerce-api

# Clean up
docker system prune -f
```

---

## 🎯 Next Steps

1. **Test the container locally**
2. **Push image to registry (Docker Hub, AWS ECR, etc.)**
3. **Deploy to production (AWS ECS, Google Cloud Run, etc.)**
4. **Set up monitoring and logging**
5. **Configure CI/CD pipeline**

---

## 📚 Additional Resources

- [Docker Best Practices](https://docs.docker.com/develop/dev-best-practices/)
- [Docker Compose Documentation](https://docs.docker.com/compose/)
- [Node.js Docker Guide](https://nodejs.org/en/docs/guides/nodejs-docker-webapp/)

---

**Your backend is now containerized and ready for any Docker-based deployment!** 🐳🚀

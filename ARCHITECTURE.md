# 🏗️ Architecture Overview

## System Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                         INTERNET / USERS                         │
└───────────────────────────┬─────────────────────────────────────┘
                            │ HTTPS (443) / HTTP (80)
                            ▼
┌───────────────────────────────────────────────────────────────────┐
│                       NGINX REVERSE PROXY                          │
│                    (ecommerce-nginx:80/443)                        │
│  • Load Balancing                                                  │
│  • SSL Termination                                                 │
│  • Static File Caching                                             │
│  • Request Routing                                                 │
└──────────────┬─────────────────────────┬──────────────────────────┘
               │                         │
               │ /api/*                  │ /*
               │ /uploads/*              │
               ▼                         ▼
┌──────────────────────────┐  ┌──────────────────────────┐
│   BACKEND API            │  │   FRONTEND (Angular)     │
│   (Node.js/Express)      │  │   with SSR               │
│   Port: 5000             │  │   Port: 4000             │
│                          │  │                          │
│  • REST API              │  │  • Server-Side Rendering │
│  • JWT Authentication    │  │  • Bilingual (EN/AR)     │
│  • Image Upload          │  │  • Responsive UI         │
│  • Business Logic        │  │  • Admin Dashboard       │
│  • Swagger Docs          │  │  • Product Catalog       │
└─────────────┬────────────┘  └──────────────────────────┘
              │
              │ MongoDB Connection
              ▼
┌──────────────────────────────────────────────────────────┐
│                    MONGODB DATABASE                       │
│                    (mongo:7.0)                            │
│                    Port: 27017                            │
│                                                           │
│  Collections:                                             │
│  • users        (authentication, roles)                   │
│  • products     (catalog, prices, images)                 │
│  • categories   (product categories)                      │
│                                                           │
│  Volumes:                                                 │
│  • mongodb_data (persistent database storage)            │
└───────────────────────────────────────────────────────────┘

┌───────────────────────────────────────────────────────────┐
│                    PERSISTENT STORAGE                      │
│                                                           │
│  • mongodb_data     (Database files)                      │
│  • uploads_data     (Product images)                      │
└───────────────────────────────────────────────────────────┘
```

---

## Container Communication

```
┌─────────────────────────────────────────────────────────┐
│            Docker Network: ecommerce-network             │
│                    (Bridge Network)                      │
│                                                          │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐     │
│  │   MongoDB   │  │   Backend   │  │  Frontend   │     │
│  │ (internal)  │◄─┤  :5000      │◄─┤   :4000     │     │
│  └─────────────┘  └─────────────┘  └─────────────┘     │
│         ▲                ▲                 ▲            │
│         │                │                 │            │
│         └────────────────┴─────────────────┘            │
│                          │                              │
│                    ┌─────┴─────┐                        │
│                    │   Nginx   │                        │
│                    │  :80/443  │                        │
│                    └───────────┘                        │
└──────────────────────────┬──────────────────────────────┘
                           │
                      (Exposed Port)
```

---

## Request Flow

### 1. Frontend Page Request

```
User Browser
    │
    │ GET https://yourdomain.com/
    ▼
Nginx (Port 80/443)
    │
    │ Proxy to ecommerce-frontend:4000
    ▼
Angular SSR Server
    │
    │ Render HTML with initial data
    ▼
Nginx
    │
    │ Return HTML + Assets
    ▼
User Browser
    │
    │ Load JS, CSS, Images
    │ Initialize Angular App
    ▼
Single Page Application Running
```

### 2. API Request

```
Angular App
    │
    │ GET /api/products
    ▼
Nginx (Port 80/443)
    │
    │ Proxy to ecommerce-backend:5000
    ▼
Express.js Backend
    │
    │ Authenticate (JWT)
    │ Validate Request
    ▼
MongoDB
    │
    │ Query Database
    ▼
Express.js Backend
    │
    │ Format Response
    │ Add CORS Headers
    ▼
Nginx
    │
    │ Return JSON
    ▼
Angular App
    │
    │ Update UI
    ▼
User Browser
```

### 3. Image Upload Flow

```
Admin Dashboard
    │
    │ POST /api/products (multipart/form-data)
    ▼
Nginx
    │
    │ Forward to Backend
    ▼
Express.js + Multer
    │
    │ Validate file type/size
    │ Save to /app/server/uploads
    ▼
Sharp (Image Processing)
    │
    │ Compress to WebP
    │ Resize if needed
    ▼
MongoDB
    │
    │ Save file path to product
    ▼
Volume: uploads_data
    │
    │ Persist file on disk
    ▼
Response with image URL
```

---

## Technology Stack

### Frontend

```
┌─────────────────────────────────────┐
│ Angular 18 (TypeScript)             │
│  ├─ Angular Router (Routing)        │
│  ├─ RxJS (State Management)         │
│  ├─ @ngx-translate (i18n)          │
│  ├─ Angular SSR (SEO)              │
│  └─ SCSS (Styling)                 │
└─────────────────────────────────────┘
```

### Backend

```
┌─────────────────────────────────────┐
│ Node.js 20 + Express                │
│  ├─ Mongoose (MongoDB ODM)          │
│  ├─ JWT (Authentication)            │
│  ├─ Multer (File Uploads)           │
│  ├─ Sharp (Image Processing)        │
│  ├─ Swagger (API Documentation)     │
│  ├─ bcryptjs (Password Hashing)     │
│  └─ Morgan (Request Logging)        │
└─────────────────────────────────────┘
```

### Infrastructure

```
┌─────────────────────────────────────┐
│ Docker & Docker Compose             │
│  ├─ MongoDB 7.0                     │
│  ├─ Nginx Alpine (Reverse Proxy)    │
│  ├─ Node 20 Alpine (App Containers) │
│  └─ Docker Networks & Volumes       │
└─────────────────────────────────────┘
```

---

## Port Mapping

| Service  | Internal Port | External Port | Purpose                    |
| -------- | ------------- | ------------- | -------------------------- |
| Nginx    | 80, 443       | 80, 443       | Public web access          |
| Frontend | 4000          | 4000          | Direct Angular SSR access  |
| Backend  | 5000          | 5000          | Direct API access          |
| MongoDB  | 27017         | 27017         | Database access (dev only) |

---

## Environment Variables Flow

```
.env file
    │
    ├─► Docker Compose
    │       │
    │       ├─► mongodb
    │       │   └─ MONGO_INITDB_ROOT_USERNAME
    │       │   └─ MONGO_INITDB_ROOT_PASSWORD
    │       │
    │       ├─► ecommerce-backend
    │       │   └─ MONGODB_URI
    │       │   └─ JWT_SECRET
    │       │   └─ ALLOWED_ORIGINS
    │       │
    │       └─► ecommerce-frontend
    │           └─ API_URL
    │
    └─► Used by all services at runtime
```

---

## Data Flow & Persistence

```
┌──────────────────────────────────────────────────┐
│                 Docker Volumes                    │
├──────────────────────────────────────────────────┤
│                                                   │
│  mongodb_data/                                    │
│  └─ /data/db/                                     │
│      └─ Database files (persistent)               │
│                                                   │
│  uploads_data/                                    │
│  └─ /app/server/uploads/                          │
│      └─ Product images (persistent)               │
│                                                   │
└──────────────────────────────────────────────────┘
         │
         │ Mounted to containers
         ▼
┌──────────────────────────────────────────────────┐
│  Even if containers are deleted, data persists   │
└──────────────────────────────────────────────────┘
```

---

## Security Layers

```
┌───────────────────────────────────────────────────┐
│  Layer 1: Nginx                                   │
│  • HTTPS/SSL encryption                           │
│  • Rate limiting (optional)                       │
│  • Request filtering                              │
└─────────────────────┬─────────────────────────────┘
                      ▼
┌───────────────────────────────────────────────────┐
│  Layer 2: Backend Middleware                      │
│  • CORS validation                                │
│  • JWT authentication                             │
│  • Request validation                             │
│  • File upload validation                         │
└─────────────────────┬─────────────────────────────┘
                      ▼
┌───────────────────────────────────────────────────┐
│  Layer 3: Database                                │
│  • Authentication required                        │
│  • Internal network only                          │
│  • Connection encryption                          │
└───────────────────────────────────────────────────┘
```

---

## Scaling Strategy

### Horizontal Scaling (Multiple Instances)

```
                    ┌─► Backend Instance 1
                    │
Load Balancer ──────┼─► Backend Instance 2
(Nginx)            │
                    └─► Backend Instance 3
                            │
                            ▼
                    Shared MongoDB
                    Shared Uploads (S3/NFS)
```

### Vertical Scaling (More Resources)

```
Small:  1 vCPU,  2GB RAM  →  ~100 concurrent users
Medium: 2 vCPU,  4GB RAM  →  ~500 concurrent users
Large:  4 vCPU,  8GB RAM  →  ~2000 concurrent users
XLarge: 8 vCPU, 16GB RAM  →  ~5000+ concurrent users
```

---

## Deployment Workflow

```
Development                 Testing                Production
──────────────             ──────────             ──────────────
Local Machine              Staging Server         Cloud Server
│                          │                      │
├─ docker-compose up       ├─ git pull            ├─ git pull
│                          ├─ docker compose up   ├─ docker compose up
└─ Live reload             │                      │
                           └─ Run tests           └─ Zero downtime
```

---

## Monitoring Points

```
┌──────────────────────────────────────────────────┐
│  Application Monitoring                           │
├──────────────────────────────────────────────────┤
│  • Container health checks (every 30s)            │
│  • API endpoint monitoring                        │
│  • Database connection status                     │
│  • Disk usage alerts                              │
│  • CPU/Memory usage tracking                      │
│  • Error rate monitoring                          │
│  • Response time tracking                         │
└──────────────────────────────────────────────────┘
```

---

This architecture provides:
✅ Scalability
✅ Security
✅ High Availability
✅ Easy Maintenance
✅ Production-Ready

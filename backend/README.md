# E-commerce Backend API

A production-ready Node.js + Express + MongoDB backend with bilingual (English/Arabic) support, JWT authentication, image uploads, and comprehensive API documentation.

## 🌟 Features

- ✅ **RESTful API** with full CRUD operations
- ✅ **Bilingual Support** (English & Arabic)
- ✅ **JWT Authentication** with role-based access (Admin/Customer)
- ✅ **Image Upload** with automatic WebP compression
- ✅ **Pagination** for product listings
- ✅ **Swagger Documentation** (OpenAPI 3.0)
- ✅ **Request Logging** with Morgan
- ✅ **CORS Configuration** for cross-origin requests
- ✅ **User Management** (Profile updates, password changes)
- ✅ **Audit Tracking** (createdBy/updatedBy for all resources)
- ✅ **Production Ready** (Railway deployment configured)

## 🚀 Tech Stack

- **Node.js 18+** - Runtime environment
- **Express.js 4.18+** - Web framework
- **MongoDB Atlas** - Cloud database
- **Mongoose 8.0+** - ODM for MongoDB
- **JWT** - Authentication (jsonwebtoken, bcryptjs)
- **Sharp** - Image processing and WebP compression
- **Multer** - File upload handling
- **Swagger** - API documentation (swagger-ui-express, swagger-jsdoc)
- **Morgan** - HTTP request logging
- **CORS** - Cross-Origin Resource Sharing
- **dotenv** - Environment variables

## 📦 Installation

### 1. Clone and Install Dependencies

```bash
# Install dependencies
pnpm install

# Or with npm
npm install
```

### 2. Configure Environment Variables

Copy `.env.example` to `server/.env` and update:

```env
# MongoDB Connection (use your MongoDB Atlas URI)
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/database?retryWrites=true&w=majority

# Server Configuration
PORT=5000
NODE_ENV=development

# JWT Configuration (use a strong secret in production!)
JWT_SECRET=your-super-secret-jwt-key-min-32-characters-long
JWT_EXPIRE=7d

# CORS (optional - comma separated origins for production)
# ALLOWED_ORIGINS=https://yourdomain.com,https://www.yourdomain.com
```

### 3. Start the Server

```bash
# Development mode with auto-reload
pnpm run dev

# Production mode
pnpm start

# Create admin user (first time setup)
pnpm run create-admin

# Seed database with sample data (optional)
pnpm run seed
```

Server will start on `http://localhost:5000`

## 🚂 Railway Deployment

This project is pre-configured for Railway deployment!

### Quick Deploy (5 minutes):

1. **Push to GitHub**

   ```bash
   git init
   git add .
   git commit -m "Ready for deployment"
   git push origin master
   ```

2. **Deploy on Railway**

   - Go to [railway.app](https://railway.app)
   - Login with GitHub
   - New Project → Deploy from GitHub repo
   - Select your repository

3. **Add Environment Variables**

   - Click "Variables" tab
   - Add: `MONGODB_URI`, `NODE_ENV=production`, `JWT_SECRET`

4. **Generate Domain**
   - Click "Generate Domain"
   - Your API: `https://your-app.up.railway.app`

📚 **Full deployment guide:** See [RAILWAY_DEPLOYMENT.md](./RAILWAY_DEPLOYMENT.md)  
⚡ **Quick start:** See [RAILWAY_QUICK_START.md](./RAILWAY_QUICK_START.md)

## 📖 API Documentation

### Swagger UI (Interactive)

Once the server is running, visit:

```
http://localhost:5000/api-docs
```

Or in production:

```
https://your-app.up.railway.app/api-docs
```

pnpm start

````

## API Endpoints

### Categories

| Method | Endpoint                           | Description                        |
| ------ | ---------------------------------- | ---------------------------------- |
| GET    | `/api/categories`                  | Get all active categories          |
| GET    | `/api/categories/:id`              | Get category by ID                 |
| GET    | `/api/categories/slug/:lang/:slug` | Get category by slug (lang: en/ar) |
| POST   | `/api/categories`                  | Create new category                |
| PUT    | `/api/categories/:id`              | Update category                    |
| DELETE | `/api/categories/:id`              | Delete category                    |

### Products

| Method | Endpoint                              | Description                       |
| ------ | ------------------------------------- | --------------------------------- |
| GET    | `/api/products`                       | Get all active products           |
| GET    | `/api/products?category=slug&lang=en` | Filter products by category       |
| GET    | `/api/products/:lang/:slug`           | Get product by slug (lang: en/ar) |
| GET    | `/api/products/id/:id`                | Get product by ID                 |
| POST   | `/api/products`                       | Create new product                |
| PUT    | `/api/products/:id`                   | Update product                    |
| DELETE | `/api/products/:id`                   | Delete product                    |

### Health Check

| Method | Endpoint      | Description         |
| ------ | ------------- | ------------------- |
| GET    | `/api/health` | Server health check |

## Data Models

### Category

```json
{
  "name": {
    "en": "Electronics",
    "ar": "إلكترونيات"
  },
  "slug": {
    "en": "electronics",
    "ar": "إلكترونيات"
  },
  "isActive": true
}
````

### Product

```json
{
  "name": {
    "en": "Laptop",
    "ar": "كمبيوتر محمول"
  },
  "description": {
    "en": "High performance laptop",
    "ar": "كمبيوتر محمول عالي الأداء"
  },
  "price": 999.99,
  "image": "https://example.com/laptop.jpg",
  "slug": {
    "en": "laptop",
    "ar": "كمبيوتر-محمول"
  },
  "category": "categoryId",
  "isActive": true
}
```

## Example API Calls

### Create a Category

```bash
curl -X POST http://localhost:5000/api/categories \
  -H "Content-Type: application/json" \
  -d '{
    "name": {
      "en": "Electronics",
      "ar": "إلكترونيات"
    },
    "slug": {
      "en": "electronics",
      "ar": "electronics-ar"
    }
  }'
```

### Create a Product

```bash
curl -X POST http://localhost:5000/api/products \
  -H "Content-Type: application/json" \
  -d '{
    "name": {
      "en": "Laptop",
      "ar": "كمبيوتر محمول"
    },
    "description": {
      "en": "High performance laptop",
      "ar": "كمبيوتر محمول عالي الأداء"
    },
    "price": 999.99,
    "image": "https://example.com/laptop.jpg",
    "slug": {
      "en": "laptop",
      "ar": "laptop-ar"
    },
    "category": "categoryId"
  }'
```

### Get Products by Category

```bash
curl http://localhost:5000/api/products?category=electronics&lang=en
```

### Get Product by Slug

```bash
curl http://localhost:5000/api/products/en/laptop
```

## Error Handling

All endpoints return a consistent JSON response format:

**Success:**

```json
{
  "success": true,
  "data": {...},
  "message": "Optional message"
}
```

**Error:**

```json
{
  "success": false,
  "message": "Error description",
  "error": "Detailed error (development only)"
}
```

## License

ISC

# E-commerce Backend API

A Node.js + Express + MongoDB backend with bilingual (English/Arabic) support for products and categories.

## Features

- ✅ RESTful API with full CRUD operations
- ✅ Bilingual support (English & Arabic)
- ✅ MongoDB with Mongoose ODM
- ✅ Category-based product filtering
- ✅ Slug-based routing
- ✅ CORS enabled
- ✅ Environment variable configuration
- ✅ Error handling

## Tech Stack

- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM for MongoDB
- **dotenv** - Environment variables
- **cors** - Cross-Origin Resource Sharing

## Installation

1. Install dependencies:

```bash
pnpm install
```

2. Configure environment variables:
   Edit `server/.env` file with your MongoDB URI:

```env
MONGODB_URI=mongodb://localhost:27017/ecommerce
PORT=5000
NODE_ENV=development
```

3. Make sure MongoDB is running on your system

4. Start the server:

```bash
# Development mode with auto-reload
pnpm run dev

# Production mode
pnpm start
```

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
```

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

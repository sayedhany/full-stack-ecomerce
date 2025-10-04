# Quick Start Guide

## Prerequisites

- Node.js (v14 or higher)
- MongoDB installed and running
- pnpm package manager

## Setup Steps

### 1. Install Dependencies

```bash
pnpm install
```

### 2. Configure Environment

Edit `server/.env` if needed:

```env
MONGODB_URI=mongodb://localhost:27017/ecommerce
PORT=5000
NODE_ENV=development
```

### 3. Start MongoDB

Make sure MongoDB is running on your system:

```bash
# Windows (if installed as service)
net start MongoDB

# Or start manually
mongod
```

### 4. Seed the Database (Optional)

Populate with sample data:

```bash
pnpm run seed
```

### 5. Start the Server

**Development mode** (with auto-reload):

```bash
pnpm run dev
```

**Production mode**:

```bash
pnpm start
```

The server will start at: `http://localhost:5000`

### 6. Test the API

Open your browser or use curl:

```bash
# Health check
curl http://localhost:5000/api/health

# Get all categories
curl http://localhost:5000/api/categories

# Get all products
curl http://localhost:5000/api/products

# Get products by category
curl "http://localhost:5000/api/products?category=electronics&lang=en"
```

## API Endpoints Summary

### Categories

- `GET /api/categories` - Get all categories
- `GET /api/categories/:id` - Get category by ID
- `GET /api/categories/slug/:lang/:slug` - Get by slug
- `POST /api/categories` - Create category
- `PUT /api/categories/:id` - Update category
- `DELETE /api/categories/:id` - Delete category

### Products

- `GET /api/products` - Get all products
- `GET /api/products?category=slug&lang=en` - Filter by category
- `GET /api/products/:lang/:slug` - Get product by slug
- `GET /api/products/id/:id` - Get product by ID
- `POST /api/products` - Create product
- `PUT /api/products/:id` - Update product
- `DELETE /api/products/:id` - Delete product

## Folder Structure

```
backend/
├── server/
│   ├── models/
│   │   ├── Category.js      # Category model
│   │   └── Product.js       # Product model
│   ├── routes/
│   │   ├── categories.js    # Category routes (CRUD)
│   │   └── products.js      # Product routes (CRUD)
│   ├── app.js              # Express app configuration
│   ├── server.js           # Server entry point
│   ├── seed.js             # Database seeding script
│   └── .env                # Environment variables
├── package.json
├── README.md
├── API_TESTING.md
└── QUICKSTART.md
```

## Troubleshooting

### MongoDB Connection Error

- Ensure MongoDB is running
- Check connection URI in `.env` file
- Verify MongoDB is accessible at the specified port

### Port Already in Use

- Change `PORT` in `.env` file
- Or stop the process using port 5000

### Module Not Found

- Run `pnpm install` again
- Delete `node_modules` and reinstall

## Next Steps

1. Test all CRUD endpoints using the examples in `API_TESTING.md`
2. Integrate with your frontend application
3. Add authentication/authorization if needed
4. Add image upload functionality
5. Implement pagination for large datasets
6. Add search functionality
7. Add data validation middleware

## Support

For more details, check:

- `README.md` - Complete documentation
- `API_TESTING.md` - API testing examples

# Swagger API Documentation Guide

## 🎯 Overview

Your E-commerce Backend now has **interactive Swagger API documentation** with full CRUD operations for Products and Categories!

## 📡 Access Swagger UI

Once your server is running, access the interactive documentation at:

```
http://localhost:5000/api-docs
```

You can also get the raw Swagger JSON at:

```
http://localhost:5000/api-docs.json
```

## 🚀 Quick Start

### 1. Start the Server

```bash
npm run dev
```

### 2. Open Swagger UI

Navigate to: **http://localhost:5000/api-docs**

### 3. Explore the API

- Browse all endpoints organized by tags
- View request/response schemas
- Try out API calls directly from the browser!

## 📚 What's Documented

### ✅ All API Endpoints

#### **Health** (1 endpoint)

- `GET /api/health` - Server health check

#### **Categories** (7 endpoints)

- `GET /api/categories` - Get all categories
- `GET /api/categories/{id}` - Get category by ID
- `GET /api/categories/slug/{lang}/{slug}` - Get by slug
- `POST /api/categories` - Create category
- `PUT /api/categories/{id}` - Update category
- `DELETE /api/categories/{id}` - Delete category

#### **Products** (7 endpoints)

- `GET /api/products` - Get all products (with filtering)
- `GET /api/products/{lang}/{slug}` - Get product by slug
- `GET /api/products/id/{id}` - Get product by ID
- `POST /api/products` - Create product
- `PUT /api/products/{id}` - Update product
- `DELETE /api/products/{id}` - Delete product

### ✅ Complete Schemas

All data models are documented with:

- **Category** - Full schema with bilingual fields
- **Product** - Complete product model
- **CategoryInput** - Create/update category payload
- **ProductInput** - Create/update product payload
- **BilingualText** - English/Arabic text structure
- **SuccessResponse** - Standard success response
- **ErrorResponse** - Standard error response

## 🎨 Using Swagger UI

### 1. **Try It Out** Feature

Each endpoint has a "Try it out" button:

1. Click **"Try it out"** on any endpoint
2. Fill in the required parameters/body
3. Click **"Execute"**
4. See the response in real-time!

### 2. **Example Workflow**

#### Create a Category:

1. Expand `POST /api/categories`
2. Click **"Try it out"**
3. Use the example request body:

```json
{
  "name": {
    "en": "Electronics",
    "ar": "إلكترونيات"
  },
  "slug": {
    "en": "electronics",
    "ar": "الكترونيات"
  },
  "isActive": true
}
```

4. Click **"Execute"**
5. Copy the returned `_id` from response

#### Create a Product:

1. Expand `POST /api/products`
2. Click **"Try it out"**
3. Paste the category ID in the `category` field
4. Use example data for other fields
5. Click **"Execute"**

#### Get Products by Category:

1. Expand `GET /api/products`
2. Click **"Try it out"**
3. Add query parameters:
   - category: `electronics`
   - lang: `en`
4. Click **"Execute"**

### 3. **View Schemas**

At the bottom of the Swagger UI page:

- Click **"Schemas"** section
- Browse all data models
- See required fields, types, examples

### 4. **Test Different Languages**

For bilingual endpoints:

- Try `lang=en` for English
- Try `lang=ar` for Arabic
- Example slugs are provided for both languages

## 📖 Swagger Features

### Request Bodies with Examples

Each POST/PUT endpoint includes multiple examples:

```yaml
Examples:
  - Electronics category
  - Clothing category
  - Update price
  - Update status
```

### Parameter Documentation

All parameters are documented with:

- Type (string, number, boolean)
- Required/Optional
- Example values
- Enum values (for lang: en/ar)

### Response Examples

Each endpoint shows:

- Success responses (200, 201)
- Error responses (400, 404, 500)
- Complete response schemas

### Tags for Organization

Endpoints are grouped by:

- 🏥 **Health** - Health check
- 📁 **Categories** - Category operations
- 📦 **Products** - Product operations

## 🔧 Configuration

### Swagger Configuration (`server/swagger.js`)

```javascript
{
  openapi: '3.0.0',
  servers: [
    {
      url: 'http://localhost:5000',
      description: 'Development server'
    },
    {
      url: 'https://your-production-url.com',
      description: 'Production server'
    }
  ]
}
```

### Update for Production

Edit `server/swagger.js`:

```javascript
servers: [
  {
    url: "https://api.yoursite.com",
    description: "Production server",
  },
];
```

## 💡 Advanced Features

### 1. **Export Swagger Spec**

Download the OpenAPI specification:

```bash
curl http://localhost:5000/api-docs.json > swagger.json
```

### 2. **Generate Client Code**

Use the Swagger JSON to generate client SDKs:

- Visit: https://editor.swagger.io
- Import your `/api-docs.json`
- Generate client in any language (JavaScript, Python, Java, etc.)

### 3. **API Testing**

Use Swagger UI to:

- Test all CRUD operations
- Validate request/response formats
- Debug API issues
- Share with frontend developers

### 4. **Share Documentation**

Share the Swagger URL with your team:

```
http://localhost:5000/api-docs
```

Or deploy and share production URL:

```
https://api.yoursite.com/api-docs
```

## 🎯 Example Use Cases

### 1. Frontend Developer Onboarding

- Send them `/api-docs` link
- They can explore all endpoints
- See exact request/response formats
- Test API calls before coding

### 2. API Testing

- Test all CRUD operations visually
- No need for Postman initially
- Validate data structures
- Check error handling

### 3. Documentation Sharing

- Always up-to-date (auto-generated from code)
- Interactive examples
- No separate documentation to maintain

### 4. Contract Testing

- Export OpenAPI spec
- Use in automated tests
- Ensure API compliance

## 📝 Swagger vs Postman

| Feature          | Swagger UI   | Postman            |
| ---------------- | ------------ | ------------------ |
| Interactive Docs | ✅ Yes       | ❌ No              |
| Try API Calls    | ✅ Yes       | ✅ Yes             |
| Auto-Generated   | ✅ From code | ❌ Manual          |
| Share with Team  | ✅ URL Link  | ✅ Collection file |
| Export OpenAPI   | ✅ Yes       | ✅ Yes             |
| Visual Schemas   | ✅ Yes       | ❌ Limited         |

**Use Both!**

- **Swagger** for documentation & exploration
- **Postman** for saved requests & collections

## 🐛 Troubleshooting

### Swagger UI Not Loading

- Check server is running: `npm run dev`
- Visit: `http://localhost:5000/api-docs`
- Check console for errors

### Schemas Not Showing

- Ensure `server/swagger.js` exists
- Check `apis` path in swagger config
- Restart server: `rs` in nodemon

### Examples Not Working

- Verify request body format
- Check required fields
- Use provided example values

### Can't Execute Requests

- Check CORS is enabled
- Server must be running
- Port 5000 must be accessible

## 📚 Additional Resources

### OpenAPI Specification

- Docs: https://swagger.io/specification/
- Editor: https://editor.swagger.io/

### Swagger UI

- GitHub: https://github.com/swagger-api/swagger-ui
- Docs: https://swagger.io/tools/swagger-ui/

### JSDoc Comments

All routes use JSDoc-style Swagger annotations:

```javascript
/**
 * @swagger
 * /api/products:
 *   get:
 *     summary: Get all products
 *     ...
 */
```

## 🎉 Features Included

✅ **Complete API Documentation**
✅ **Interactive Testing Interface**
✅ **Bilingual Examples (EN/AR)**
✅ **Schema Validation**
✅ **Request/Response Examples**
✅ **Error Response Documentation**
✅ **Try It Out Functionality**
✅ **OpenAPI 3.0 Compliant**
✅ **Auto-Generated from Code**
✅ **Always Up-to-Date**

## 🚀 Next Steps

1. **Start Server**: `npm run dev`
2. **Open Swagger**: http://localhost:5000/api-docs
3. **Explore Endpoints**: Browse the documentation
4. **Test APIs**: Use "Try it out" feature
5. **Share with Team**: Send them the URL

---

**Your API is now fully documented with Swagger! 🎊**

Access it at: **http://localhost:5000/api-docs**

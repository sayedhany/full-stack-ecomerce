# Postman Collection Guide

## 📥 Import the Collection

1. **Open Postman**
2. Click **Import** button (top left)
3. Select **Upload Files**
4. Choose `Postman_Collection.json`
5. Click **Import**

## 🔧 Setup Environment Variables

The collection uses variables that you need to configure:

### Default Variables (Already Set):

- `baseUrl`: `http://localhost:5000`
- `categoryId`: (empty - you'll set this after creating a category)
- `productId`: (empty - you'll set this after creating a product)

### To Update Variables:

1. Click on the collection name "E-commerce Backend API"
2. Go to the **Variables** tab
3. Update values as needed

## 🚀 Testing Workflow

### Step 1: Health Check

1. Open **Health Check** folder
2. Run **Server Health Check**
3. Should return `200 OK` with server status

### Step 2: Create Categories

1. Open **Sample Data Examples** folder
2. Run **Create Category - Electronics**
   ```json
   {
     "success": true,
     "message": "Category created successfully",
     "data": {
       "_id": "507f1f77bcf86cd799439011",
       "name": {
         "en": "Electronics",
         "ar": "إلكترونيات"
       },
       ...
     }
   }
   ```
3. **IMPORTANT**: Copy the `_id` value from the response
4. Go to collection **Variables** tab
5. Set `categoryId` to the copied ID
6. Save the collection

### Step 3: Create More Categories (Optional)

- Run **Create Category - Clothing**
- Run **Create Category - Books**

### Step 4: Get All Categories

1. Open **Categories** folder
2. Run **Get All Categories**
3. Verify all categories are returned

### Step 5: Create Products

1. Make sure you have a `categoryId` set in variables
2. Open **Sample Data Examples** folder
3. Run **Create Product - Laptop Pro 15**
4. Copy the product `_id` from response
5. Update `productId` variable in collection
6. Create more products as needed

### Step 6: Test All Endpoints

**Categories:**

- ✅ Get All Categories
- ✅ Get Category by ID (use `{{categoryId}}`)
- ✅ Get Category by Slug (English)
- ✅ Get Category by Slug (Arabic)
- ✅ Update Category
- ✅ Delete Category

**Products:**

- ✅ Get All Products
- ✅ Get Products by Category (English)
- ✅ Get Products by Category (Arabic)
- ✅ Get Product by Slug (English)
- ✅ Get Product by Slug (Arabic)
- ✅ Get Product by ID
- ✅ Update Product
- ✅ Delete Product

## 📝 Collection Structure

```
E-commerce Backend API/
├── Health Check/
│   └── Server Health Check
├── Categories/
│   ├── Get All Categories
│   ├── Get Category by ID
│   ├── Get Category by Slug (English)
│   ├── Get Category by Slug (Arabic)
│   ├── Create Category
│   ├── Update Category
│   └── Delete Category
├── Products/
│   ├── Get All Products
│   ├── Get Products by Category (English)
│   ├── Get Products by Category (Arabic)
│   ├── Get Product by Slug (English)
│   ├── Get Product by Slug (Arabic)
│   ├── Get Product by ID
│   ├── Create Product
│   ├── Update Product
│   └── Delete Product
└── Sample Data Examples/
    ├── Create Category - Clothing
    ├── Create Category - Books
    ├── Create Product - Wireless Headphones
    └── Create Product - T-Shirt
```

## 🎯 Quick Test Sequence

### 1. Health Check

```
GET /api/health
```

### 2. Create Electronics Category

```
POST /api/categories
Body: {
  "name": { "en": "Electronics", "ar": "إلكترونيات" },
  "slug": { "en": "electronics", "ar": "الكترونيات" }
}
```

**Save the returned \_id as {{categoryId}}**

### 3. Create Laptop Product

```
POST /api/products
Body: {
  "name": { "en": "Laptop Pro 15", "ar": "لابتوب برو ١٥" },
  "description": { ... },
  "price": 1299.99,
  "image": "https://...",
  "slug": { "en": "laptop-pro-15", "ar": "لابتوب-برو-15" },
  "category": "{{categoryId}}"
}
```

**Save the returned \_id as {{productId}}**

### 4. Get All Products

```
GET /api/products
```

### 5. Filter Products by Category

```
GET /api/products?category=electronics&lang=en
```

### 6. Get Product by Slug

```
GET /api/products/en/laptop-pro-15
```

### 7. Update Product Price

```
PUT /api/products/{{productId}}
Body: { "price": 1199.99 }
```

### 8. Delete Product

```
DELETE /api/products/{{productId}}
```

## 🔍 Response Examples

### Success Response

```json
{
  "success": true,
  "count": 3,
  "data": [...]
}
```

### Error Response

```json
{
  "success": false,
  "message": "Error description",
  "error": "Detailed error message"
}
```

## 💡 Pro Tips

### 1. **Use Collection Variables**

Instead of hardcoding IDs, use:

- `{{categoryId}}`
- `{{productId}}`
- `{{baseUrl}}`

### 2. **Test in Order**

Follow this sequence:

1. Health Check
2. Create Category (save ID)
3. Get Categories
4. Create Product (with category ID)
5. Test other endpoints

### 3. **Check Response Status**

- `200` - Success
- `201` - Created
- `400` - Bad Request
- `404` - Not Found
- `500` - Server Error

### 4. **Copy IDs Automatically**

In Postman, you can use **Tests** tab to automatically save IDs:

```javascript
// In "Create Category" Tests tab
if (pm.response.code === 201) {
  const response = pm.response.json();
  pm.collectionVariables.set("categoryId", response.data._id);
}
```

### 5. **Use Environments**

Create different environments for:

- **Local**: `http://localhost:5000`
- **Production**: `https://your-domain.com`

## 🌐 Testing with Different Languages

### English Requests

```
GET /api/products?category=electronics&lang=en
GET /api/products/en/laptop-pro-15
GET /api/categories/slug/en/electronics
```

### Arabic Requests

```
GET /api/products?category=الكترونيات&lang=ar
GET /api/products/ar/لابتوب-برو-15
GET /api/categories/slug/ar/الكترونيات
```

## 🐛 Troubleshooting

### Connection Refused

- Check if server is running: `npm run dev`
- Verify `baseUrl` is correct

### 404 Not Found

- Check the endpoint URL
- Verify route exists in your Express app

### 400 Bad Request

- Check request body format
- Ensure required fields are present

### Category Not Found (for Products)

- Verify `categoryId` is set correctly
- Create a category first

### Duplicate Key Error

- Slug already exists
- Use different slug values

## 📦 Seed Data First

Before testing, you can seed the database:

```bash
npm run seed
```

This will create:

- 3 Categories (Electronics, Clothing, Books)
- 7 Sample Products

## 🎨 Customize the Collection

You can add more requests by:

1. Right-click on a folder
2. Select "Add Request"
3. Configure method, URL, headers, body
4. Save

## 📚 Additional Resources

- Full API Documentation: `README.md`
- API Testing Examples: `API_TESTING.md`
- Quick Start Guide: `QUICKSTART.md`

---

**Ready to test!** 🚀 Start with the Health Check endpoint and work your way through the collection.

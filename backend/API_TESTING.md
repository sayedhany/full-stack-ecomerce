# API Testing Examples

Base URL: `http://localhost:5000`

## Categories API

### 1. Get All Categories

```bash
curl http://localhost:5000/api/categories
```

### 2. Get Category by ID

```bash
curl http://localhost:5000/api/categories/{categoryId}
```

### 3. Get Category by Slug (English)

```bash
curl http://localhost:5000/api/categories/slug/en/electronics
```

### 4. Get Category by Slug (Arabic)

```bash
curl http://localhost:5000/api/categories/slug/ar/الكترونيات
```

### 5. Create Category

```bash
curl -X POST http://localhost:5000/api/categories \
  -H "Content-Type: application/json" \
  -d '{
    "name": {
      "en": "Home & Garden",
      "ar": "المنزل والحديقة"
    },
    "slug": {
      "en": "home-garden",
      "ar": "المنزل-والحديقة"
    },
    "isActive": true
  }'
```

### 6. Update Category

```bash
curl -X PUT http://localhost:5000/api/categories/{categoryId} \
  -H "Content-Type: application/json" \
  -d '{
    "name": {
      "en": "Electronics & Gadgets",
      "ar": "إلكترونيات وأدوات"
    }
  }'
```

### 7. Delete Category

```bash
curl -X DELETE http://localhost:5000/api/categories/{categoryId}
```

---

## Products API

### 1. Get All Products

```bash
curl http://localhost:5000/api/products
```

### 2. Get Products by Category (English)

```bash
curl "http://localhost:5000/api/products?category=electronics&lang=en"
```

### 3. Get Products by Category (Arabic)

```bash
curl "http://localhost:5000/api/products?category=ملابس&lang=ar"
```

### 4. Get Product by Slug (English)

```bash
curl http://localhost:5000/api/products/en/laptop-pro-15
```

### 5. Get Product by Slug (Arabic)

```bash
curl http://localhost:5000/api/products/ar/لابتوب-برو-15
```

### 6. Get Product by ID

```bash
curl http://localhost:5000/api/products/id/{productId}
```

### 7. Create Product

```bash
curl -X POST http://localhost:5000/api/products \
  -H "Content-Type: application/json" \
  -d '{
    "name": {
      "en": "Gaming Mouse",
      "ar": "ماوس ألعاب"
    },
    "description": {
      "en": "High-precision gaming mouse with RGB lighting",
      "ar": "ماوس ألعاب عالي الدقة مع إضاءة RGB"
    },
    "price": 59.99,
    "image": "https://example.com/mouse.jpg",
    "slug": {
      "en": "gaming-mouse",
      "ar": "ماوس-العاب"
    },
    "category": "{categoryId}",
    "isActive": true
  }'
```

### 8. Update Product

```bash
curl -X PUT http://localhost:5000/api/products/{productId} \
  -H "Content-Type: application/json" \
  -d '{
    "price": 49.99,
    "isActive": true
  }'
```

### 9. Delete Product

```bash
curl -X DELETE http://localhost:5000/api/products/{productId}
```

---

## Health Check

```bash
curl http://localhost:5000/api/health
```

---

## Response Format

### Success Response

```json
{
  "success": true,
  "data": { ... },
  "count": 10,
  "message": "Optional success message"
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

---

## Testing with JavaScript (fetch)

### Get All Products

```javascript
fetch("http://localhost:5000/api/products")
  .then((res) => res.json())
  .then((data) => console.log(data));
```

### Create Category

```javascript
fetch("http://localhost:5000/api/categories", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    name: {
      en: "Sports",
      ar: "رياضة",
    },
    slug: {
      en: "sports",
      ar: "رياضة",
    },
  }),
})
  .then((res) => res.json())
  .then((data) => console.log(data));
```

### Filter Products by Category

```javascript
fetch("http://localhost:5000/api/products?category=electronics&lang=en")
  .then((res) => res.json())
  .then((data) => console.log(data));
```

---

## Notes

- Replace `{categoryId}` and `{productId}` with actual MongoDB ObjectIds
- All timestamps are automatically managed by Mongoose
- Slugs must be unique per language
- Category reference is required when creating products
- Use `isActive: false` to soft-delete items instead of hard deletion

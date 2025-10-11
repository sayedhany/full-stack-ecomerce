# Products by Category API - Quick Reference

## New Endpoint Added ✨

**Endpoint:** `GET /api/products/category/:categoryId`

Get all products for a specific category with pagination and sorting.

## Quick Examples

### Basic Usage

```bash
# Get products from category
GET /api/products/category/507f1f77bcf86cd799439011
```

### With Pagination

```bash
# Page 2, 20 items per page
GET /api/products/category/507f1f77bcf86cd799439011?page=2&limit=20
```

### With Sorting

```bash
# Sort by price (low to high)
GET /api/products/category/507f1f77bcf86cd799439011?sort=price-low
```

## Available Sort Options

- `newest` - Recently added (default)
- `oldest` - Oldest first
- `price-low` - Cheapest first
- `price-high` - Most expensive first
- `name-asc` - A to Z
- `name-desc` - Z to A

## Response Format

```json
{
  "success": true,
  "count": 10,
  "total": 25,
  "page": 1,
  "pages": 3,
  "category": {
    /* Category details */
  },
  "data": [
    /* Array of products */
  ]
}
```

## Alternative Method (Using Slug)

If you have a category slug instead of ID:

```bash
GET /api/products?category=electronics&lang=en
```

## Frontend Integration (Angular)

```typescript
// Get products by category ID
getProductsByCategoryId(categoryId: string, page = 1, limit = 10, sort = 'newest') {
  const params = new HttpParams()
    .set('page', page.toString())
    .set('limit', limit.toString())
    .set('sort', sort);

  return this.http.get(
    `${this.apiUrl}/products/category/${categoryId}`,
    { params }
  );
}
```

## Testing with cURL

```bash
curl -X GET "http://localhost:5000/api/products/category/YOUR_CATEGORY_ID" \
  -H "Content-Type: application/json"
```

## Key Features

✅ Pagination support (max 100 items per page)
✅ Multiple sort options
✅ Returns category information
✅ Only active products
✅ Populates category and user details
✅ Full Swagger documentation

---

For complete documentation, see: `PRODUCTS_BY_CATEGORY_API.md`

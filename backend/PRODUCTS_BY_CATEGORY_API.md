# Products by Category API Documentation

## Overview

This document describes the API endpoints available for retrieving products filtered by category.

## Endpoints

### 1. Get Products by Category ID

**Endpoint:** `GET /api/products/category/:categoryId`

**Description:** Retrieve all active products belonging to a specific category with pagination and sorting options.

**Path Parameters:**

- `categoryId` (required): MongoDB ObjectId of the category

**Query Parameters:**

- `page` (optional, default: 1): Page number for pagination
- `limit` (optional, default: 10, max: 100): Number of items per page
- `sort` (optional, default: "newest"): Sort order
  - `newest`: Sort by creation date (newest first)
  - `oldest`: Sort by creation date (oldest first)
  - `price-low`: Sort by price (low to high)
  - `price-high`: Sort by price (high to low)
  - `name-asc`: Sort by name (A-Z)
  - `name-desc`: Sort by name (Z-A)

**Example Requests:**

```bash
# Get products from a specific category (first page)
GET /api/products/category/507f1f77bcf86cd799439011

# Get products with pagination
GET /api/products/category/507f1f77bcf86cd799439011?page=2&limit=20

# Get products sorted by price (low to high)
GET /api/products/category/507f1f77bcf86cd799439011?sort=price-low

# Get products sorted by name with pagination
GET /api/products/category/507f1f77bcf86cd799439011?page=1&limit=15&sort=name-asc
```

**Success Response (200 OK):**

```json
{
  "success": true,
  "count": 10,
  "total": 25,
  "page": 1,
  "pages": 3,
  "category": {
    "_id": "507f1f77bcf86cd799439011",
    "name": {
      "en": "Electronics",
      "ar": "إلكترونيات"
    },
    "slug": {
      "en": "electronics",
      "ar": "الكترونيات"
    },
    "description": {
      "en": "Electronic devices and gadgets",
      "ar": "الأجهزة الإلكترونية والأدوات"
    },
    "isActive": true
  },
  "data": [
    {
      "_id": "507f1f77bcf86cd799439012",
      "name": {
        "en": "Laptop Pro 15",
        "ar": "لابتوب برو 15"
      },
      "slug": {
        "en": "laptop-pro-15",
        "ar": "لابتوب-برو-15"
      },
      "description": {
        "en": "High-performance laptop",
        "ar": "لابتوب عالي الأداء"
      },
      "price": 1299.99,
      "image": "product-123456.webp",
      "category": {
        "_id": "507f1f77bcf86cd799439011",
        "name": {
          "en": "Electronics",
          "ar": "إلكترونيات"
        }
      },
      "isActive": true,
      "createdAt": "2025-01-15T10:30:00.000Z",
      "updatedAt": "2025-01-15T10:30:00.000Z"
    }
    // ... more products
  ]
}
```

**Error Response (404 Not Found):**

```json
{
  "success": false,
  "message": "Category not found"
}
```

**Error Response (500 Server Error):**

```json
{
  "success": false,
  "message": "Error fetching products by category",
  "error": "Error details here"
}
```

---

### 2. Get Products with Category Filter (Alternative Method)

**Endpoint:** `GET /api/products?category={categorySlug}&lang={language}`

**Description:** Retrieve products using category slug in the query parameters. This is useful when you have the category slug instead of the ID.

**Query Parameters:**

- `category` (required): Category slug in the specified language
- `lang` (required): Language code (`en` or `ar`)
- `page` (optional, default: 1): Page number
- `limit` (optional, default: 10): Items per page
- `sort` (optional, default: "newest"): Sort order

**Example Requests:**

```bash
# Get products by category slug (English)
GET /api/products?category=electronics&lang=en

# Get products by category slug (Arabic)
GET /api/products?category=الكترونيات&lang=ar

# With pagination and sorting
GET /api/products?category=electronics&lang=en&page=2&limit=20&sort=price-low
```

**Success Response:** Same as the category ID endpoint

---

## Frontend Integration Examples

### TypeScript/Angular Service

```typescript
import { HttpClient, HttpParams } from "@angular/common/http";
import { Observable } from "rxjs";

export class ProductService {
  private apiUrl = "http://localhost:5000/api";

  constructor(private http: HttpClient) {}

  // Method 1: Get products by category ID
  getProductsByCategoryId(
    categoryId: string,
    page: number = 1,
    limit: number = 10,
    sort: string = "newest"
  ): Observable<any> {
    const params = new HttpParams()
      .set("page", page.toString())
      .set("limit", limit.toString())
      .set("sort", sort);

    return this.http.get(`${this.apiUrl}/products/category/${categoryId}`, {
      params,
    });
  }

  // Method 2: Get products by category slug
  getProductsByCategorySlug(
    categorySlug: string,
    lang: string,
    page: number = 1,
    limit: number = 10,
    sort: string = "newest"
  ): Observable<any> {
    const params = new HttpParams()
      .set("category", categorySlug)
      .set("lang", lang)
      .set("page", page.toString())
      .set("limit", limit.toString())
      .set("sort", sort);

    return this.http.get(`${this.apiUrl}/products`, { params });
  }
}
```

### Usage in Component

```typescript
export class CategoryProductsComponent implements OnInit {
  products: Product[] = [];
  category: Category | null = null;
  loading = true;
  currentPage = 1;
  totalPages = 1;

  constructor(
    private productService: ProductService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    // Get category ID from route
    const categoryId = this.route.snapshot.params["categoryId"];
    this.loadProducts(categoryId);
  }

  loadProducts(categoryId: string, page: number = 1): void {
    this.loading = true;

    this.productService
      .getProductsByCategoryId(categoryId, page, 12, "newest")
      .subscribe({
        next: (response) => {
          this.products = response.data;
          this.category = response.category;
          this.currentPage = response.page;
          this.totalPages = response.pages;
          this.loading = false;
        },
        error: (error) => {
          console.error("Error loading products:", error);
          this.loading = false;
        },
      });
  }

  onPageChange(page: number): void {
    const categoryId = this.route.snapshot.params["categoryId"];
    this.loadProducts(categoryId, page);
  }

  onSortChange(sort: string): void {
    const categoryId = this.route.snapshot.params["categoryId"];
    // Update loadProducts to accept sort parameter
    this.productService
      .getProductsByCategoryId(categoryId, 1, 12, sort)
      .subscribe(/* ... */);
  }
}
```

---

## Testing with cURL

```bash
# Test getting products by category ID
curl -X GET "http://localhost:5000/api/products/category/507f1f77bcf86cd799439011" \
  -H "Content-Type: application/json"

# Test with pagination
curl -X GET "http://localhost:5000/api/products/category/507f1f77bcf86cd799439011?page=2&limit=20" \
  -H "Content-Type: application/json"

# Test with sorting
curl -X GET "http://localhost:5000/api/products/category/507f1f77bcf86cd799439011?sort=price-low" \
  -H "Content-Type: application/json"

# Test getting products by category slug
curl -X GET "http://localhost:5000/api/products?category=electronics&lang=en" \
  -H "Content-Type: application/json"
```

---

## Testing with Postman

### Get Products by Category ID

1. **Method:** GET
2. **URL:** `http://localhost:5000/api/products/category/{{categoryId}}`
3. **Params:**
   - `page`: 1
   - `limit`: 10
   - `sort`: newest

### Get Products by Category Slug

1. **Method:** GET
2. **URL:** `http://localhost:5000/api/products`
3. **Params:**
   - `category`: electronics
   - `lang`: en
   - `page`: 1
   - `limit`: 10
   - `sort`: newest

---

## Notes

### Differences Between the Two Endpoints

1. **By Category ID** (`/api/products/category/:categoryId`)

   - Uses MongoDB ObjectId directly
   - Faster lookup (direct ID match)
   - Returns category information in response
   - Best when you already have the category ID

2. **By Category Slug** (`/api/products?category=slug&lang=en`)
   - Uses category slug (URL-friendly string)
   - Requires language parameter
   - Better for SEO-friendly URLs
   - Best for user-facing category pages

### Performance Considerations

- Both endpoints use pagination to limit data transfer
- Maximum 100 items per page to prevent overload
- Products are only returned if `isActive: true`
- Sorting is done at the database level for efficiency

### Sort Options Explained

- **newest**: Recently added products first (default)
- **oldest**: Oldest products first
- **price-low**: Cheapest products first
- **price-high**: Most expensive products first
- **name-asc**: Alphabetical order (A-Z)
- **name-desc**: Reverse alphabetical order (Z-A)

---

## Common Use Cases

### 1. Category Page with Products

Display all products in a category with pagination:

```
GET /api/products/category/507f1f77bcf86cd799439011?page=1&limit=12
```

### 2. Category Products Sorted by Price

Show products sorted by price for comparison:

```
GET /api/products/category/507f1f77bcf86cd799439011?sort=price-low
```

### 3. SEO-Friendly Category URL

Use category slug in URL for better SEO:

```
GET /api/products?category=electronics&lang=en&page=1&limit=12
```

### 4. Mobile App with Smaller Pages

Load fewer items per page for mobile:

```
GET /api/products/category/507f1f77bcf86cd799439011?page=1&limit=6
```

---

## Summary

You now have two flexible ways to get products by category:

1. **Direct Category ID lookup** - Fast and efficient when you have the ID
2. **Category Slug lookup** - SEO-friendly and user-friendly URLs

Both endpoints support:

- ✅ Pagination
- ✅ Sorting (6 different options)
- ✅ Category population (with full details)
- ✅ Active products only
- ✅ Created/Updated by user info

Choose the endpoint that best fits your use case!

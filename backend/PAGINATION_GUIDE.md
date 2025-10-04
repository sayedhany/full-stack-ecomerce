# Product Pagination Guide

## Overview

The products API now supports pagination to efficiently handle large datasets. This allows you to retrieve products in smaller, manageable chunks.

## Pagination Parameters

All query parameters are optional. Default values are used if not provided.

| Parameter  | Type    | Default | Description                         | Example                |
| ---------- | ------- | ------- | ----------------------------------- | ---------------------- |
| `page`     | integer | 1       | Page number to retrieve             | `page=2`               |
| `limit`    | integer | 10      | Number of items per page (max: 100) | `limit=20`             |
| `sort`     | string  | newest  | Sort order                          | `sort=price-low`       |
| `category` | string  | -       | Category slug filter                | `category=electronics` |
| `lang`     | string  | -       | Language for category (en/ar)       | `lang=en`              |

## Sort Options

| Value        | Description                     |
| ------------ | ------------------------------- |
| `newest`     | Newest products first (default) |
| `oldest`     | Oldest products first           |
| `price-low`  | Lowest price first              |
| `price-high` | Highest price first             |
| `name-asc`   | Name A-Z (English)              |
| `name-desc`  | Name Z-A (English)              |

## Response Format

```json
{
  "success": true,
  "count": 10,          // Number of items in current page
  "total": 45,          // Total number of products matching query
  "page": 1,            // Current page number
  "pages": 5,           // Total number of pages
  "data": [...]         // Array of products
}
```

## Usage Examples

### Basic Pagination

#### Get first page (10 items)

```bash
GET /api/products
GET /api/products?page=1
GET /api/products?page=1&limit=10
```

#### Get second page

```bash
GET /api/products?page=2
```

#### Get 20 items per page

```bash
GET /api/products?limit=20
```

#### Get third page with 25 items

```bash
GET /api/products?page=3&limit=25
```

### With Sorting

#### Newest products first (default)

```bash
GET /api/products?sort=newest
```

#### Cheapest products first

```bash
GET /api/products?sort=price-low
```

#### Most expensive products first

```bash
GET /api/products?sort=price-high
```

#### Products sorted by name

```bash
GET /api/products?sort=name-asc
```

### With Category Filter

#### Electronics, page 1, 15 items

```bash
GET /api/products?category=electronics&lang=en&page=1&limit=15
```

#### Books, sorted by price

```bash
GET /api/products?category=books&lang=en&sort=price-low
```

### Combined Parameters

#### Page 2, 20 items, sorted by price, electronics only

```bash
GET /api/products?page=2&limit=20&sort=price-low&category=electronics&lang=en
```

## JavaScript Examples

### Using Fetch API

```javascript
// Get products with pagination
async function getProducts(page = 1, limit = 10, sort = "newest") {
  const response = await fetch(
    `http://localhost:5000/api/products?page=${page}&limit=${limit}&sort=${sort}`
  );
  const data = await response.json();

  console.log(`Page ${data.page} of ${data.pages}`);
  console.log(`Showing ${data.count} of ${data.total} products`);
  console.log(data.data);

  return data;
}

// Usage
getProducts(1, 20, "price-low");
```

### With Category Filter

```javascript
async function getProductsByCategory(category, lang = "en", page = 1) {
  const response = await fetch(
    `http://localhost:5000/api/products?category=${category}&lang=${lang}&page=${page}&limit=10`
  );
  const data = await response.json();
  return data;
}

// Usage
getProductsByCategory("electronics", "en", 1);
```

### Load More Pattern

```javascript
let currentPage = 1;
let allProducts = [];

async function loadMore() {
  const response = await fetch(
    `http://localhost:5000/api/products?page=${currentPage}&limit=10`
  );
  const data = await response.json();

  allProducts = [...allProducts, ...data.data];
  currentPage++;

  // Check if more pages available
  const hasMore = currentPage <= data.pages;

  return { products: allProducts, hasMore };
}
```

### Infinite Scroll Pattern

```javascript
async function loadProducts(page, limit = 20) {
  const response = await fetch(
    `http://localhost:5000/api/products?page=${page}&limit=${limit}&sort=newest`
  );
  return await response.json();
}

// On scroll to bottom
window.addEventListener("scroll", async () => {
  if (window.innerHeight + window.scrollY >= document.body.offsetHeight) {
    const data = await loadProducts(++currentPage);
    // Append data.data to your product list
  }
});
```

## React Example

```javascript
import { useState, useEffect } from "react";

function ProductList() {
  const [products, setProducts] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadProducts();
  }, [page]);

  const loadProducts = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `http://localhost:5000/api/products?page=${page}&limit=10&sort=newest`
      );
      const data = await response.json();

      setProducts(data.data);
      setTotalPages(data.pages);
    } catch (error) {
      console.error("Error loading products:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <>
          {products.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}

          <div className="pagination">
            <button disabled={page === 1} onClick={() => setPage(page - 1)}>
              Previous
            </button>

            <span>
              Page {page} of {totalPages}
            </span>

            <button
              disabled={page === totalPages}
              onClick={() => setPage(page + 1)}>
              Next
            </button>
          </div>
        </>
      )}
    </div>
  );
}
```

## Postman Examples

### Basic Request

```
GET http://localhost:5000/api/products?page=1&limit=10
```

### With All Parameters

```
GET http://localhost:5000/api/products?page=2&limit=20&sort=price-low&category=electronics&lang=en
```

## Best Practices

### 1. **Choose Appropriate Page Size**

- Mobile: 10-20 items
- Desktop: 20-50 items
- Maximum allowed: 100 items

### 2. **Handle Empty Results**

```javascript
if (data.count === 0) {
  console.log("No products found");
}
```

### 3. **Show Pagination Info**

```javascript
console.log(`Showing ${data.count} of ${data.total} products`);
console.log(`Page ${data.page} of ${data.pages}`);
```

### 4. **Disable Navigation Buttons**

```javascript
const isFirstPage = data.page === 1;
const isLastPage = data.page === data.pages;
```

### 5. **Cache Results**

Use a state management library or local storage to cache pages:

```javascript
const cache = {};

async function getProductsWithCache(page) {
  if (cache[page]) {
    return cache[page];
  }

  const data = await fetchProducts(page);
  cache[page] = data;
  return data;
}
```

## Performance Considerations

- Default limit is 10 items (good balance for most uses)
- Maximum limit is 100 items (prevents overwhelming requests)
- Results are sorted before pagination for consistency
- Category filtering happens before pagination for accuracy

## Error Handling

```javascript
async function getProducts(page = 1) {
  try {
    const response = await fetch(
      `http://localhost:5000/api/products?page=${page}&limit=10`
    );

    if (!response.ok) {
      throw new Error("Failed to fetch products");
    }

    const data = await response.json();

    if (!data.success) {
      throw new Error(data.message);
    }

    return data;
  } catch (error) {
    console.error("Error:", error.message);
    return null;
  }
}
```

## Testing

### Test Different Page Sizes

```bash
curl "http://localhost:5000/api/products?limit=5"
curl "http://localhost:5000/api/products?limit=50"
curl "http://localhost:5000/api/products?limit=100"
```

### Test Sorting

```bash
curl "http://localhost:5000/api/products?sort=price-low&limit=5"
curl "http://localhost:5000/api/products?sort=name-asc&limit=10"
```

### Test Pagination

```bash
curl "http://localhost:5000/api/products?page=1&limit=10"
curl "http://localhost:5000/api/products?page=2&limit=10"
curl "http://localhost:5000/api/products?page=3&limit=10"
```

## Summary

Pagination improves:

- ✅ API performance
- ✅ Page load times
- ✅ User experience
- ✅ Server resource usage
- ✅ Mobile data consumption

The pagination system is flexible, efficient, and easy to use with sensible defaults!

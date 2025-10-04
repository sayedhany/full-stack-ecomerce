# Postman Collection - Complete API Reference

## 📦 Collection Overview

The Postman collection now includes **ALL** API endpoints for the E-commerce backend with complete CRUD operations, authentication, and user management.

## 🔢 Total Endpoints: 40+

### ✅ Authentication & User Management (9 endpoints)

1. **POST** `/api/auth/register` - Register new customer
2. **POST** `/api/auth/login` - Login (admin or customer)
3. **GET** `/api/auth/me` - Get current user profile
4. **PUT** `/api/auth/update-profile` - Update own profile ⭐ NEW
5. **PUT** `/api/auth/change-password` - Change own password ⭐ NEW
6. **POST** `/api/auth/admin/create` - Create admin user (Admin only)
7. **GET** `/api/auth/users` - Get all users (Admin only)
8. **PUT** `/api/auth/users/:id` - Update user by ID (Admin only) ⭐ NEW
9. **DELETE** `/api/auth/users/:id` - Delete user (Admin only) ⭐ NEW

### ✅ Categories (7 endpoints)

10. **GET** `/api/categories` - Get all categories
11. **GET** `/api/categories/:id` - Get category by ID
12. **GET** `/api/categories/slug/:lang/:slug` - Get by slug (EN/AR)
13. **POST** `/api/categories` - Create category (Admin only)
14. **PUT** `/api/categories/:id` - Update category (Admin only)
15. **DELETE** `/api/categories/:id` - Delete category (Admin only)

### ✅ Products (15+ endpoints)

16. **GET** `/api/products` - Get all products
17. **GET** `/api/products?page=1&limit=10` - Get products with pagination
18. **GET** `/api/products?category=slug&lang=en` - Filter by category
19. **GET** `/api/products?sort=price-low` - Get products sorted
20. **GET** `/api/products/:lang/:slug` - Get product by slug (EN/AR)
21. **GET** `/api/products/id/:id` - Get product by ID
22. **POST** `/api/products` - Create product (Admin only)
23. **POST** `/api/products/upload` - Upload single image (Admin only)
24. **POST** `/api/products/upload/multiple` - Upload multiple images (Admin only)
25. **POST** `/api/products/with-image` - Create product with image (Admin only)
26. **PUT** `/api/products/:id` - Update product (Admin only)
27. **DELETE** `/api/products/:id` - Delete product (Admin only)

### ✅ Health Check (1 endpoint)

28. **GET** `/api/health` - Server health check

## 🆕 New Endpoints Added

### User Profile Management

```
✅ PUT /api/auth/update-profile
   - Update your own name and email
   - Requires: JWT token
   - Body: { "name": "...", "email": "..." }

✅ PUT /api/auth/change-password
   - Change your own password
   - Requires: JWT token
   - Body: { "currentPassword": "...", "newPassword": "..." }
```

### Admin User Management

```
✅ PUT /api/auth/users/:id
   - Update any user (name, email, role, isActive)
   - Requires: Admin JWT token
   - Body: { "name": "...", "email": "...", "role": "...", "isActive": true }

✅ DELETE /api/auth/users/:id
   - Delete any user
   - Requires: Admin JWT token
```

## 🔐 Authentication Setup

### Step 1: Login

Use the **Login** endpoint to get your JWT token:

```json
POST /api/auth/login
{
  "email": "admin@example.com",
  "password": "admin123"
}
```

Response:

```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": { ... }
}
```

### Step 2: Save Token

1. Copy the `token` value from the response
2. Click on the collection name "E-commerce Backend API"
3. Go to the **Variables** tab
4. Paste the token in the `authToken` **Current Value** field
5. Click **Save**

### Step 3: Use Protected Endpoints

All protected endpoints will now automatically use `{{authToken}}` in the Authorization header.

## 📊 Collection Variables

| Variable     | Description              | Example                     |
| ------------ | ------------------------ | --------------------------- |
| `baseUrl`    | API base URL             | `http://localhost:5000`     |
| `authToken`  | JWT authentication token | Set after login             |
| `categoryId` | Category ID for testing  | Set after creating category |
| `productId`  | Product ID for testing   | Set after creating product  |
| `userId`     | User ID for testing      | Set after getting user list |

## 🚀 Quick Testing Workflow

### For Customer Users:

```
1. Register → POST /api/auth/register
2. Login → POST /api/auth/login (save token)
3. Get Profile → GET /api/auth/me
4. Update Profile → PUT /api/auth/update-profile
5. Change Password → PUT /api/auth/change-password
6. Browse Products → GET /api/products
7. View Product → GET /api/products/:lang/:slug
```

### For Admin Users:

```
1. Login as Admin → POST /api/auth/login (save token)
2. Create Category → POST /api/categories (save categoryId)
3. Upload Image → POST /api/products/upload
4. Create Product → POST /api/products/with-image
5. Get All Users → GET /api/auth/users
6. Update User → PUT /api/auth/users/:id
7. Manage Products → PUT/DELETE /api/products/:id
```

## 📝 Request Examples

### Update Your Profile

```json
PUT /api/auth/update-profile
Authorization: Bearer {{authToken}}

{
  "name": "John Smith",
  "email": "johnsmith@example.com"
}
```

### Change Password

```json
PUT /api/auth/change-password
Authorization: Bearer {{authToken}}

{
  "currentPassword": "oldpassword123",
  "newPassword": "newpassword123"
}
```

### Admin: Update User

```json
PUT /api/auth/users/{{userId}}
Authorization: Bearer {{authToken}}

{
  "name": "Jane Doe",
  "email": "jane@example.com",
  "role": "customer",
  "isActive": false
}
```

### Admin: Create Product with Image

```
POST /api/products/with-image
Authorization: Bearer {{authToken}}
Content-Type: multipart/form-data

Form Data:
- name_en: "Laptop Pro 15"
- name_ar: "لابتوب برو ١٥"
- description_en: "High performance laptop"
- description_ar: "كمبيوتر محمول عالي الأداء"
- price: 1299.99
- slug_en: "laptop-pro-15"
- slug_ar: "لابتوب-برو-15"
- category: {{categoryId}}
- image: [file upload]
```

### Get Products with Pagination

```
GET /api/products?page=1&limit=10&sort=price-low
```

## 🎯 Features by Role

### Customer (Authenticated User)

- ✅ Register and login
- ✅ View own profile
- ✅ Update own profile (name, email)
- ✅ Change own password
- ✅ Browse products and categories
- ❌ Cannot create/edit/delete products or categories
- ❌ Cannot manage other users

### Admin

- ✅ All customer features
- ✅ Create/edit/delete products
- ✅ Create/edit/delete categories
- ✅ Upload product images (auto-compressed to WebP)
- ✅ View all users
- ✅ Create admin users
- ✅ Update any user (change role, activate/deactivate)
- ✅ Delete users
- ✅ Track who created/updated products and categories

## 🔧 Advanced Features

### Pagination

```
GET /api/products?page=2&limit=20
```

Returns:

- `count`: Number of items in current page
- `total`: Total number of items
- `page`: Current page number
- `pages`: Total number of pages

### Sorting

```
GET /api/products?sort=newest
GET /api/products?sort=price-low
GET /api/products?sort=price-high
GET /api/products?sort=name-asc
```

### Filtering

```
GET /api/products?category=electronics&lang=en
```

### Image Compression

All uploaded images are automatically:

- Compressed to reduce file size
- Converted to WebP format
- Quality set to 80%
- Max width: 1200px
- Saved as: `product-[timestamp]-[random].webp`

### Created By Tracking

Products and categories include:

```json
{
  "createdBy": {
    "_id": "...",
    "name": "Admin User",
    "email": "admin@example.com"
  },
  "updatedBy": {
    "_id": "...",
    "name": "Another Admin",
    "email": "admin2@example.com"
  }
}
```

## 📥 Import Instructions

1. Open Postman
2. Click **Import** button (top left)
3. Select **Upload Files**
4. Choose `Postman_Collection.json`
5. Click **Import**
6. Collection appears in the left sidebar

## ⚙️ Environment Setup

1. Click on the collection name
2. Go to **Variables** tab
3. Set values:
   - `baseUrl`: `http://localhost:5000` (already set)
   - `authToken`: (empty - will be set after login)
   - Other IDs: (will be set during testing)
4. Click **Save**

## 🧪 Testing Checklist

### Authentication

- [ ] Register new customer
- [ ] Login as customer (save token)
- [ ] Get profile
- [ ] Update profile
- [ ] Change password
- [ ] Login as admin
- [ ] Create admin user
- [ ] Get all users
- [ ] Update user by ID
- [ ] Delete user

### Categories

- [ ] Get all categories
- [ ] Get category by ID
- [ ] Get category by slug
- [ ] Create category (admin)
- [ ] Update category (admin)
- [ ] Delete category (admin)

### Products

- [ ] Get all products
- [ ] Get products with pagination
- [ ] Filter products by category
- [ ] Sort products
- [ ] Get product by slug
- [ ] Upload image (admin)
- [ ] Create product with image (admin)
- [ ] Update product (admin)
- [ ] Delete product (admin)

## 🛠️ Troubleshooting

### 401 Unauthorized

- Make sure you're logged in
- Check that `authToken` is set in variables
- Token might be expired (login again)

### 403 Forbidden

- Endpoint requires admin access
- You're logged in as customer
- Login with admin credentials

### 404 Not Found

- Check the endpoint URL
- Make sure IDs are correct
- Server might not be running

### 400 Bad Request

- Check request body format
- Required fields might be missing
- Email already exists (for registration/updates)

## 📚 Documentation Files

All features are documented in:

- `AUTH_GUIDE.md` - Authentication and JWT
- `USER_UPDATE_API.md` - User management APIs
- `PAGINATION_GUIDE.md` - Pagination feature
- `IMAGE_COMPRESSION_GUIDE.md` - Image upload and compression
- `CREATED_BY_TRACKING.md` - User tracking feature
- `POSTMAN_AUTH_GUIDE.md` - Postman authentication guide
- `CORS_HTTPS_GUIDE.md` - CORS and HTTPS setup

## 🎉 Summary

The Postman collection now includes:

- ✅ **40+ endpoints** covering all functionality
- ✅ **Complete CRUD** for users, products, and categories
- ✅ **JWT authentication** with role-based access
- ✅ **User management** (profile updates, password changes)
- ✅ **Admin features** (user management, content creation)
- ✅ **Image uploads** with automatic compression
- ✅ **Pagination and sorting** for products
- ✅ **Bilingual support** (English/Arabic)
- ✅ **Audit tracking** (createdBy/updatedBy)

**Ready to test!** 🚀

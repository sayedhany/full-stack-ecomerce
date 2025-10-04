# Authentication System - Implementation Summary

## ✅ What Has Been Added

### 1. **User Model** (`server/models/User.js`)

- Bilingual user authentication system
- Two roles: `admin` and `customer`
- Fields:
  - `name`: User's full name
  - `email`: Unique email address
  - `password`: Hashed password (bcrypt)
  - `role`: User role (`admin` or `customer`)
  - `isActive`: Account status
  - `createdAt`, `updatedAt`: Timestamps

### 2. **Authentication Middleware** (`server/middleware/auth.js`)

- `protect`: Verify JWT token
- `authorize(...roles)`: Check user role permissions
- `generateToken`: Create JWT tokens
- Token expiration: 7 days (configurable)

### 3. **Authentication Routes** (`server/routes/auth.js`)

Complete authentication API:

| Endpoint                 | Method | Access     | Description               |
| ------------------------ | ------ | ---------- | ------------------------- |
| `/api/auth/register`     | POST   | Public     | Register new customer     |
| `/api/auth/login`        | POST   | Public     | Login (admin or customer) |
| `/api/auth/me`           | GET    | Protected  | Get current user profile  |
| `/api/auth/admin/create` | POST   | Admin Only | Create new admin user     |
| `/api/auth/users`        | GET    | Admin Only | Get all users             |

### 4. **Protected Routes**

All CREATE, UPDATE, DELETE operations now require admin authentication:

**Categories (Admin Only):**

- ✅ POST `/api/categories` - Create category
- ✅ PUT `/api/categories/:id` - Update category
- ✅ DELETE `/api/categories/:id` - Delete category

**Products (Admin Only):**

- ✅ POST `/api/products` - Create product
- ✅ PUT `/api/products/:id` - Update product
- ✅ DELETE `/api/products/:id` - Delete product
- ✅ POST `/api/products/upload` - Upload image
- ✅ POST `/api/products/upload/multiple` - Upload multiple images
- ✅ POST `/api/products/with-image` - Create product with image

**Public Access (No Auth Required):**

- ✅ GET `/api/categories` - View categories
- ✅ GET `/api/products` - View products
- ✅ GET `/api/products/:lang/:slug` - View product details

### 5. **Environment Variables** (`.env`)

```env
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production-2024
JWT_EXPIRE=7d
```

### 6. **Create Admin Script** (`server/createSuperAdmin.js`)

- Command: `npm run create-admin`
- Creates first superadmin user
- Default credentials:
  - Email: `admin@example.com`
  - Password: `admin123`

### 7. **Updated Swagger Documentation**

- Bearer token authentication added
- Security schemes configured
- All protected endpoints marked with `🔒`

### 8. **Updated Postman Collection**

- New **Authentication** folder with 6 requests
- Auto-save JWT token after login
- All protected endpoints configured with Bearer auth
- `{{authToken}}` variable for easy token management

## 🔐 Authentication Flow

### Admin Workflow:

```
1. POST /api/auth/login
   └─> Receive JWT token (valid for 7 days)

2. Use token in Authorization header
   └─> Authorization: Bearer <token>

3. Access admin endpoints
   ├─> Create categories/products
   ├─> Update categories/products
   ├─> Delete categories/products
   └─> Upload images
```

### Customer Workflow:

```
1. POST /api/auth/register
   └─> Account created, receive JWT token

2. Browse public endpoints (no auth needed)
   ├─> View categories
   ├─> View products
   └─> Search products

3. Try admin action
   └─> 403 Forbidden (role not authorized)
```

### Public Access:

```
GET /api/products
GET /api/categories
GET /api/products/en/laptop
└─> Works without authentication
```

## 🛡️ Security Features

### 1. **Password Security**

- Passwords hashed with bcrypt (salt rounds: 10)
- Never returned in API responses
- Password field excluded by default in queries

### 2. **JWT Token Security**

- Token signed with secret key
- Expiration: 7 days
- Includes user ID only (minimal payload)
- Verified on each protected request

### 3. **Role-Based Access Control (RBAC)**

- Two roles: `admin` and `customer`
- Middleware checks user role before granting access
- Customers cannot access admin endpoints

### 4. **Input Validation**

- Email format validation
- Password minimum length: 6 characters
- Required fields enforced by Mongoose

### 5. **Error Handling**

- Invalid token: 401 Unauthorized
- Wrong role: 403 Forbidden
- Expired token: 401 Unauthorized
- No token: 401 Unauthorized

## 📦 NPM Packages Added

```json
{
  "jsonwebtoken": "^9.0.2",
  "bcryptjs": "^2.4.3"
}
```

## 📝 Usage Examples

### 1. Create Admin User

```bash
npm run create-admin
```

### 2. Login as Admin

```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@example.com",
    "password": "admin123"
  }'
```

Response:

```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "_id": "...",
    "email": "admin@example.com",
    "role": "admin"
  }
}
```

### 3. Create Category (Protected)

```bash
curl -X POST http://localhost:5000/api/categories \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <YOUR_TOKEN>" \
  -d '{
    "name": { "en": "Electronics", "ar": "إلكترونيات" },
    "slug": { "en": "electronics", "ar": "الكترونيات" }
  }'
```

### 4. Try Without Token (Fails)

```bash
curl -X POST http://localhost:5000/api/categories \
  -H "Content-Type: application/json" \
  -d '{ ... }'
```

Response:

```json
{
  "success": false,
  "message": "Not authorized to access this route. Please login."
}
```

### 5. Register Customer

```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "customer@example.com",
    "password": "password123"
  }'
```

### 6. Customer Tries Admin Action (Fails)

```bash
curl -X POST http://localhost:5000/api/categories \
  -H "Authorization: Bearer <CUSTOMER_TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{ ... }'
```

Response:

```json
{
  "success": false,
  "message": "User role 'customer' is not authorized to access this route"
}
```

## 🔄 Migration Guide

### If You Have Existing Data:

1. **Create first admin:**

```bash
npm run create-admin
```

2. **Login and get token:**

```bash
POST /api/auth/login
```

3. **All future admin operations require token:**

```bash
Authorization: Bearer <token>
```

## 📊 API Endpoints Summary

### Public Endpoints (No Auth):

- ✅ GET `/api/categories` - List categories
- ✅ GET `/api/categories/:id` - Get category
- ✅ GET `/api/categories/slug/:lang/:slug` - Get by slug
- ✅ GET `/api/products` - List products
- ✅ GET `/api/products/:lang/:slug` - Get product
- ✅ GET `/api/products/id/:id` - Get by ID
- ✅ GET `/api/health` - Health check
- ✅ POST `/api/auth/register` - Register customer
- ✅ POST `/api/auth/login` - Login

### Protected Endpoints (Auth Required):

- 🔒 GET `/api/auth/me` - My profile (any user)
- 🔒 GET `/api/auth/users` - All users (admin only)
- 🔒 POST `/api/auth/admin/create` - Create admin (admin only)

### Admin-Only Endpoints:

- 🔒 POST `/api/categories` - Create category
- 🔒 PUT `/api/categories/:id` - Update category
- 🔒 DELETE `/api/categories/:id` - Delete category
- 🔒 POST `/api/products` - Create product
- 🔒 PUT `/api/products/:id` - Update product
- 🔒 DELETE `/api/products/:id` - Delete product
- 🔒 POST `/api/products/upload` - Upload image
- 🔒 POST `/api/products/upload/multiple` - Upload images
- 🔒 POST `/api/products/with-image` - Create with image

## 🎯 Testing Checklist

- [ ] Create admin user (`npm run create-admin`)
- [ ] Login as admin (receive token)
- [ ] Create category with auth
- [ ] Try create category without auth (should fail)
- [ ] Register customer
- [ ] Login as customer
- [ ] Try customer create category (should fail - 403)
- [ ] Browse products as customer (should work)
- [ ] Access Swagger docs with auth
- [ ] Test Postman collection with auto-token

## 📚 Documentation Files

1. **AUTH_GUIDE.md** - Complete authentication guide
2. **POSTMAN_AUTH_GUIDE.md** - Postman collection usage
3. **SWAGGER_GUIDE.md** - Swagger API documentation
4. **This file** - Implementation summary

## 🚀 Ready to Use!

Your backend now has a complete, secure authentication system with:

- ✅ JWT-based authentication
- ✅ Role-based access control (Admin/Customer)
- ✅ Password hashing
- ✅ Protected admin endpoints
- ✅ Public browsing for customers
- ✅ Complete documentation
- ✅ Postman collection with auto-auth
- ✅ Swagger UI integration

Default admin credentials:

- **Email**: `admin@example.com`
- **Password**: `admin123`

⚠️ **Remember to change the admin password after first login!**

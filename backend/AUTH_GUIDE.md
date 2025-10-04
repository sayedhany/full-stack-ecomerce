# Authentication & Authorization Guide

## 🔐 Overview

This API uses **JWT (JSON Web Tokens)** for authentication and role-based access control with two user roles:

- **Admin**: Full CRUD access (Create, Read, Update, Delete)
- **Customer**: Read-only access (View products and categories)

---

## 👥 User Roles

### Admin

- Can create, update, and delete products and categories
- Can upload images
- Can create new admin users
- Can view all users

### Customer

- Can view products and categories
- Can register and login
- Cannot modify any data

---

## 🚀 Getting Started

### 1. Create First Admin User

Run this command to create the superadmin account:

```bash
npm run create-admin
```

**Default Credentials:**

- Email: `admin@example.com`
- Password: `admin123`
- Role: `admin`

⚠️ **Important:** Change the password after first login!

---

## 📝 API Endpoints

### Public Endpoints (No Authentication Required)

#### Register New Customer

```bash
POST /api/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

**Response:**

```json
{
  "success": true,
  "message": "User registered successfully",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "_id": "507f1f77bcf86cd799439011",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "customer"
  }
}
```

#### Login (Admin or Customer)

```bash
POST /api/auth/login
Content-Type: application/json

{
  "email": "admin@example.com",
  "password": "admin123"
}
```

**Response:**

```json
{
  "success": true,
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "_id": "507f1f77bcf86cd799439012",
    "name": "Super Admin",
    "email": "admin@example.com",
    "role": "admin"
  }
}
```

#### View Products (Public)

```bash
GET /api/products
GET /api/products/en/laptop-pro-15
GET /api/products?category=electronics&lang=en
```

#### View Categories (Public)

```bash
GET /api/categories
GET /api/categories/:id
GET /api/categories/slug/en/electronics
```

---

### Protected Endpoints (Authentication Required)

#### Get Current User Profile

```bash
GET /api/auth/me
Authorization: Bearer <your-token>
```

---

### Admin-Only Endpoints

All these endpoints require:

1. Valid JWT token
2. User role must be `admin`

#### Create Product

```bash
POST /api/products
Authorization: Bearer <admin-token>
Content-Type: application/json

{
  "name": { "en": "Laptop", "ar": "كمبيوتر" },
  "description": { "en": "High performance", "ar": "أداء عالي" },
  "price": 999.99,
  "image": "https://example.com/laptop.jpg",
  "slug": { "en": "laptop", "ar": "كمبيوتر" },
  "category": "507f1f77bcf86cd799439011"
}
```

#### Update Product

```bash
PUT /api/products/:id
Authorization: Bearer <admin-token>
Content-Type: application/json

{
  "price": 899.99
}
```

#### Delete Product

```bash
DELETE /api/products/:id
Authorization: Bearer <admin-token>
```

#### Upload Product Image

```bash
POST /api/products/upload
Authorization: Bearer <admin-token>
Content-Type: multipart/form-data

image: <file>
```

#### Create Category

```bash
POST /api/categories
Authorization: Bearer <admin-token>
Content-Type: application/json

{
  "name": { "en": "Electronics", "ar": "إلكترونيات" },
  "slug": { "en": "electronics", "ar": "الكترونيات" }
}
```

#### Update Category

```bash
PUT /api/categories/:id
Authorization: Bearer <admin-token>
```

#### Delete Category

```bash
DELETE /api/categories/:id
Authorization: Bearer <admin-token>
```

#### Create New Admin User

```bash
POST /api/auth/admin/create
Authorization: Bearer <admin-token>
Content-Type: application/json

{
  "name": "New Admin",
  "email": "newadmin@example.com",
  "password": "admin123"
}
```

#### Get All Users

```bash
GET /api/auth/users
Authorization: Bearer <admin-token>
```

---

## 🔑 Using JWT Tokens

### 1. Get Token

Login to receive a JWT token:

```bash
POST /api/auth/login
{
  "email": "admin@example.com",
  "password": "admin123"
}
```

### 2. Use Token in Requests

Add the token to the `Authorization` header:

```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### Token Details

- **Expiration**: 7 days (configurable in `.env`)
- **Algorithm**: HS256
- **Format**: Bearer token

---

## 📮 Postman Setup

### 1. Login and Get Token

1. Send POST request to `/api/auth/login`
2. Copy the `token` from response

### 2. Set Authorization for Collection

1. Go to collection settings
2. Authorization tab
3. Type: **Bearer Token**
4. Token: Paste your token

### 3. Or Set for Individual Requests

1. Go to request
2. Authorization tab
3. Type: **Bearer Token**
4. Token: `{{token}}`

### 4. Save Token as Variable

In login request's **Tests** tab:

```javascript
if (pm.response.code === 200) {
  const response = pm.response.json();
  pm.collectionVariables.set("token", response.token);
  pm.collectionVariables.set("userId", response.user._id);
}
```

---

## 🛡️ Error Responses

### 401 Unauthorized - No Token

```json
{
  "success": false,
  "message": "Not authorized to access this route. Please login."
}
```

### 401 Unauthorized - Invalid Token

```json
{
  "success": false,
  "message": "Token is invalid or has expired. Please login again."
}
```

### 403 Forbidden - Wrong Role

```json
{
  "success": false,
  "message": "User role 'customer' is not authorized to access this route"
}
```

### 400 Bad Request - User Exists

```json
{
  "success": false,
  "message": "User with this email already exists"
}
```

---

## 🔒 Security Best Practices

### 1. Change Default Admin Password

```bash
# After first login, update password via API or database
```

### 2. Keep JWT Secret Secure

```env
# In .env file
JWT_SECRET=your-very-long-and-secure-random-string-here
```

### 3. Use HTTPS in Production

```javascript
// Only accept requests over HTTPS
```

### 4. Set Short Token Expiration

```env
# In .env file
JWT_EXPIRE=7d  # Or shorter: 1d, 12h, etc.
```

### 5. Implement Token Refresh

```javascript
// Add refresh token endpoint (optional)
```

---

## 🧪 Testing Workflow

### Test as Customer

1. Register: `POST /api/auth/register`
2. Login: `POST /api/auth/login`
3. Get token from response
4. View products: `GET /api/products` (✅ Works)
5. Try to create product: `POST /api/products` (❌ Forbidden)

### Test as Admin

1. Login: `POST /api/auth/login` with admin credentials
2. Get token from response
3. Create product: `POST /api/products` (✅ Works)
4. Update product: `PUT /api/products/:id` (✅ Works)
5. Delete product: `DELETE /api/products/:id` (✅ Works)

---

## 📊 User Model

```javascript
{
  _id: ObjectId,
  name: String,           // Required
  email: String,          // Required, unique, lowercase
  password: String,       // Required, hashed with bcrypt
  role: String,           // 'admin' or 'customer'
  isActive: Boolean,      // Default: true
  createdAt: Date,
  updatedAt: Date
}
```

---

## 🔧 Environment Variables

Add to `server/.env`:

```env
# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production-2024
JWT_EXPIRE=7d

# MongoDB
MONGODB_URI=mongodb+srv://...

# Server
PORT=5000
NODE_ENV=development
```

---

## 📚 Additional Resources

- **Swagger Docs**: http://localhost:5000/api-docs
- **JWT.io**: https://jwt.io (decode tokens)
- **Bcrypt**: Password hashing library
- **Mongoose**: MongoDB ODM

---

## 🎯 Quick Reference

| Endpoint                       | Method | Auth | Role  | Description       |
| ------------------------------ | ------ | ---- | ----- | ----------------- |
| `/api/auth/register`           | POST   | ❌   | -     | Register customer |
| `/api/auth/login`              | POST   | ❌   | -     | Login user        |
| `/api/auth/me`                 | GET    | ✅   | Any   | Get profile       |
| `/api/auth/admin/create`       | POST   | ✅   | Admin | Create admin      |
| `/api/auth/users`              | GET    | ✅   | Admin | List users        |
| `/api/products` (GET)          | GET    | ❌   | -     | View products     |
| `/api/products` (POST)         | POST   | ✅   | Admin | Create product    |
| `/api/products/:id` (PUT)      | PUT    | ✅   | Admin | Update product    |
| `/api/products/:id` (DELETE)   | DELETE | ✅   | Admin | Delete product    |
| `/api/categories` (GET)        | GET    | ❌   | -     | View categories   |
| `/api/categories` (POST)       | POST   | ✅   | Admin | Create category   |
| `/api/categories/:id` (PUT)    | PUT    | ✅   | Admin | Update category   |
| `/api/categories/:id` (DELETE) | DELETE | ✅   | Admin | Delete category   |

---

**Ready to use!** 🚀 Start by creating your admin user with `npm run create-admin`

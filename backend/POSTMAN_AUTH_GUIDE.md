# Updated Postman Collection Guide - With Authentication

## 🔐 Authentication System

The backend now includes JWT-based authentication with two roles:

- **Admin**: Full access (Create, Read, Update, Delete)
- **Customer**: Read-only access

## 📥 Import the Updated Collection

1. Open Postman
2. Click **Import**
3. Select `Postman_Collection.json`
4. Click **Import**

## 🚀 Quick Start Guide

### Step 1: Login as Admin

1. Open **Authentication** → **Login Admin**
2. Click **Send**
3. Default credentials:
   ```json
   {
     "email": "admin@example.com",
     "password": "admin123"
   }
   ```
4. The token will be **automatically saved** to `{{authToken}}` variable
5. ✅ You're now authenticated!

### Step 2: Test Protected Endpoints

Now you can test all admin endpoints:

- Create Category
- Update Category
- Delete Category
- Create Product
- Update Product
- Delete Product
- Upload Images

## 📋 Collection Structure

```
E-commerce Backend API/
├── Health Check/
│   └── Server Health Check
├── Authentication/ ⭐ NEW
│   ├── Register Customer
│   ├── Login Admin (auto-saves token)
│   ├── Login Customer (auto-saves token)
│   ├── Get My Profile (requires auth)
│   ├── Create Admin User (admin only)
│   └── Get All Users (admin only)
├── Categories/
│   ├── Get All Categories (public)
│   ├── Get Category by ID (public)
│   ├── Get Category by Slug - EN (public)
│   ├── Get Category by Slug - AR (public)
│   ├── Create Category (admin only) 🔒
│   ├── Update Category (admin only) 🔒
│   └── Delete Category (admin only) 🔒
├── Products/
│   ├── Get All Products (public)
│   ├── Get Products by Category - EN (public)
│   ├── Get Products by Category - AR (public)
│   ├── Get Product by Slug - EN (public)
│   ├── Get Product by Slug - AR (public)
│   ├── Get Product by ID (public)
│   ├── Create Product (admin only) 🔒
│   ├── Update Product (admin only) 🔒
│   └── Delete Product (admin only) 🔒
├── Image Upload/
│   ├── Upload Single Product Image (admin only) 🔒
│   ├── Upload Multiple Product Images (admin only) 🔒
│   └── Create Product with Image Upload (admin only) 🔒
└── Sample Data Examples/
    ├── Create Category - Clothing (admin only) 🔒
    ├── Create Category - Books (admin only) 🔒
    ├── Create Product - Wireless Headphones (admin only) 🔒
    └── Create Product - T-Shirt (admin only) 🔒
```

🔒 = Requires Admin Authentication

## 🔑 Collection Variables

The collection uses these variables:

| Variable     | Description                      | Example                                   |
| ------------ | -------------------------------- | ----------------------------------------- |
| `baseUrl`    | API base URL                     | `http://localhost:5000`                   |
| `authToken`  | JWT token (auto-set after login) | `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...` |
| `categoryId` | Category ID for testing          | `507f1f77bcf86cd799439011`                |
| `productId`  | Product ID for testing           | `507f1f77bcf86cd799439012`                |

## 📝 Testing Workflow

### For Admin Users:

#### 1. Login

```
POST /api/auth/login
Body: {
  "email": "admin@example.com",
  "password": "admin123"
}
```

✅ Token automatically saved to `{{authToken}}`

#### 2. Create Category

```
POST /api/categories
Headers: Authorization: Bearer {{authToken}}
Body: {
  "name": { "en": "Electronics", "ar": "إلكترونيات" },
  "slug": { "en": "electronics", "ar": "الكترونيات" }
}
```

✅ Save the `_id` to `{{categoryId}}`

#### 3. Upload Product Image

```
POST /api/products/upload
Headers: Authorization: Bearer {{authToken}}
Body: form-data with "image" file
```

✅ Copy the `imageUrl` from response

#### 4. Create Product

```
POST /api/products
Headers: Authorization: Bearer {{authToken}}
Body: {
  "name": { "en": "Laptop", "ar": "لابتوب" },
  ...
  "category": "{{categoryId}}",
  "image": "<imageUrl from step 3>"
}
```

✅ Save the `_id` to `{{productId}}`

#### 5. Update Product

```
PUT /api/products/{{productId}}
Headers: Authorization: Bearer {{authToken}}
Body: { "price": 999.99 }
```

#### 6. Delete Product

```
DELETE /api/products/{{productId}}
Headers: Authorization: Bearer {{authToken}}
```

### For Customer Users:

#### 1. Register

```
POST /api/auth/register
Body: {
  "name": "John Doe",
  "email": "customer@example.com",
  "password": "password123"
}
```

✅ Token automatically saved

#### 2. Browse Products (No Auth Required)

```
GET /api/products
GET /api/products?category=electronics&lang=en
GET /api/products/en/laptop-pro-15
```

#### 3. Try to Create Product (Will Fail - Admin Only)

```
POST /api/products
Headers: Authorization: Bearer {{authToken}}
```

❌ Response: 403 Forbidden - "User role 'customer' is not authorized"

## 🔐 Authentication Features

### Automatic Token Management

The Login requests include a **Test script** that automatically saves the token:

```javascript
if (pm.response.code === 200) {
  const response = pm.response.json();
  pm.collectionVariables.set("authToken", response.token);
  console.log("Token saved:", response.token);
}
```

You don't need to manually copy/paste tokens!

### Bearer Token Authentication

All protected endpoints automatically use:

```
Authorization: Bearer {{authToken}}
```

This is configured in the **Auth** tab of each protected request.

## 🎯 Testing Scenarios

### Scenario 1: Full Admin Workflow

1. **Login Admin** → Token saved
2. **Create Category** → Save ID
3. **Create Product** → Use category ID
4. **Get All Products** → Verify product exists
5. **Update Product** → Change price
6. **Delete Product** → Remove product

### Scenario 2: Customer Access

1. **Register Customer** → Account created
2. **Login Customer** → Token saved
3. **Get Products** → Works (public)
4. **Get Product by Slug** → Works (public)
5. **Try Create Product** → Fails (403 Forbidden)

### Scenario 3: No Authentication

1. **Get All Categories** → Works (public)
2. **Get All Products** → Works (public)
3. **Try Create Category** → Fails (401 Unauthorized)

### Scenario 4: Image Upload

1. **Login Admin** → Token saved
2. **Upload Single Image** → Get imageUrl
3. **Create Product with imageUrl** → Product created
4. **Access image** → `http://localhost:5000/uploads/filename.jpg`

## 🔍 Response Examples

### Success - Login

```json
{
  "success": true,
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "_id": "507f1f77bcf86cd799439011",
    "name": "Super Admin",
    "email": "admin@example.com",
    "role": "admin"
  }
}
```

### Success - Create Product

```json
{
  "success": true,
  "message": "Product created successfully",
  "data": {
    "_id": "507f1f77bcf86cd799439012",
    "name": { "en": "Laptop", "ar": "لابتوب" },
    "price": 1299.99,
    "category": {
      "_id": "507f1f77bcf86cd799439011",
      "name": { "en": "Electronics", "ar": "إلكترونيات" }
    }
  }
}
```

### Error - Unauthorized (No Token)

```json
{
  "success": false,
  "message": "Not authorized to access this route. Please login."
}
```

### Error - Forbidden (Wrong Role)

```json
{
  "success": false,
  "message": "User role 'customer' is not authorized to access this route"
}
```

### Error - Invalid Token

```json
{
  "success": false,
  "message": "Token is invalid or has expired. Please login again."
}
```

## 💡 Pro Tips

### 1. **Environment Setup**

Create different environments in Postman:

- **Local Dev**: `baseUrl = http://localhost:5000`
- **Staging**: `baseUrl = https://staging.yourdomain.com`
- **Production**: `baseUrl = https://api.yourdomain.com`

### 2. **Quick Token Refresh**

If token expires (after 7 days):

- Just run **Login Admin** or **Login Customer** again
- Token will be automatically updated

### 3. **Test Both Roles**

- Login as Admin → Test admin features
- Login as Customer → Verify restrictions work

### 4. **View Console Output**

Open Postman Console (View → Show Postman Console) to see:

- Token save confirmations
- Request/response details
- Debugging information

### 5. **Save Responses**

Click **Save Response** → **Save as Example** to document API behavior

## 🐛 Troubleshooting

### Token Not Saving

- Check Postman Console for errors
- Verify login was successful (200 response)
- Check Collection Variables tab for `authToken`

### 401 Unauthorized

- Token might be expired (login again)
- Token might be missing (check variable)
- Server might have restarted (login again)

### 403 Forbidden

- You're logged in as customer trying admin action
- Login as admin user instead

### 404 Not Found

- Check if server is running
- Verify `baseUrl` is correct
- Check endpoint path

## 📚 Additional Resources

- **API Documentation**: `README.md`
- **Authentication Guide**: `AUTH_GUIDE.md`
- **Swagger UI**: `http://localhost:5000/api-docs`
- **Quick Start**: `QUICKSTART.md`

## 🎉 Ready to Test!

1. Import the collection
2. Login as Admin
3. Start creating categories and products!

The authentication is now fully integrated and token management is automatic! 🚀

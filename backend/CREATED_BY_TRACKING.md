# Created By / Updated By Tracking

## Overview

All products and categories now track which admin user created or last updated them using JWT authentication.

## Features

### 📝 Automatic Tracking

- **createdBy**: Automatically set when a product/category is created
- **updatedBy**: Automatically set when a product/category is updated
- Both fields reference the authenticated admin user

### 🔍 User Information

When fetching products or categories, you'll see:

```json
{
  "_id": "507f1f77bcf86cd799439011",
  "name": {
    "en": "Laptop Pro 15",
    "ar": "لابتوب برو ١٥"
  },
  "createdBy": {
    "_id": "507f1f77bcf86cd799439012",
    "name": "Admin User",
    "email": "admin@example.com"
  },
  "updatedBy": {
    "_id": "507f1f77bcf86cd799439013",
    "name": "Another Admin",
    "email": "admin2@example.com"
  },
  "createdAt": "2024-10-04T10:30:00.000Z",
  "updatedAt": "2024-10-04T15:45:00.000Z"
}
```

## How It Works

### 1. Authentication Required

Only authenticated admin users can create/update products and categories:

```http
POST /api/products
Authorization: Bearer YOUR_JWT_TOKEN
```

### 2. Automatic User Assignment

When creating a product:

```javascript
// The system automatically adds:
{
  ...yourProductData,
  createdBy: req.user._id  // From JWT token
}
```

When updating a product:

```javascript
// The system automatically adds:
{
  ...yourUpdateData,
  updatedBy: req.user._id  // From JWT token
}
```

### 3. Populated User Info

All GET requests automatically include creator/updater information:

```javascript
.populate('createdBy updatedBy', 'name email')
```

## API Examples

### Create Product (Auto-tracks Creator)

```bash
curl -X POST http://localhost:5000/api/products \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": {"en": "Laptop", "ar": "لابتوب"},
    "description": {"en": "Great laptop", "ar": "لابتوب رائع"},
    "price": 999,
    "image": "https://example.com/laptop.jpg",
    "slug": {"en": "laptop", "ar": "لابتوب"},
    "category": "CATEGORY_ID"
  }'
```

Response includes:

```json
{
  "success": true,
  "data": {
    "_id": "...",
    "name": {...},
    "createdBy": {
      "_id": "507f1f77bcf86cd799439012",
      "name": "Admin User",
      "email": "admin@example.com"
    },
    "createdAt": "2024-10-04T10:30:00.000Z"
  }
}
```

### Update Product (Auto-tracks Updater)

```bash
curl -X PUT http://localhost:5000/api/products/PRODUCT_ID \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "price": 899
  }'
```

Response includes:

```json
{
  "success": true,
  "data": {
    "_id": "...",
    "price": 899,
    "createdBy": {
      "_id": "507f1f77bcf86cd799439012",
      "name": "Original Admin",
      "email": "admin@example.com"
    },
    "updatedBy": {
      "_id": "507f1f77bcf86cd799439013",
      "name": "Different Admin",
      "email": "admin2@example.com"
    },
    "createdAt": "2024-10-04T10:30:00.000Z",
    "updatedAt": "2024-10-04T15:45:00.000Z"
  }
}
```

### Get All Products (Shows Creator/Updater)

```bash
curl http://localhost:5000/api/products
```

Each product includes createdBy and updatedBy information.

## Database Schema

### Product Model

```javascript
{
  // ... other fields
  createdBy: {
    type: ObjectId,
    ref: "User",
    required: false
  },
  updatedBy: {
    type: ObjectId,
    ref: "User",
    required: false
  }
}
```

### Category Model

```javascript
{
  // ... other fields
  createdBy: {
    type: ObjectId,
    ref: "User",
    required: false
  },
  updatedBy: {
    type: ObjectId,
    ref: "User",
    required: false
  }
}
```

## Benefits

### 📊 Audit Trail

- Track who created each product/category
- Track who last modified each item
- Accountability for changes

### 🔍 Reporting

- See which admin is most active
- Track creation/modification patterns
- Identify content ownership

### 🛡️ Security

- JWT authentication required
- Only admins can create/update
- Automatic assignment prevents tampering

## Important Notes

### ⚠️ Fields are Optional

- `createdBy` and `updatedBy` are optional in the schema
- Existing data without these fields will still work
- New items will automatically include these fields

### 🔄 Backward Compatibility

- Old products/categories without createdBy/updatedBy still work
- API responses handle missing fields gracefully
- No migration required for existing data

### 👤 User Information Included

Only name and email are returned:

```json
"createdBy": {
  "_id": "...",
  "name": "Admin User",
  "email": "admin@example.com"
  // password and other sensitive data excluded
}
```

## Testing

### 1. Login as Admin

```bash
POST /api/auth/login
{
  "email": "admin@example.com",
  "password": "admin123"
}
```

Save the token from response.

### 2. Create Product with Token

```bash
POST /api/products
Authorization: Bearer YOUR_TOKEN
```

### 3. Verify Creator Info

```bash
GET /api/products/PRODUCT_ID
```

Check that `createdBy` matches your admin user.

### 4. Update as Different Admin

Login as different admin and update the product.

### 5. Verify Updater Info

Check that `updatedBy` shows the second admin.

## Summary

✅ **Automatic tracking** - No manual user assignment needed
✅ **Full audit trail** - Know who created and modified each item
✅ **Secure** - JWT authentication required
✅ **Backward compatible** - Works with existing data
✅ **Privacy-aware** - Only shows name and email, not passwords

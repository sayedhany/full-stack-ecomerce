# User Management API Documentation

## Overview

Complete user management endpoints including profile updates, password changes, and admin user management.

## Endpoints

### 1. Update Current User Profile

**Endpoint:** `PUT /api/auth/update-profile`  
**Authentication:** Required (Any authenticated user)  
**Description:** Update your own name and email

#### Request Headers

```
Authorization: Bearer YOUR_JWT_TOKEN
Content-Type: application/json
```

#### Request Body

```json
{
  "name": "John Smith",
  "email": "johnsmith@example.com"
}
```

#### Success Response (200)

```json
{
  "success": true,
  "message": "Profile updated successfully",
  "user": {
    "_id": "507f1f77bcf86cd799439011",
    "name": "John Smith",
    "email": "johnsmith@example.com",
    "role": "customer",
    "isActive": true,
    "createdAt": "2024-10-04T10:00:00.000Z",
    "updatedAt": "2024-10-04T15:30:00.000Z"
  }
}
```

#### Error Response (400)

```json
{
  "success": false,
  "message": "Email already in use"
}
```

#### Example

```bash
curl -X PUT http://localhost:5000/api/auth/update-profile \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Smith",
    "email": "johnsmith@example.com"
  }'
```

---

### 2. Change Password

**Endpoint:** `PUT /api/auth/change-password`  
**Authentication:** Required (Any authenticated user)  
**Description:** Change your own password

#### Request Headers

```
Authorization: Bearer YOUR_JWT_TOKEN
Content-Type: application/json
```

#### Request Body

```json
{
  "currentPassword": "oldpassword123",
  "newPassword": "newpassword123"
}
```

#### Success Response (200)

```json
{
  "success": true,
  "message": "Password changed successfully"
}
```

#### Error Response (401)

```json
{
  "success": false,
  "message": "Current password is incorrect"
}
```

#### Validation Rules

- `currentPassword`: Required
- `newPassword`: Required, minimum 6 characters

#### Example

```bash
curl -X PUT http://localhost:5000/api/auth/change-password \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "currentPassword": "oldpassword123",
    "newPassword": "newpassword123"
  }'
```

---

### 3. Update User by ID (Admin Only)

**Endpoint:** `PUT /api/auth/users/:id`  
**Authentication:** Required (Admin only)  
**Description:** Update any user's information

#### Request Headers

```
Authorization: Bearer ADMIN_JWT_TOKEN
Content-Type: application/json
```

#### Request Body

```json
{
  "name": "Jane Doe",
  "email": "jane@example.com",
  "role": "customer",
  "isActive": true
}
```

#### Parameters

- `id` (path parameter): User ID to update

#### Success Response (200)

```json
{
  "success": true,
  "message": "User updated successfully",
  "user": {
    "_id": "507f1f77bcf86cd799439011",
    "name": "Jane Doe",
    "email": "jane@example.com",
    "role": "customer",
    "isActive": true,
    "createdAt": "2024-10-04T10:00:00.000Z",
    "updatedAt": "2024-10-04T16:00:00.000Z"
  }
}
```

#### Error Responses

**404 - User Not Found**

```json
{
  "success": false,
  "message": "User not found"
}
```

**403 - Not Authorized**

```json
{
  "success": false,
  "message": "User role 'customer' is not authorized to access this route"
}
```

#### Example

```bash
curl -X PUT http://localhost:5000/api/auth/users/507f1f77bcf86cd799439011 \
  -H "Authorization: Bearer ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Jane Doe",
    "role": "customer",
    "isActive": false
  }'
```

---

### 4. Delete User (Admin Only)

**Endpoint:** `DELETE /api/auth/users/:id`  
**Authentication:** Required (Admin only)  
**Description:** Delete a user from the system

#### Request Headers

```
Authorization: Bearer ADMIN_JWT_TOKEN
```

#### Parameters

- `id` (path parameter): User ID to delete

#### Success Response (200)

```json
{
  "success": true,
  "message": "User deleted successfully",
  "user": {
    "_id": "507f1f77bcf86cd799439011",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "customer"
  }
}
```

#### Error Response (404)

```json
{
  "success": false,
  "message": "User not found"
}
```

#### Example

```bash
curl -X DELETE http://localhost:5000/api/auth/users/507f1f77bcf86cd799439011 \
  -H "Authorization: Bearer ADMIN_TOKEN"
```

---

## Complete User Management Flow

### For Regular Users (Customers)

#### 1. Register

```bash
POST /api/auth/register
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

#### 2. Login

```bash
POST /api/auth/login
{
  "email": "john@example.com",
  "password": "password123"
}
```

#### 3. Get Profile

```bash
GET /api/auth/me
Authorization: Bearer TOKEN
```

#### 4. Update Profile

```bash
PUT /api/auth/update-profile
Authorization: Bearer TOKEN
{
  "name": "John Smith",
  "email": "johnsmith@example.com"
}
```

#### 5. Change Password

```bash
PUT /api/auth/change-password
Authorization: Bearer TOKEN
{
  "currentPassword": "password123",
  "newPassword": "newpassword123"
}
```

---

### For Admins

#### 1. Create Admin User

```bash
POST /api/auth/admin/create
Authorization: Bearer ADMIN_TOKEN
{
  "name": "New Admin",
  "email": "newadmin@example.com",
  "password": "admin123"
}
```

#### 2. Get All Users

```bash
GET /api/auth/users
Authorization: Bearer ADMIN_TOKEN
```

#### 3. Update Any User

```bash
PUT /api/auth/users/:id
Authorization: Bearer ADMIN_TOKEN
{
  "role": "admin",
  "isActive": true
}
```

#### 4. Delete User

```bash
DELETE /api/auth/users/:id
Authorization: Bearer ADMIN_TOKEN
```

---

## JavaScript/Fetch Examples

### Update Profile

```javascript
const updateProfile = async (name, email, token) => {
  const response = await fetch(
    "http://localhost:5000/api/auth/update-profile",
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ name, email }),
    }
  );

  const data = await response.json();
  return data;
};

// Usage
const result = await updateProfile(
  "John Smith",
  "john@example.com",
  "YOUR_TOKEN"
);
```

### Change Password

```javascript
const changePassword = async (currentPassword, newPassword, token) => {
  const response = await fetch(
    "http://localhost:5000/api/auth/change-password",
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ currentPassword, newPassword }),
    }
  );

  const data = await response.json();
  return data;
};

// Usage
const result = await changePassword("oldpass123", "newpass123", "YOUR_TOKEN");
```

### Update User (Admin)

```javascript
const updateUser = async (userId, updates, adminToken) => {
  const response = await fetch(
    `http://localhost:5000/api/auth/users/${userId}`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${adminToken}`,
      },
      body: JSON.stringify(updates),
    }
  );

  const data = await response.json();
  return data;
};

// Usage
const result = await updateUser(
  "USER_ID",
  {
    role: "admin",
    isActive: false,
  },
  "ADMIN_TOKEN"
);
```

---

## Security Notes

### Password Security

- Passwords are hashed using bcryptjs
- Minimum length: 6 characters
- Current password required to change password
- Password never returned in API responses

### Role-Based Access

- **Customer**: Can update own profile and change own password
- **Admin**: Can update/delete any user, change roles, deactivate accounts

### Email Uniqueness

- Email validation on registration and updates
- Cannot change email to one already in use
- Email check is case-insensitive

### Token Validation

- All update endpoints require valid JWT token
- Token must not be expired
- User must be active

---

## Error Codes

| Code | Meaning                                      |
| ---- | -------------------------------------------- |
| 200  | Success                                      |
| 400  | Bad Request (validation error, email in use) |
| 401  | Unauthorized (invalid token, wrong password) |
| 403  | Forbidden (insufficient permissions)         |
| 404  | Not Found (user doesn't exist)               |
| 500  | Server Error                                 |

---

## Postman Collection

All these endpoints are included in the Postman collection at:

```
Postman_Collection.json
```

Import it to test all user management APIs easily!

---

## Summary

### Available User Update Operations:

✅ **Self-Service (Any User):**

- Update own profile (name, email)
- Change own password

✅ **Admin Only:**

- Update any user's information
- Change user roles
- Activate/deactivate accounts
- Delete users

All operations are secured with JWT authentication and role-based authorization.

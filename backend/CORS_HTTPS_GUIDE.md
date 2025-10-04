# CORS and HTTPS Configuration Guide

## Current Setup

Your server is running on **HTTP** at `http://localhost:5000`

## Issue

You're trying to access it via **HTTPS** at `https://localhost:5000` which won't work because:
1. The server doesn't have SSL certificates
2. HTTP and HTTPS are different protocols

## Solution 1: Use HTTP (Recommended for Development)

### Change your frontend requests to:
```
http://localhost:5000/api/auth/login
```

### In your frontend code:
```javascript
// ✅ Correct
const API_URL = 'http://localhost:5000';

// ❌ Wrong
const API_URL = 'https://localhost:5000';
```

## Solution 2: Enable HTTPS on Backend (Advanced)

If you need HTTPS for development (e.g., testing with features that require secure context):

### 1. Install packages:
```bash
pnpm add https fs
```

### 2. Generate self-signed SSL certificate:

**Windows (PowerShell):**
```powershell
# Using OpenSSL (install from https://slproweb.com/products/Win32OpenSSL.html)
openssl req -x509 -newkey rsa:4096 -keyout key.pem -out cert.pem -days 365 -nodes
```

**Or use Node to generate:**
```bash
node -e "require('crypto').generateKeyPairSync('rsa', {modulusLength: 2048,publicKeyEncoding: {type: 'spki', format: 'pem'},privateKeyEncoding: {type: 'pkcs8', format: 'pem'}});"
```

### 3. Update server.js to support HTTPS:
```javascript
const https = require('https');
const fs = require('fs');
const app = require('./app');

const PORT = process.env.PORT || 5000;

// HTTPS options (if certificates exist)
let server;
try {
  const options = {
    key: fs.readFileSync('key.pem'),
    cert: fs.readFileSync('cert.pem')
  };
  server = https.createServer(options, app);
  console.log('🔒 HTTPS enabled');
} catch (err) {
  // Fallback to HTTP if certificates not found
  const http = require('http');
  server = http.createServer(app);
  console.log('⚠️  Running on HTTP (certificates not found)');
}

server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
```

## Current CORS Configuration

Your backend already allows:
✅ `http://localhost:*` (any port)
✅ `https://localhost:*` (any port)
✅ `http://127.0.0.1:*` (any port)
✅ `https://127.0.0.1:*` (any port)
✅ All origins in development mode

### Allowed methods:
- GET, POST, PUT, DELETE, PATCH, OPTIONS

### Allowed headers:
- Content-Type
- Authorization

### Credentials:
- ✅ Enabled (cookies and auth headers allowed)

## Testing

### Test with curl (HTTP):
```bash
curl http://localhost:5000/api/health
```

### Test with curl (HTTPS - will fail without certificates):
```bash
curl https://localhost:5000/api/health
```

### Test CORS from browser:
```javascript
fetch('http://localhost:5000/api/health')
  .then(res => res.json())
  .then(data => console.log(data));
```

## Common Issues

### Issue 1: Mixed Content Error
If your frontend is on HTTPS, it cannot call HTTP APIs.

**Solution:**
- Run backend on HTTPS (Solution 2)
- Or run frontend on HTTP

### Issue 2: CORS Error from Browser
If you see "CORS policy" error:

**Check:**
1. Is your frontend URL matching the allowed origins?
2. Are you sending the correct headers?
3. Is the server running?

**Current backend logs will show:**
```
📤 [timestamp] POST /api/auth/login
   IP: ::1
   📝 Body: { email: "...", password: "..." }
✅ Response: 200 OK - 150ms
```

### Issue 3: Self-Signed Certificate Warning
Browsers will warn about self-signed certificates.

**Solutions:**
1. Click "Advanced" → "Proceed to localhost (unsafe)" - OK for development
2. Add certificate to trusted store (varies by OS)
3. Use HTTP for development instead

## Recommended Development Setup

### Backend:
```
http://localhost:5000
```

### Frontend:
```
http://localhost:3000  (React)
http://localhost:5173  (Vite)
http://localhost:8080  (Vue)
```

### API Calls:
```javascript
// .env or config
VITE_API_URL=http://localhost:5000
REACT_APP_API_URL=http://localhost:5000

// Usage
const response = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/login`, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({ email, password })
});
```

## Production Setup

For production, you should:
1. Use a reverse proxy (nginx, Apache)
2. Get real SSL certificates (Let's Encrypt)
3. Set specific allowed origins in CORS
4. Use environment variables

### Example production CORS:
```javascript
const allowedOrigins = [
  'https://yourdomain.com',
  'https://www.yourdomain.com',
  'https://app.yourdomain.com'
];
```

## Summary

**For Development:**
- ✅ Use HTTP: `http://localhost:5000`
- ❌ Don't use HTTPS without certificates

**For Production:**
- ✅ Use HTTPS with real certificates
- ✅ Set specific allowed origins
- ✅ Use reverse proxy (nginx)

**Current Status:**
- Server is running on HTTP
- CORS allows all localhost origins
- Ready for development use

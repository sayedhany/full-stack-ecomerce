# Request Logging Documentation

## 📊 Logging System Overview

Your API now includes comprehensive request logging to help you monitor and debug API calls in real-time.

## 🎯 Features

### 1. **HTTP Request Logger (Morgan)**

- Production-ready HTTP request logger
- Different formats for development and production
- Automatic color-coding in development mode

### 2. **Custom Detailed Logger**

- Emoji indicators for different request types
- Request body logging for POST/PUT/PATCH
- Query parameter logging
- Response time tracking
- Status code indicators

## 📝 Log Output Format

### Request Log

```
📤 [2025-10-04T10:30:45.123Z] POST /api/products
   IP: ::1
   📝 Body: {
     "name": {
       "en": "Laptop",
       "ar": "لابتوب"
     },
     "price": 999.99
   }
✅ Response: 201 Created - 45ms
```

### Query Parameters Log

```
📥 [2025-10-04T10:30:45.123Z] GET /api/products
   IP: ::1
   🔍 Query: { category: 'electronics', lang: 'en' }
✅ Response: 200 OK - 23ms
```

## 🎨 Emoji Indicators

### Request Method Emojis

| Method | Emoji | Description             |
| ------ | ----- | ----------------------- |
| GET    | 📥    | Retrieving data         |
| POST   | 📤    | Creating new data       |
| PUT    | ✏️    | Updating data (full)    |
| PATCH  | 🔧    | Updating data (partial) |
| DELETE | 🗑️    | Deleting data           |
| Other  | 📡    | Other methods           |

### Response Status Emojis

| Status Range | Emoji | Meaning      |
| ------------ | ----- | ------------ |
| 200-299      | ✅    | Success      |
| 400-499      | ⚠️    | Client Error |
| 500-599      | ❌    | Server Error |

## 📋 What Gets Logged

### Always Logged

- ✅ Timestamp (ISO format)
- ✅ HTTP Method
- ✅ Request URL/Path
- ✅ Client IP Address
- ✅ Response Status Code
- ✅ Response Time (ms)

### Conditionally Logged

- ✅ Request Body (POST/PUT/PATCH only)
- ✅ Query Parameters (when present)
- ✅ Headers (optional, currently commented out)

## 🔧 Configuration

### Environment-Based Logging

**Development Mode:**

```javascript
// Detailed, colorful output
NODE_ENV=development npm run dev
```

**Production Mode:**

```javascript
// Combined format, suitable for log files
NODE_ENV=production npm start
```

### Morgan Formats

The logging system uses different Morgan formats based on environment:

**Development:**

```
GET /api/products 200 23.456 ms - 1234
```

**Production:**

```
::1 - - [04/Oct/2025:10:30:45 +0000] "GET /api/products HTTP/1.1" 200 1234
```

## 📖 Example Logs

### 1. Create Category

```
📤 [2025-10-04T10:30:45.123Z] POST /api/categories
   IP: ::1
   📝 Body: {
  "name": {
    "en": "Electronics",
    "ar": "إلكترونيات"
  },
  "slug": {
    "en": "electronics",
    "ar": "الكترونيات"
  }
}
✅ Response: 201 Created - 45ms
```

### 2. Get Products with Filter

```
📥 [2025-10-04T10:31:15.456Z] GET /api/products
   IP: ::1
   🔍 Query: { category: 'electronics', lang: 'en' }
✅ Response: 200 OK - 23ms
```

### 3. Update Product

```
✏️ [2025-10-04T10:32:30.789Z] PUT /api/products/507f1f77bcf86cd799439011
   IP: ::1
   📝 Body: {
  "price": 1199.99
}
✅ Response: 200 OK - 34ms
```

### 4. Delete Product

```
🗑️ [2025-10-04T10:33:45.012Z] DELETE /api/products/507f1f77bcf86cd799439011
   IP: ::1
✅ Response: 200 OK - 12ms
```

### 5. Error Example

```
📥 [2025-10-04T10:34:00.345Z] GET /api/products/507f1f77bcf86cd799439011
   IP: ::1
⚠️ Response: 404 Not Found - 8ms
```

### 6. Server Error Example

```
📤 [2025-10-04T10:35:15.678Z] POST /api/products
   IP: ::1
   📝 Body: {
  "name": "Invalid product"
}
❌ Response: 500 Internal Server Error - 156ms
```

## 🎛️ Customization Options

### Enable Header Logging

Uncomment this line in `server/app.js`:

```javascript
// console.log('   📋 Headers:', req.headers);
```

### Change Log Level

Modify the Morgan format:

```javascript
// Minimal logging
app.use(morgan("tiny"));

// Detailed logging
app.use(morgan("combined"));

// Custom format
app.use(
  morgan(":method :url :status :response-time ms - :res[content-length]")
);
```

### Add File Logging

To save logs to a file:

```javascript
const fs = require("fs");
const path = require("path");

// Create a write stream (in append mode)
const accessLogStream = fs.createWriteStream(
  path.join(__dirname, "access.log"),
  { flags: "a" }
);

// Setup the logger
app.use(morgan("combined", { stream: accessLogStream }));
```

## 🚀 Benefits

1. **Debugging**: Easy to trace request flow
2. **Performance Monitoring**: Track response times
3. **Security**: Monitor IP addresses and suspicious activity
4. **Analytics**: Understand API usage patterns
5. **Error Tracking**: Quickly identify failed requests

## 🛠️ Advanced Features

### Filter Sensitive Data

You can filter out sensitive data from logs:

```javascript
app.use((req, res, next) => {
  // Clone body and remove sensitive fields
  const logBody = { ...req.body };
  delete logBody.password;
  delete logBody.token;

  console.log("Body:", logBody);
  next();
});
```

### Log to External Service

Integrate with logging services like:

- **Winston** - Advanced logging library
- **Bunyan** - JSON logging library
- **Pino** - Very fast, low overhead logger
- **Loggly** - Cloud-based logging service
- **Datadog** - Monitoring and analytics

### Request ID Tracking

Add unique IDs to track requests:

```javascript
const { v4: uuidv4 } = require("uuid");

app.use((req, res, next) => {
  req.id = uuidv4();
  console.log(`Request ID: ${req.id}`);
  next();
});
```

## 📊 Log Analysis

### Common Patterns to Monitor

1. **High Response Times**: `> 1000ms`
2. **Frequent 404s**: Indicates broken links or wrong URLs
3. **401/403 Errors**: Authentication/authorization issues
4. **500 Errors**: Server problems that need immediate attention
5. **Unusual Traffic Patterns**: Potential security threats

## 🔒 Security Considerations

### What NOT to Log

- ❌ Passwords or authentication tokens
- ❌ Credit card numbers
- ❌ Personal identification numbers
- ❌ API keys or secrets
- ❌ Full request headers (may contain sensitive data)

### What to Monitor

- ✅ Failed login attempts
- ✅ Unusual request patterns
- ✅ High volume from single IP
- ✅ Requests to non-existent endpoints
- ✅ Slow queries or timeouts

## 📈 Sample Output

When you start your server, you'll see logs like this:

```
🚀 Server is running on port 5000
✅ Connected to MongoDB

📥 [2025-10-04T10:30:00.000Z] GET /api/health
   IP: ::1
✅ Response: 200 OK - 5ms

📥 [2025-10-04T10:30:15.123Z] GET /api/categories
   IP: ::1
✅ Response: 200 OK - 23ms

📤 [2025-10-04T10:30:30.456Z] POST /api/products
   IP: ::1
   📝 Body: {
  "name": {
    "en": "Laptop",
    "ar": "لابتوب"
  },
  "price": 999.99,
  "category": "507f1f77bcf86cd799439011"
}
✅ Response: 201 Created - 67ms
```

## 🎯 Quick Reference

| Feature              | Location        | Enabled By Default |
| -------------------- | --------------- | ------------------ |
| Morgan Logging       | `server/app.js` | ✅ Yes             |
| Custom Logger        | `server/app.js` | ✅ Yes             |
| Request Body Logging | `server/app.js` | ✅ Yes             |
| Query Param Logging  | `server/app.js` | ✅ Yes             |
| Header Logging       | `server/app.js` | ❌ No (commented)  |
| Response Time        | `server/app.js` | ✅ Yes             |
| File Logging         | -               | ❌ No (optional)   |

---

Your API now has comprehensive logging! All requests are automatically tracked and displayed in the console with detailed information. 🎉

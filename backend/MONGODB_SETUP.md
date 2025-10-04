# MongoDB Setup Instructions

## The server requires MongoDB to be running!

You're seeing this error because MongoDB is not running on your system:

```
❌ MongoDB connection error: connect ECONNREFUSED
```

## Quick Solutions

### Option 1: Start MongoDB Locally (Recommended for Development)

#### If MongoDB is Installed as a Service (Windows):

```bash
# Start MongoDB service
net start MongoDB
```

#### If MongoDB is Not Installed:

1. **Download MongoDB Community Server**

   - Visit: https://www.mongodb.com/try/download/community
   - Download the appropriate version for Windows
   - Install with default settings

2. **Start MongoDB**

   ```bash
   # If installed as service
   net start MongoDB

   # Or run manually
   "C:\Program Files\MongoDB\Server\7.0\bin\mongod.exe" --dbpath="C:\data\db"
   ```

### Option 2: Use MongoDB Atlas (Cloud Database)

1. **Create Free Account**

   - Visit: https://www.mongodb.com/cloud/atlas/register
   - Create a free cluster (M0)

2. **Get Connection String**

   - Click "Connect" on your cluster
   - Choose "Connect your application"
   - Copy the connection string

3. **Update .env File**
   ```env
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/ecommerce?retryWrites=true&w=majority
   PORT=5000
   NODE_ENV=development
   ```
   Replace `username`, `password`, and `cluster` with your actual credentials

### Option 3: Use Docker

```bash
# Run MongoDB in Docker container
docker run -d -p 27017:27017 --name mongodb mongo:latest

# Verify it's running
docker ps
```

## Verify MongoDB is Running

### Check if MongoDB is listening on port 27017:

```bash
# Windows
netstat -ano | findstr :27017

# Should show something like:
# TCP    0.0.0.0:27017         0.0.0.0:0              LISTENING       1234
```

### Test MongoDB connection:

```bash
# Using mongosh (MongoDB Shell)
mongosh mongodb://localhost:27017

# Or using mongo (older versions)
mongo mongodb://localhost:27017
```

## After Starting MongoDB

Once MongoDB is running, your server will automatically connect:

```bash
# The server will show:
✅ Connected to MongoDB
📦 Database: ecommerce
🚀 Server is running on port 5000
```

## Current Server Status

The server is running with nodemon and will automatically:

- ✅ Watch for file changes
- ✅ Restart when you save files
- ✅ Connect to MongoDB when it becomes available

Just start MongoDB and the server will connect automatically!

## Need Help?

### MongoDB Installation Guides:

- **Windows**: https://www.mongodb.com/docs/manual/tutorial/install-mongodb-on-windows/
- **macOS**: https://www.mongodb.com/docs/manual/tutorial/install-mongodb-on-os-x/
- **Linux**: https://www.mongodb.com/docs/manual/administration/install-on-linux/

### Alternative: MongoDB Compass (GUI)

- Download: https://www.mongodb.com/products/compass
- Easy way to manage MongoDB visually
- Can also start local MongoDB instance

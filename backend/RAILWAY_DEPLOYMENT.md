# 🚂 Railway Deployment Guide

## Complete Guide to Deploy Your E-commerce Backend to Railway

---

## 📋 Prerequisites

Before deploying, ensure you have:

- ✅ A GitHub account
- ✅ Your code pushed to a GitHub repository
- ✅ A Railway account (sign up at [railway.app](https://railway.app))
- ✅ MongoDB Atlas database (already configured in your `.env`)

---

## 🚀 Step-by-Step Deployment Guide

### Step 1: Prepare Your Repository

1. **Initialize Git (if not already done)**

   ```bash
   git init
   git add .
   git commit -m "Initial commit - Ready for Railway deployment"
   ```

2. **Create GitHub Repository**

   - Go to [github.com](https://github.com)
   - Click "New Repository"
   - Name it (e.g., `ecommerce-backend`)
   - Create repository (don't initialize with README)

3. **Push to GitHub**
   ```bash
   git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git
   git branch -M master
   git push -u origin master
   ```

### Step 2: Sign Up for Railway

1. Go to [railway.app](https://railway.app)
2. Click "Login" or "Start a New Project"
3. Sign up with GitHub (recommended)
4. Authorize Railway to access your GitHub repositories

### Step 3: Create New Project on Railway

1. Click "New Project"
2. Select "Deploy from GitHub repo"
3. Choose your repository (`ecommerce-backend`)
4. Railway will automatically detect it's a Node.js project

### Step 4: Configure Environment Variables

Railway needs your environment variables. Click on your project, then go to "Variables" tab:

#### Required Environment Variables:

```env
MONGODB_URI=mongodb+srv://sayed591999:sayed591999@cluster0.dwfjqjn.mongodb.net/egyptfishar?retryWrites=true&w=majority&appName=Cluster0

NODE_ENV=production

JWT_SECRET=your-super-secret-jwt-key-change-this-in-production-2024-min-32-chars

JWT_EXPIRE=7d
```

#### Optional Environment Variables:

```env
# Allow specific frontend domains (comma-separated)
ALLOWED_ORIGINS=https://yourfrontend.com,https://www.yourfrontend.com

# Railway automatically provides PORT, but you can set a default
PORT=5000
```

**How to add them:**

1. Click on your service
2. Go to "Variables" tab
3. Click "New Variable"
4. Add each variable (name and value)
5. Click "Add" for each one

### Step 5: Deploy

Railway will automatically:

- ✅ Detect Node.js
- ✅ Install dependencies with `pnpm` (specified in `package.json`)
- ✅ Run `npm start` command
- ✅ Assign a public URL

Wait for deployment to complete (usually 2-5 minutes).

### Step 6: Get Your API URL

1. Once deployed, Railway provides a public URL
2. Click "Generate Domain" if not automatically generated
3. Your API will be available at: `https://your-app-name.up.railway.app`

Example endpoints:

- Health check: `https://your-app-name.up.railway.app/api/health`
- Swagger docs: `https://your-app-name.up.railway.app/api-docs`
- Products: `https://your-app-name.up.railway.app/api/products`

---

## 🔒 Security Checklist

### Before Going to Production:

- [ ] **Change JWT_SECRET** to a strong, random 32+ character string

  ```bash
  # Generate a secure secret (run in terminal):
  node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
  ```

- [ ] **Set NODE_ENV** to `production` in Railway variables

- [ ] **Update ALLOWED_ORIGINS** with your frontend domain(s)

  ```env
  ALLOWED_ORIGINS=https://yourfrontend.com,https://www.yourfrontend.com
  ```

- [ ] **Verify MongoDB Security**

  - Use strong database password
  - Enable IP whitelist (allow Railway IPs or use 0.0.0.0/0 for any IP)
  - Enable authentication

- [ ] **Review CORS Settings** in `server/app.js`

---

## 📊 MongoDB Atlas Configuration

### Allow Railway to Connect:

1. Go to [MongoDB Atlas](https://cloud.mongodb.com)
2. Select your cluster
3. Click "Network Access"
4. Click "Add IP Address"
5. Choose **"Allow Access from Anywhere"** (0.0.0.0/0)
   - Railway uses dynamic IPs, so this is necessary
   - Your connection is still secure with username/password
6. Click "Confirm"

---

## 🧪 Testing Your Deployment

### 1. Test Health Endpoint

```bash
curl https://your-app-name.up.railway.app/api/health
```

Expected response:

```json
{
  "success": true,
  "message": "Server is running",
  "timestamp": "2024-..."
}
```

### 2. Test Swagger Documentation

Visit: `https://your-app-name.up.railway.app/api-docs`

### 3. Test Authentication

```bash
curl -X POST https://your-app-name.up.railway.app/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@example.com","password":"admin123"}'
```

### 4. Update Postman Collection

Replace `{{baseUrl}}` with your Railway URL:

```
https://your-app-name.up.railway.app
```

---

## 🔧 Troubleshooting

### Deployment Failed?

1. **Check Build Logs**

   - Click on your service in Railway
   - Go to "Deployments" tab
   - Click on failed deployment
   - Review logs for errors

2. **Common Issues:**

   **Missing Dependencies:**

   ```bash
   # Railway should use pnpm automatically
   # If not, check package.json has packageManager field
   ```

   **Port Issues:**

   - Railway automatically provides PORT
   - Your app uses `process.env.PORT` (already configured)

   **MongoDB Connection:**

   - Verify MONGODB_URI is correct
   - Check MongoDB Atlas allows all IPs (0.0.0.0/0)
   - Ensure password doesn't have special characters (or encode them)

### App Crashed?

Check Runtime Logs:

1. Go to "Deployments" in Railway
2. Click on latest deployment
3. View runtime logs
4. Look for error messages

### Database Connection Issues?

```javascript
// Test MongoDB connection separately
const mongoose = require("mongoose");
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("❌ MongoDB error:", err));
```

---

## 📦 File Uploads on Railway

### Important: Railway has ephemeral filesystem

⚠️ **Files uploaded to `/uploads` will be lost on redeployment!**

**Solutions:**

### Option 1: Use Cloud Storage (Recommended)

- **AWS S3** - Most popular
- **Cloudinary** - Good for images
- **Railway Volumes** - Persistent storage

### Option 2: Railway Volumes (Persistent Storage)

1. Go to your service in Railway
2. Click "Volumes" tab
3. Click "New Volume"
4. Mount path: `/app/server/uploads`
5. Size: Start with 1GB

### Option 3: Cloudinary Integration

```bash
npm install cloudinary multer-storage-cloudinary
```

---

## 🎯 Post-Deployment Steps

### 1. Create Admin User

You can't run scripts directly on Railway, but you can:

**Option A: Use Swagger UI**

1. Go to `https://your-app-name.up.railway.app/api-docs`
2. Navigate to "Authentication"
3. Use "Create Admin User" endpoint
4. Or register normally and manually update MongoDB

**Option B: MongoDB Atlas**

1. Go to MongoDB Atlas
2. Browse Collections
3. Find `users` collection
4. Manually update a user's role to "admin"

**Option C: Temporary Route (Development Only)**
Add this route temporarily to `server/routes/auth.js`:

```javascript
// REMOVE THIS AFTER CREATING ADMIN!
router.post("/create-first-admin", async (req, res) => {
  const admin = await User.create({
    name: "Super Admin",
    email: "admin@example.com",
    password: "admin123",
    role: "admin",
  });
  res.json({ success: true, admin });
});
```

### 2. Update Frontend Configuration

Update your frontend to use Railway URL:

```javascript
const API_URL = "https://your-app-name.up.railway.app/api";
```

### 3. Test All Endpoints

Use your Postman collection with the new Railway URL

---

## 📈 Monitoring & Logs

### View Logs in Real-Time:

1. Go to Railway dashboard
2. Click on your service
3. Click "Deployments"
4. Click on active deployment
5. View logs stream

### Key Metrics to Monitor:

- Response times
- Error rates
- Memory usage
- Database connections

---

## 🔄 Continuous Deployment

Railway automatically redeploys when you push to GitHub:

```bash
# Make changes to your code
git add .
git commit -m "Update feature"
git push origin master

# Railway automatically detects and redeploys
```

---

## 💰 Railway Pricing

- **Free Tier**: $5 of usage credit per month
- **Pro Plan**: $20/month for more resources
- **Pay-as-you-go**: After free credits

Your backend should fit comfortably in the free tier for development/testing.

---

## 📚 Additional Resources

- [Railway Docs](https://docs.railway.app)
- [Railway Discord](https://discord.gg/railway)
- [MongoDB Atlas Docs](https://docs.atlas.mongodb.com)

---

## ✅ Deployment Checklist

- [ ] Code pushed to GitHub
- [ ] Railway project created
- [ ] Environment variables configured
- [ ] MongoDB Atlas allows Railway IPs (0.0.0.0/0)
- [ ] Deployment successful
- [ ] Health endpoint working
- [ ] Swagger docs accessible
- [ ] Admin user created
- [ ] All endpoints tested
- [ ] Frontend updated with Railway URL
- [ ] CORS configured for frontend domain
- [ ] JWT_SECRET changed to production value

---

## 🎉 You're Live!

Your e-commerce backend is now deployed on Railway!

**Your API is available at:**

```
https://your-app-name.up.railway.app
```

**Next Steps:**

1. Share your Swagger docs: `https://your-app-name.up.railway.app/api-docs`
2. Create admin account
3. Test all endpoints
4. Deploy your frontend
5. Update CORS with frontend domain

**Need Help?**

- Check Railway logs
- Review this guide
- Check Railway documentation
- MongoDB Atlas support

---

## 🔐 Important Security Notes

1. **Never commit .env files** - Already in .gitignore
2. **Use strong passwords** - For both MongoDB and JWT
3. **Enable HTTPS only** - Railway provides this automatically
4. **Limit CORS origins** - Only allow your frontend domain in production
5. **Monitor logs** - Watch for suspicious activity
6. **Keep dependencies updated** - Run `npm audit` regularly

---

**Congratulations! Your backend is production-ready!** 🚀

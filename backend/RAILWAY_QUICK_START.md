# Quick Railway Deployment - TL;DR

## 1️⃣ Push to GitHub

```bash
git init
git add .
git commit -m "Ready for deployment"
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git
git push -u origin master
```

## 2️⃣ Deploy on Railway

1. Go to [railway.app](https://railway.app)
2. Login with GitHub
3. New Project → Deploy from GitHub repo
4. Select your repository

## 3️⃣ Add Environment Variables

Click "Variables" tab and add:

```env
MONGODB_URI=mongodb+srv://sayed591999:sayed591999@cluster0.dwfjqjn.mongodb.net/egyptfishar?retryWrites=true&w=majority&appName=Cluster0

NODE_ENV=production

JWT_SECRET=your-super-secret-jwt-key-change-this-in-production-2024

JWT_EXPIRE=7d
```

## 4️⃣ Generate Domain

- Click "Generate Domain"
- Your API: `https://your-app.up.railway.app`

## 5️⃣ Allow Railway in MongoDB

1. Go to [MongoDB Atlas](https://cloud.mongodb.com)
2. Network Access → Add IP → Allow 0.0.0.0/0

## 6️⃣ Test

```bash
curl https://your-app.up.railway.app/api/health
```

## ✅ Done!

- API: `https://your-app.up.railway.app`
- Swagger: `https://your-app.up.railway.app/api-docs`

**Auto-deploys on every git push!** 🚀

---

## 📋 Files Created for Deployment

✅ `railway.json` - Railway configuration
✅ `nixpacks.toml` - Build configuration
✅ `.env.example` - Environment variables template
✅ `.gitignore` - Git ignore rules
✅ `package.json` - Updated with engines
✅ `server/uploads/.gitkeep` - Keep uploads folder

## 🔒 Security Reminder

**Before production:**

- Change JWT_SECRET to a strong random string
- Add your frontend domain to ALLOWED_ORIGINS
- Use strong MongoDB password

## 🎯 Next Steps

1. Create admin user (via Swagger or MongoDB Atlas)
2. Update Postman with Railway URL
3. Deploy frontend
4. Add frontend domain to ALLOWED_ORIGINS

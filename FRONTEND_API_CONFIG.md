# 🔧 Frontend API URL Configuration Guide

## Issue: Frontend using localhost:5000 instead of production IP

This document explains how to fix the API URL configuration.

---

## ✅ Files Updated

1. **`frontend/src/environments/environment.prod.ts`** - Production API URL
2. **`frontend/angular.json`** - Added fileReplacements for production build
3. **`update-api-url.sh`** - Helper script to update API URL

---

## 📤 Deploy Steps

### 1. On Your Local Computer:

```bash
# Add and commit changes
git add .
git commit -m "Fix production API URL configuration"
git push origin master
```

### 2. On Hostinger VPS:

```bash
# Navigate to project
cd ~/full-stack-ecomerce

# Pull latest changes
git pull origin master

# Stop and remove frontend container
docker compose stop ecommerce-frontend
docker compose rm -f ecommerce-frontend

# Rebuild frontend (this will take 3-5 minutes)
docker compose up -d --build ecommerce-frontend

# Watch logs to see build progress
docker compose logs -f ecommerce-frontend
```

Press `Ctrl+C` when build is complete.

### 3. Verify:

```bash
# Check if running
docker compose ps

# Test the frontend
curl http://localhost:4000/en | grep -o "http://[^\"]*:5000" | head -1
```

This should show: `http://72.61.18.171:5000`

### 4. Test in Browser:

1. Open: http://72.61.18.171/en
2. Press F12 (open DevTools)
3. Go to Network tab
4. Refresh page
5. Check API calls - should go to `http://72.61.18.171:5000/api/*`

---

## 🔍 What Changed?

### Before:

```typescript
// environment.prod.ts
export const environment = {
  production: true,
  apiUrl: process.env["API_URL"] || "http://ecommerce-backend:5000",
};
```

**Problem:** `process.env` doesn't work in Angular browser code, and `ecommerce-backend` is only accessible from inside Docker network.

### After:

```typescript
// environment.prod.ts
export const environment = {
  production: true,
  apiUrl: "http://72.61.18.171:5000",
};
```

**Solution:** Hardcoded production IP that's accessible from user's browser.

### Also Added in angular.json:

```json
"fileReplacements": [
  {
    "replace": "src/environments/environment.ts",
    "with": "src/environments/environment.prod.ts"
  }
]
```

This ensures production build uses the correct environment file.

---

## 🎯 Clear Browser Cache

After deployment, users should clear cache:

**Chrome/Edge:**

1. Press `Ctrl+Shift+Delete`
2. Select "Cached images and files"
3. Click "Clear data"

**Or use hard refresh:**

- `Ctrl+F5` (Windows)
- `Cmd+Shift+R` (Mac)

---

## 🔄 To Change API URL in Future:

### Option 1: Use the script

```bash
./update-api-url.sh YOUR_NEW_IP
git add . && git commit -m "Update API URL" && git push
# Then rebuild on server
```

### Option 2: Manual update

Edit `frontend/src/environments/environment.prod.ts`:

```typescript
apiUrl: 'http://YOUR_NEW_IP:5000',
```

---

## ✅ Verification Checklist

- [ ] `environment.prod.ts` has correct IP: `72.61.18.171:5000`
- [ ] `angular.json` has `fileReplacements` configuration
- [ ] Changes committed and pushed to GitHub
- [ ] Pulled changes on server
- [ ] Frontend container rebuilt
- [ ] Browser shows API calls to `72.61.18.171:5000`
- [ ] No CORS errors in console
- [ ] Data loads correctly

---

## 🐛 Troubleshooting

### Still seeing localhost:5000?

1. **Verify production build:**

   ```bash
   docker compose exec ecommerce-frontend cat /app/dist/frontend/browser/main-*.js | grep -o "http://[^\"]*:5000" | head -1
   ```

2. **Check if fileReplacements worked:**

   ```bash
   # On local machine
   ng build --configuration production
   grep -r "72.61.18.171" dist/
   ```

3. **Clear all Docker cache:**

   ```bash
   docker compose down
   docker system prune -a
   docker compose up -d --build
   ```

4. **Hard refresh browser:**
   - Press `Ctrl+Shift+Delete`
   - Clear cache
   - Or use Incognito/Private mode

---

## 📝 Notes

- The backend IP `72.61.18.171:5000` must be accessible from user's browser
- CORS must allow this origin in backend `.env`
- For domain deployment, update to: `apiUrl: 'https://yourdomain.com/api'`

---

Generated: 2025-10-10

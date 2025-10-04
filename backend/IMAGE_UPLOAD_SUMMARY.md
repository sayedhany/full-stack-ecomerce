# Image Upload Feature - Summary

## ✅ What Was Added

### 📦 Installed Package

- **multer** (v2.0.2) - Middleware for handling `multipart/form-data` file uploads

### 📁 New Files Created

1. **`server/middleware/upload.js`** - Multer configuration for image uploads
2. **`uploads/` directory** - Storage location for uploaded images
3. **`IMAGE_UPLOAD_GUIDE.md`** - Complete documentation

### 🔧 Modified Files

1. **`server/routes/products.js`** - Added 3 new upload endpoints
2. **`server/app.js`** - Added static file serving for uploads
3. **`.gitignore`** - Excluded uploaded files from git
4. **`Postman_Collection.json`** - Added image upload requests

---

## 🚀 New API Endpoints

### 1. Upload Single Image

```
POST /api/products/upload
Content-Type: multipart/form-data
Body: image (file)
```

### 2. Upload Multiple Images

```
POST /api/products/upload/multiple
Content-Type: multipart/form-data
Body: images (multiple files, max 5)
```

### 3. Create Product with Image

```
POST /api/products/with-image
Content-Type: multipart/form-data
Body:
  - name_en, name_ar
  - description_en, description_ar
  - price, slug_en, slug_ar
  - category, isActive
  - image (file)
```

---

## 📋 Features

✅ **File Type Validation** - Only images (.jpg, .jpeg, .png, .gif, .webp)
✅ **File Size Limit** - Max 5MB per image
✅ **Unique Filenames** - Timestamp + random number prevents conflicts
✅ **Multiple Uploads** - Up to 5 images at once
✅ **Static File Serving** - Images accessible at `/uploads/filename.jpg`
✅ **Swagger Documentation** - All endpoints documented
✅ **Postman Collection** - Ready-to-use requests

---

## 📝 How to Test

### Option 1: Using Postman

1. Import `Postman_Collection.json`
2. Go to **Image Upload** folder
3. Select **Upload Single Product Image**
4. In Body tab, select file for `image` field
5. Send request
6. Copy the returned `fullUrl`
7. Use this URL when creating products

### Option 2: Using cURL

```bash
# Upload single image
curl -X POST http://localhost:5000/api/products/upload \
  -F "image=@/path/to/your/image.jpg"

# Create product with image
curl -X POST http://localhost:5000/api/products/with-image \
  -F "name_en=Laptop Pro" \
  -F "name_ar=لابتوب برو" \
  -F "description_en=High performance" \
  -F "description_ar=أداء عالي" \
  -F "price=999.99" \
  -F "slug_en=laptop-pro" \
  -F "slug_ar=لابتوب-برو" \
  -F "category=YOUR_CATEGORY_ID" \
  -F "image=@/path/to/image.jpg"
```

### Option 3: Using Swagger UI

1. Start server: `npm run dev`
2. Open: `http://localhost:5000/api-docs`
3. Navigate to **Products** section
4. Try **POST /api/products/upload**
5. Click "Try it out"
6. Upload your image
7. Execute

---

## 🔒 Security & Limits

- ✅ Only image files allowed (jpeg, jpg, png, gif, webp)
- ✅ Maximum file size: 5MB
- ✅ Maximum multiple upload: 5 files
- ✅ Unique filenames prevent overwriting
- ✅ Files stored in dedicated `uploads/` directory
- ✅ Uploaded files excluded from git

---

## 📚 Documentation

Complete guides available:

- **IMAGE_UPLOAD_GUIDE.md** - Full documentation with examples
- **POSTMAN_GUIDE.md** - Postman testing instructions
- **SWAGGER_GUIDE.md** - Swagger API documentation
- **API_TESTING.md** - General API testing

---

## 🎯 Quick Example

```javascript
// Frontend example (React/Vanilla JS)
const formData = new FormData();
formData.append("image", fileInput.files[0]);

fetch("http://localhost:5000/api/products/upload", {
  method: "POST",
  body: formData,
})
  .then((res) => res.json())
  .then((data) => {
    console.log("Image URL:", data.fullUrl);
    // Use this URL in product creation
  });
```

---

## ✨ Ready to Use!

The image upload feature is fully integrated and ready for production! 🚀

Start the server and test it:

```bash
npm run dev
```

Then access:

- API: `http://localhost:5000/api/products/upload`
- Swagger Docs: `http://localhost:5000/api-docs`
- Uploaded Images: `http://localhost:5000/uploads/filename.jpg`

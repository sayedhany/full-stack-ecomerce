# Image Upload Testing Guide

## ✅ Issue Fixed!

The images **ARE being uploaded** successfully to `server/uploads/` directory!

The issue was that the static file serving was pointing to the wrong directory. This has now been fixed.

## 📂 Current Setup

- **Upload Directory**: `server/uploads/`
- **Static File URL**: `http://localhost:5000/uploads/{filename}`
- **File Already Uploaded**: `main-banner-1-1759587234333-136529043.png`

## 🧪 Test the Upload

### Method 1: Using Postman

1. **Open Postman**
2. **Create a new request**:
   - Method: `POST`
   - URL: `http://localhost:5000/api/products/upload`

3. **Set up the form-data**:
   - Go to **Body** tab
   - Select **form-data**
   - Add a key: `image`
   - Change type to **File** (click dropdown next to key name)
   - Click **Select Files** and choose an image (jpg, png, gif, webp)

4. **Send the request**

5. **Expected Response**:
```json
{
  "success": true,
  "message": "Image uploaded successfully",
  "imageUrl": "/uploads/filename-123456789.jpg",
  "fullUrl": "http://localhost:5000/uploads/filename-123456789.jpg",
  "file": {
    "filename": "filename-123456789.jpg",
    "originalname": "myimage.jpg",
    "mimetype": "image/jpeg",
    "size": 12345
  }
}
```

6. **Test the Image**:
   - Copy the `fullUrl` from the response
   - Paste it in your browser
   - You should see your uploaded image!

### Method 2: Using cURL

```bash
curl -X POST http://localhost:5000/api/products/upload \
  -F "image=@/path/to/your/image.jpg"
```

### Method 3: Test Already Uploaded Image

The file `main-banner-1-1759587234333-136529043.png` is already in the uploads folder!

Visit in your browser:
```
http://localhost:5000/uploads/main-banner-1-1759587234333-136529043.png
```

## 📁 Where Are Images Stored?

```
backend/
└── server/
    └── uploads/
        └── main-banner-1-1759587234333-136529043.png ✅ Already here!
        └── your-new-image-123456789.jpg ← New uploads will go here
```

## 🔍 Verify Upload Directory

Run this command to see all uploaded files:

### Windows (PowerShell):
```powershell
Get-ChildItem -Path "d:\small-ecommerce\backend\server\uploads"
```

### Windows (CMD):
```cmd
dir d:\small-ecommerce\backend\server\uploads
```

### Git Bash:
```bash
ls -la d:/small-ecommerce/backend/server/uploads/
```

## 🎯 Full Workflow Example

### Step 1: Upload an Image
**POST** `http://localhost:5000/api/products/upload`
- Body: form-data
- Key: `image` (type: File)
- Value: Select your image file

**Response:**
```json
{
  "success": true,
  "imageUrl": "/uploads/product-1234567890.jpg",
  "fullUrl": "http://localhost:5000/uploads/product-1234567890.jpg"
}
```

### Step 2: Create Product with the Uploaded Image
**POST** `http://localhost:5000/api/products`
```json
{
  "name": {
    "en": "New Product",
    "ar": "منتج جديد"
  },
  "description": {
    "en": "Product description",
    "ar": "وصف المنتج"
  },
  "price": 99.99,
  "image": "/uploads/product-1234567890.jpg",  // ← Use the imageUrl from Step 1
  "slug": {
    "en": "new-product",
    "ar": "منتج-جديد"
  },
  "category": "YOUR_CATEGORY_ID"
}
```

### Step 3: View the Product Image
When you get the product, the image URL will be:
```json
{
  "image": "/uploads/product-1234567890.jpg"
}
```

Access it at: `http://localhost:5000/uploads/product-1234567890.jpg`

## 🚀 Upload Multiple Images

**POST** `http://localhost:5000/api/products/upload/multiple`
- Body: form-data
- Key: `images` (type: File, select multiple files - up to 5)

**Response:**
```json
{
  "success": true,
  "message": "5 images uploaded successfully",
  "images": [
    {
      "imageUrl": "/uploads/image1-123.jpg",
      "fullUrl": "http://localhost:5000/uploads/image1-123.jpg"
    },
    {
      "imageUrl": "/uploads/image2-456.jpg",
      "fullUrl": "http://localhost:5000/uploads/image2-456.jpg"
    }
    // ... up to 5 images
  ]
}
```

## 📋 Upload Restrictions

- **Allowed formats**: JPEG, JPG, PNG, GIF, WEBP
- **Max file size**: 5MB per image
- **Multiple upload**: Maximum 5 images at once

## ❌ Common Errors

### "No image file uploaded"
- Make sure the form field name is `image` (not `file` or anything else)
- Make sure you selected **File** type in Postman form-data

### "Only image files are allowed"
- You tried to upload a non-image file
- Only jpg, jpeg, png, gif, webp are allowed

### "File too large"
- Maximum size is 5MB
- Compress your image or choose a smaller file

### Cannot access uploaded image in browser
- Make sure the server is running
- Check that the path is correct: `http://localhost:5000/uploads/filename.jpg`
- Previously this was an issue - now fixed! ✅

## 🎨 Frontend Integration Example

```javascript
// Upload image
const formData = new FormData();
formData.append('image', fileInput.files[0]);

const uploadResponse = await fetch('http://localhost:5000/api/products/upload', {
  method: 'POST',
  body: formData
});

const { imageUrl } = await uploadResponse.json();

// Create product with uploaded image
const productData = {
  name: { en: 'Product Name', ar: 'اسم المنتج' },
  // ... other fields
  image: imageUrl  // Use the uploaded image URL
};

await fetch('http://localhost:5000/api/products', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(productData)
});
```

## ✅ Confirmation

**Your image upload is working!** The file `main-banner-1-1759587234333-136529043.png` proves uploads are being saved successfully to `server/uploads/`.

Just make sure your server is running and test the URL:
```
http://localhost:5000/uploads/main-banner-1-1759587234333-136529043.png
```

Happy uploading! 🚀

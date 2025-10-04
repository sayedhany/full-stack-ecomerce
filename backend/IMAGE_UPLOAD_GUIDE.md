# Image Upload Guide

## 📸 Image Upload Functionality

Your e-commerce backend now supports image uploads for products with three different methods!

## 🚀 Available Upload Endpoints

### 1. **Upload Single Image** (Standalone)

Upload a product image and get the URL to use later when creating/updating a product.

**Endpoint:** `POST /api/products/upload`

**Request Type:** `multipart/form-data`

**Form Field:** `image` (file)

**Example using cURL:**

```bash
curl -X POST http://localhost:5000/api/products/upload \
  -F "image=@/path/to/image.jpg"
```

**Example using Postman:**

1. Select POST method
2. URL: `http://localhost:5000/api/products/upload`
3. Go to Body tab
4. Select "form-data"
5. Key: `image` (change type to "File")
6. Value: Select your image file

**Response:**

```json
{
  "success": true,
  "message": "Image uploaded successfully",
  "imageUrl": "/uploads/laptop-1234567890-123456789.jpg",
  "fullUrl": "http://localhost:5000/uploads/laptop-1234567890-123456789.jpg",
  "file": {
    "filename": "laptop-1234567890-123456789.jpg",
    "originalname": "laptop.jpg",
    "mimetype": "image/jpeg",
    "size": 245678
  }
}
```

---

### 2. **Upload Multiple Images**

Upload up to 5 images at once.

**Endpoint:** `POST /api/products/upload/multiple`

**Request Type:** `multipart/form-data`

**Form Field:** `images` (multiple files)

**Example using cURL:**

```bash
curl -X POST http://localhost:5000/api/products/upload/multiple \
  -F "images=@/path/to/image1.jpg" \
  -F "images=@/path/to/image2.jpg" \
  -F "images=@/path/to/image3.jpg"
```

**Example using Postman:**

1. Select POST method
2. URL: `http://localhost:5000/api/products/upload/multiple`
3. Go to Body tab
4. Select "form-data"
5. Key: `images` (change type to "File")
6. Click "Select Files" and choose multiple images

**Response:**

```json
{
  "success": true,
  "message": "3 image(s) uploaded successfully",
  "count": 3,
  "images": [
    {
      "imageUrl": "/uploads/image1-1234567890.jpg",
      "fullUrl": "http://localhost:5000/uploads/image1-1234567890.jpg",
      "filename": "image1-1234567890.jpg",
      "originalname": "image1.jpg",
      "mimetype": "image/jpeg",
      "size": 123456
    }
    // ... more images
  ]
}
```

---

### 3. **Create Product with Image Upload**

Create a product and upload its image in a single request.

**Endpoint:** `POST /api/products/with-image`

**Request Type:** `multipart/form-data`

**Form Fields:**

- `name_en` - Product name in English
- `name_ar` - Product name in Arabic
- `description_en` - Description in English
- `description_ar` - Description in Arabic
- `price` - Product price
- `slug_en` - Slug in English
- `slug_ar` - Slug in Arabic
- `category` - Category ID
- `isActive` - Active status (true/false)
- `image` - Image file

**Example using Postman:**

1. Select POST method
2. URL: `http://localhost:5000/api/products/with-image`
3. Go to Body tab
4. Select "form-data"
5. Add fields:
   - `name_en`: Laptop Pro 15
   - `name_ar`: لابتوب برو ١٥
   - `description_en`: High-performance laptop
   - `description_ar`: كمبيوتر محمول عالي الأداء
   - `price`: 1299.99
   - `slug_en`: laptop-pro-15
   - `slug_ar`: لابتوب-برو-15
   - `category`: 507f1f77bcf86cd799439011
   - `isActive`: true
   - `image`: (File) - Select your image

**Response:**

```json
{
  "success": true,
  "message": "Product created with image successfully",
  "data": {
    "_id": "507f1f77bcf86cd799439012",
    "name": {
      "en": "Laptop Pro 15",
      "ar": "لابتوب برو ١٥"
    },
    "description": {
      "en": "High-performance laptop",
      "ar": "كمبيوتر محمول عالي الأداء"
    },
    "price": 1299.99,
    "image": "http://localhost:5000/uploads/laptop-1234567890.jpg",
    "slug": {
      "en": "laptop-pro-15",
      "ar": "لابتوب-برو-15"
    },
    "category": { ... },
    "isActive": true,
    "createdAt": "2025-10-04T10:30:00.000Z",
    "updatedAt": "2025-10-04T10:30:00.000Z"
  }
}
```

---

## 📋 Upload Specifications

### **Supported Image Formats:**

- JPEG (.jpg, .jpeg)
- PNG (.png)
- GIF (.gif)
- WebP (.webp)

### **File Size Limit:**

- Maximum: **5MB** per image

### **Multiple Upload Limit:**

- Maximum: **5 images** at once

### **Storage Location:**

- Files are stored in: `uploads/` directory
- Files are named with timestamp to avoid conflicts
- Format: `originalname-timestamp-randomnumber.ext`

---

## 🔧 Complete Workflow Examples

### **Workflow 1: Upload Then Create**

**Step 1:** Upload image

```bash
POST /api/products/upload
Body: image file
```

**Step 2:** Use returned URL to create product

```bash
POST /api/products
Body: {
  "name": { "en": "Laptop", "ar": "لابتوب" },
  "description": { ... },
  "price": 999.99,
  "image": "http://localhost:5000/uploads/laptop-123456.jpg", // URL from step 1
  "slug": { "en": "laptop", "ar": "لابتوب" },
  "category": "categoryId"
}
```

---

### **Workflow 2: Create with Image (Single Request)**

```bash
POST /api/products/with-image
Body: (form-data)
  - name_en: Laptop Pro 15
  - name_ar: لابتوب برو ١٥
  - description_en: High-performance laptop
  - description_ar: كمبيوتر محمول
  - price: 1299.99
  - slug_en: laptop-pro-15
  - slug_ar: لابتوب-برو-15
  - category: 507f1f77bcf86cd799439011
  - image: [file]
```

---

### **Workflow 3: Update Product with New Image**

**Step 1:** Upload new image

```bash
POST /api/products/upload
Body: new image file
```

**Step 2:** Update product with new image URL

```bash
PUT /api/products/:id
Body: {
  "image": "http://localhost:5000/uploads/new-image-123456.jpg"
}
```

---

## 🌐 Using JavaScript/Fetch

### **Upload Single Image**

```javascript
const formData = new FormData();
formData.append("image", fileInput.files[0]);

fetch("http://localhost:5000/api/products/upload", {
  method: "POST",
  body: formData,
})
  .then((res) => res.json())
  .then((data) => {
    console.log("Image URL:", data.fullUrl);
    // Use this URL when creating/updating product
  });
```

### **Upload Multiple Images**

```javascript
const formData = new FormData();
const files = fileInput.files; // HTMLInputElement with multiple files

for (let i = 0; i < files.length; i++) {
  formData.append("images", files[i]);
}

fetch("http://localhost:5000/api/products/upload/multiple", {
  method: "POST",
  body: formData,
})
  .then((res) => res.json())
  .then((data) => {
    console.log("Uploaded images:", data.images);
  });
```

### **Create Product with Image**

```javascript
const formData = new FormData();
formData.append("name_en", "Laptop Pro 15");
formData.append("name_ar", "لابتوب برو ١٥");
formData.append("description_en", "High-performance laptop");
formData.append("description_ar", "كمبيوتر محمول عالي الأداء");
formData.append("price", 1299.99);
formData.append("slug_en", "laptop-pro-15");
formData.append("slug_ar", "لابتوب-برو-15");
formData.append("category", categoryId);
formData.append("image", fileInput.files[0]);

fetch("http://localhost:5000/api/products/with-image", {
  method: "POST",
  body: formData,
})
  .then((res) => res.json())
  .then((data) => {
    console.log("Product created:", data.data);
  });
```

---

## ⚛️ React Example

### **Image Upload Component**

```jsx
import React, { useState } from "react";

function ProductImageUpload() {
  const [image, setImage] = useState(null);
  const [imageUrl, setImageUrl] = useState("");
  const [uploading, setUploading] = useState(false);

  const handleFileChange = (e) => {
    setImage(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!image) {
      alert("Please select an image");
      return;
    }

    const formData = new FormData();
    formData.append("image", image);

    setUploading(true);

    try {
      const response = await fetch(
        "http://localhost:5000/api/products/upload",
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await response.json();

      if (data.success) {
        setImageUrl(data.fullUrl);
        alert("Image uploaded successfully!");
      } else {
        alert("Upload failed: " + data.message);
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Upload error");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div>
      <input type="file" onChange={handleFileChange} accept="image/*" />
      <button onClick={handleUpload} disabled={uploading}>
        {uploading ? "Uploading..." : "Upload Image"}
      </button>
      {imageUrl && (
        <div>
          <p>Image URL: {imageUrl}</p>
          <img src={imageUrl} alt="Uploaded" style={{ maxWidth: "300px" }} />
        </div>
      )}
    </div>
  );
}

export default ProductImageUpload;
```

---

## 🔒 Security Features

1. **File Type Validation**: Only image files allowed
2. **File Size Limit**: Maximum 5MB per file
3. **Unique Filenames**: Prevents overwriting with timestamp + random number
4. **Multiple Upload Limit**: Maximum 5 files at once

---

## 📁 File Storage

- **Directory**: `backend/uploads/`
- **URL Path**: `/uploads/filename.jpg`
- **Full URL**: `http://localhost:5000/uploads/filename.jpg`
- **Git Ignored**: Uploaded files are not committed to git

---

## 🐛 Troubleshooting

### **Error: "No image file uploaded"**

- Ensure form field name is `image` (or `images` for multiple)
- Check that Content-Type is `multipart/form-data`

### **Error: "Only image files are allowed"**

- Upload only: .jpg, .jpeg, .png, .gif, .webp files
- Check file extension and MIME type

### **Error: "File too large"**

- Maximum file size is 5MB
- Compress your image before uploading

### **Error: "ENOENT: no such file or directory"**

- The uploads directory will be created automatically
- Check write permissions on the uploads folder

### **404 when accessing image URL**

- Ensure server is running
- Check that file exists in uploads directory
- Verify URL format: `http://localhost:5000/uploads/filename.jpg`

---

## 📊 Testing with Postman

A complete Postman collection with image upload examples is available in:

- `Postman_Collection.json` (import this into Postman)
- See `POSTMAN_GUIDE.md` for detailed instructions

---

## ✅ Summary

You now have **3 ways** to handle product images:

1. ✅ **Upload image separately** → Get URL → Use in product creation
2. ✅ **Upload multiple images** → Get URLs → Use for product gallery
3. ✅ **Create product + upload image** → All in one request

Choose the method that best fits your frontend workflow! 🎨

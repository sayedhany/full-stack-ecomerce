# Image Upload & Compression Guide

## 🖼️ Automatic Image Processing

All uploaded images are automatically:

- ✅ **Compressed** to reduce file size
- ✅ **Converted to WebP** format for optimal web performance
- ✅ **Resized** to max 1200x1200px (maintains aspect ratio)
- ✅ **Optimized** with 80% quality setting

## 📊 Benefits

### Before (Original Image)

- Format: JPEG/PNG
- Size: 2-5 MB
- Dimensions: Variable (could be very large)

### After (Processed Image)

- Format: **WebP**
- Size: **200-500 KB** (60-80% smaller!)
- Dimensions: Max 1200x1200px
- Quality: 80% (visually identical)

## 🚀 How It Works

### Image Processing Pipeline

```
Upload Image → Multer (Memory) → Sharp Processing → Save as WebP → Response
```

### Sharp Configuration

```javascript
sharp(imageBuffer)
  .resize(1200, 1200, {
    fit: "inside", // Maintain aspect ratio
    withoutEnlargement: true, // Don't upscale small images
  })
  .webp({ quality: 80 }) // Convert to WebP with 80% quality
  .toFile(filepath);
```

## 📝 Usage Examples

### Single Image Upload

**Endpoint:** `POST /api/products/upload`

**Request:**

```bash
curl -X POST http://localhost:5000/api/products/upload \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -F "image=@photo.jpg"
```

**Response:**

```json
{
  "success": true,
  "message": "Image uploaded successfully",
  "imageUrl": "/uploads/product-1234567890.webp",
  "fullUrl": "http://localhost:5000/uploads/product-1234567890.webp",
  "file": {
    "filename": "product-1234567890.webp",
    "originalname": "photo.jpg",
    "mimetype": "image/webp",
    "size": 245678
  }
}
```

### Multiple Images Upload

**Endpoint:** `POST /api/products/upload/multiple`

**Request:**

```bash
curl -X POST http://localhost:5000/api/products/upload/multiple \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -F "images=@photo1.jpg" \
  -F "images=@photo2.png" \
  -F "images=@photo3.jpeg"
```

**Response:**

```json
{
  "success": true,
  "message": "3 images uploaded successfully",
  "images": [
    {
      "imageUrl": "/uploads/product-1234567890.webp",
      "fullUrl": "http://localhost:5000/uploads/product-1234567890.webp",
      "filename": "product-1234567890.webp"
    },
    {
      "imageUrl": "/uploads/product-1234567891.webp",
      "fullUrl": "http://localhost:5000/uploads/product-1234567891.webp",
      "filename": "product-1234567891.webp"
    },
    {
      "imageUrl": "/uploads/product-1234567892.webp",
      "fullUrl": "http://localhost:5000/uploads/product-1234567892.webp",
      "filename": "product-1234567892.webp"
    }
  ]
}
```

### Create Product with Image

**Endpoint:** `POST /api/products/with-image`

**Request (Multipart Form Data):**

```
name_en: Laptop Pro 15
name_ar: لابتوب برو ١٥
description_en: High-performance laptop
description_ar: كمبيوتر محمول عالي الأداء
price: 1299.99
slug_en: laptop-pro-15
slug_ar: لابتوب-برو-15
category: 507f1f77bcf86cd799439011
image: [FILE: laptop.jpg]
```

The image will be automatically:

1. Compressed
2. Converted to WebP
3. Saved as `product-1234567890.webp`
4. URL stored in database

## 🎨 Accepted Input Formats

- JPEG (.jpg, .jpeg)
- PNG (.png)
- GIF (.gif)
- WebP (.webp)

**All formats are converted to WebP!**

## 📏 Size Limits

- **Before compression:** 10 MB max
- **After compression:** Usually 200-500 KB
- **Max dimensions:** 1200x1200px (auto-resize)

## 🔧 Configuration

### Adjust Quality

Edit `server/middleware/upload.js`:

```javascript
.webp({ quality: 80 })  // Change 80 to desired quality (1-100)
```

Lower quality = smaller file size, lower quality = better visual quality

### Adjust Max Dimensions

```javascript
.resize(1200, 1200, {    // Change dimensions here
  fit: 'inside',
  withoutEnlargement: true,
})
```

### Adjust File Size Limit

```javascript
limits: {
  fileSize: 10 * 1024 * 1024, // 10MB - change this value
}
```

## 📊 Performance Comparison

| Format | Original Size | WebP Size | Savings |
| ------ | ------------- | --------- | ------- |
| JPEG   | 2.5 MB        | 350 KB    | 86%     |
| PNG    | 4.8 MB        | 420 KB    | 91%     |
| GIF    | 1.2 MB        | 180 KB    | 85%     |

## 🌐 Browser Support

WebP is supported by all modern browsers:

- ✅ Chrome 23+
- ✅ Firefox 65+
- ✅ Edge 18+
- ✅ Safari 14+ (macOS 11+)
- ✅ Opera 12.1+
- ✅ Mobile browsers (iOS 14+, Android 5+)

## 🔒 Security Features

- **File type validation** - Only images allowed
- **Size limits** - Prevents huge uploads
- **Memory storage** - Processes in memory before saving
- **Unique filenames** - Prevents overwriting

## 🐛 Troubleshooting

### Error: "Error processing image"

- Check if Sharp is installed: `pnpm list sharp`
- Reinstall if needed: `pnpm add sharp`

### Error: "File too large"

- Maximum 10MB before compression
- Compress image before uploading

### Image looks blurry

- Increase quality setting in upload.js
- Change from `quality: 80` to `quality: 90`

### Want to keep original format?

- Remove `.webp()` conversion
- Update filename generation to use original extension

## 💡 Best Practices

1. **Let the server handle compression** - Don't pre-compress images
2. **Use high-quality originals** - Better source = better WebP
3. **Test quality settings** - Find balance between size and quality
4. **Monitor upload folder size** - Clean up old images periodically
5. **Use CDN for production** - Offload image serving

## 📚 Technical Details

### Sharp Library

- Fast image processing library
- Native code (C++ bindings)
- Optimized for performance
- Supports all major image formats

### WebP Format

- Developed by Google
- 25-35% smaller than JPEG
- Supports transparency (like PNG)
- Supports animation (like GIF)
- Lossless and lossy compression

## 🔗 Related Endpoints

- `POST /api/products/upload` - Single image upload
- `POST /api/products/upload/multiple` - Multiple images (max 5)
- `POST /api/products/with-image` - Create product with image
- `GET /uploads/:filename` - Access uploaded images

## 📸 Example Workflow

1. **Upload image:**

   ```bash
   POST /api/products/upload
   File: laptop.jpg (3.2 MB)
   ```

2. **Server processes:**

   - Receives: laptop.jpg (3.2 MB, 4000x3000 JPEG)
   - Resizes: to 1200x900 (maintains ratio)
   - Converts: to WebP format
   - Compresses: quality 80%
   - Saves: product-1234567890.webp (380 KB)

3. **Response:**

   ```json
   {
     "imageUrl": "/uploads/product-1234567890.webp",
     "size": 388234
   }
   ```

4. **Use in product:**
   ```json
   {
     "name": {"en": "Laptop", "ar": "لابتوب"},
     "image": "http://localhost:5000/uploads/product-1234567890.webp",
     ...
   }
   ```

## ✨ Summary

- **Automatic compression** saves bandwidth
- **WebP format** reduces file sizes by 60-80%
- **No client-side work** needed
- **Optimized for web** performance
- **Production-ready** solution

All images are automatically optimized - just upload and go! 🚀

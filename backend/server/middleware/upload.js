const multer = require("multer");
const path = require("path");
const fs = require("fs");
const sharp = require("sharp");

// Ensure uploads directory exists
const uploadDir = path.join(__dirname, "../uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Configure memory storage (we'll process before saving to disk)
const storage = multer.memoryStorage();

// File filter - only allow images
const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|gif|webp/;
  const extname = allowedTypes.test(
    path.extname(file.originalname).toLowerCase()
  );
  const mimetype = allowedTypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb(new Error("Only image files are allowed (jpeg, jpg, png, gif, webp)"));
  }
};

// Configure multer
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB max file size (before compression)
  },
  fileFilter: fileFilter,
});

// Middleware to process and compress image to WebP
const processImage = async (req, res, next) => {
  if (!req.file && !req.files) {
    return next();
  }

  try {
    // Handle single file upload
    if (req.file) {
      const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
      const filename = `product-${uniqueSuffix}.webp`;
      const filepath = path.join(uploadDir, filename);

      // Compress and convert to WebP
      await sharp(req.file.buffer)
        .resize(1200, 1200, {
          fit: "inside",
          withoutEnlargement: true,
        })
        .webp({ quality: 80 })
        .toFile(filepath);

      // Update req.file with new info
      req.file.filename = filename;
      req.file.path = filepath;
      req.file.mimetype = "image/webp";

      // Get file size after compression
      const stats = fs.statSync(filepath);
      req.file.size = stats.size;
    }

    // Handle multiple file uploads
    if (req.files && Array.isArray(req.files)) {
      const processedFiles = [];

      for (const file of req.files) {
        const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
        const filename = `product-${uniqueSuffix}.webp`;
        const filepath = path.join(uploadDir, filename);

        // Compress and convert to WebP
        await sharp(file.buffer)
          .resize(1200, 1200, {
            fit: "inside",
            withoutEnlargement: true,
          })
          .webp({ quality: 80 })
          .toFile(filepath);

        // Get file size after compression
        const stats = fs.statSync(filepath);

        processedFiles.push({
          ...file,
          filename: filename,
          path: filepath,
          mimetype: "image/webp",
          size: stats.size,
        });
      }

      req.files = processedFiles;
    }

    next();
  } catch (error) {
    console.error("Image processing error:", error);
    return res.status(500).json({
      success: false,
      message: "Error processing image",
      error: error.message,
    });
  }
};

module.exports = upload;
module.exports.processImage = processImage;

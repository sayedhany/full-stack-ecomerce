const express = require("express");
const router = express.Router();
const Product = require("../models/Product");
const upload = require("../middleware/upload");
const { processImage } = require("../middleware/upload");
const { protect, authorize } = require("../middleware/auth");

/**
 * @swagger
 * /api/products:
 *   get:
 *     summary: Get all products with pagination
 *     tags: [Products]
 *     description: Retrieve all active products with optional category filtering and pagination
 *     parameters:
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *         description: Category slug to filter by
 *         example: electronics
 *       - in: query
 *         name: lang
 *         schema:
 *           type: string
 *           enum: [en, ar]
 *         description: Language for category slug (required if category is provided)
 *         example: en
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 1
 *         description: Page number
 *         example: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *           default: 10
 *         description: Number of items per page
 *         example: 10
 *       - in: query
 *         name: sort
 *         schema:
 *           type: string
 *           enum: [newest, oldest, price-low, price-high, name-asc, name-desc]
 *           default: newest
 *         description: Sort order
 *         example: newest
 *     responses:
 *       200:
 *         description: List of products retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 count:
 *                   type: number
 *                   example: 10
 *                 total:
 *                   type: number
 *                   example: 45
 *                 page:
 *                   type: number
 *                   example: 1
 *                 pages:
 *                   type: number
 *                   example: 5
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Product'
 *       404:
 *         description: Category not found
 *       500:
 *         description: Server error
 */
router.get("/", async (req, res) => {
  try {
    const { category, lang, page = 1, limit = 10, sort = "newest" } = req.query;
    const query = { isActive: true };

    // Filter by category slug if provided
    if (category && lang) {
      const Category = require("../models/Category");
      const categoryQuery = {};

      if (lang === "en") {
        categoryQuery["slug.en"] = category;
      } else if (lang === "ar") {
        categoryQuery["slug.ar"] = category;
      }

      const categoryDoc = await Category.findOne(categoryQuery);

      if (categoryDoc) {
        query.category = categoryDoc._id;
      } else {
        return res.status(404).json({
          success: false,
          message: "Category not found",
        });
      }
    }

    // Pagination
    const pageNum = parseInt(page, 10);
    const limitNum = Math.min(parseInt(limit, 10), 100); // Max 100 items per page
    const skip = (pageNum - 1) * limitNum;

    // Sorting
    let sortOption = { createdAt: -1 }; // Default: newest first

    switch (sort) {
      case "oldest":
        sortOption = { createdAt: 1 };
        break;
      case "price-low":
        sortOption = { price: 1 };
        break;
      case "price-high":
        sortOption = { price: -1 };
        break;
      case "name-asc":
        sortOption = { "name.en": 1 };
        break;
      case "name-desc":
        sortOption = { "name.en": -1 };
        break;
      default:
        sortOption = { createdAt: -1 };
    }

    // Get total count for pagination
    const total = await Product.countDocuments(query);

    // Get paginated products
    const products = await Product.find(query)
      .populate("category")
      .populate("createdBy updatedBy", "name email")
      .sort(sortOption)
      .skip(skip)
      .limit(limitNum);

    res.json({
      success: true,
      count: products.length,
      total: total,
      page: pageNum,
      pages: Math.ceil(total / limitNum),
      data: products,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching products",
      error: error.message,
    });
  }
});

/**
 * @swagger
 * /api/products/category/{categoryId}:
 *   get:
 *     summary: Get products by category ID
 *     tags: [Products]
 *     description: Retrieve all active products belonging to a specific category with pagination
 *     parameters:
 *       - in: path
 *         name: categoryId
 *         required: true
 *         schema:
 *           type: string
 *         description: Category MongoDB ObjectId
 *         example: 507f1f77bcf86cd799439011
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 1
 *         description: Page number
 *         example: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *           default: 10
 *         description: Number of items per page
 *         example: 10
 *       - in: query
 *         name: sort
 *         schema:
 *           type: string
 *           enum: [newest, oldest, price-low, price-high, name-asc, name-desc]
 *           default: newest
 *         description: Sort order
 *         example: newest
 *     responses:
 *       200:
 *         description: Products retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 count:
 *                   type: number
 *                   example: 10
 *                 total:
 *                   type: number
 *                   example: 25
 *                 page:
 *                   type: number
 *                   example: 1
 *                 pages:
 *                   type: number
 *                   example: 3
 *                 category:
 *                   $ref: '#/components/schemas/Category'
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Product'
 *       404:
 *         description: Category not found
 *       500:
 *         description: Server error
 */
router.get("/category/:categoryId", async (req, res) => {
  try {
    const { categoryId } = req.params;
    const { page = 1, limit = 10, sort = "newest" } = req.query;

    // Verify category exists
    const Category = require("../models/Category");
    const category = await Category.findById(categoryId);

    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }

    // Query for products in this category
    const query = {
      category: categoryId,
      isActive: true,
    };

    // Pagination
    const pageNum = parseInt(page, 10);
    const limitNum = Math.min(parseInt(limit, 10), 100);
    const skip = (pageNum - 1) * limitNum;

    // Sorting
    let sortOption = { createdAt: -1 };

    switch (sort) {
      case "oldest":
        sortOption = { createdAt: 1 };
        break;
      case "price-low":
        sortOption = { price: 1 };
        break;
      case "price-high":
        sortOption = { price: -1 };
        break;
      case "name-asc":
        sortOption = { "name.en": 1 };
        break;
      case "name-desc":
        sortOption = { "name.en": -1 };
        break;
      default:
        sortOption = { createdAt: -1 };
    }

    // Get total count
    const total = await Product.countDocuments(query);

    // Get paginated products
    const products = await Product.find(query)
      .populate("category")
      .populate("createdBy updatedBy", "name email")
      .sort(sortOption)
      .skip(skip)
      .limit(limitNum);

    res.json({
      success: true,
      count: products.length,
      total: total,
      page: pageNum,
      pages: Math.ceil(total / limitNum),
      category: category,
      data: products,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching products by category",
      error: error.message,
    });
  }
});

/**
 * @swagger
 * /api/products/{slug}:
 *   get:
 *     summary: Get product by slug
 *     tags: [Products]
 *     description: Retrieve a single product by its slug in the specified language
 *     parameters:
 *       - in: path
 *         name: slug
 *         required: true
 *         schema:
 *           type: string
 *         description: Product slug in the specified language
 *         example: laptop-pro-15
 *     responses:
 *       200:
 *         description: Product retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/Product'
 *       400:
 *         description: Invalid language parameter
 *       404:
 *         description: Product not found
 *       500:
 *         description: Server error
 */
router.get("/:slug", async (req, res) => {
  try {
    const { slug } = req.params;
    const query = { isActive: true };

    query["slug.en"] = slug;

    const product = await Product.findOne(query).populate("category");

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    res.json({
      success: true,
      data: product,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching product",
      error: error.message,
    });
  }
});

/**
 * @swagger
 * /api/products/id/{id}:
 *   get:
 *     summary: Get product by ID
 *     tags: [Products]
 *     description: Retrieve a single product by its MongoDB ObjectId
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Product MongoDB ObjectId
 *         example: 507f1f77bcf86cd799439012
 *     responses:
 *       200:
 *         description: Product retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/Product'
 *       404:
 *         description: Product not found
 *       500:
 *         description: Server error
 */
router.get("/id/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate("category");

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    res.json({
      success: true,
      data: product,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching product",
      error: error.message,
    });
  }
});

/**
 * @swagger
 * /api/products:
 *   post:
 *     summary: Create a new product
 *     tags: [Products]
 *     description: Create a new product with bilingual content
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ProductInput'
 *           examples:
 *             laptop:
 *               summary: Laptop product
 *               value:
 *                 name:
 *                   en: Laptop Pro 15
 *                   ar: لابتوب برو ١٥
 *                 description:
 *                   en: High-performance laptop with 16GB RAM and 512GB SSD
 *                   ar: كمبيوتر محمول عالي الأداء مع ذاكرة 16 جيجابايت وقرص SSD بسعة 512 جيجابايت
 *                 price: 1299.99
 *                 image: https://images.unsplash.com/photo-1496181133206-80ce9b88a853
 *                 slug:
 *                   en: laptop-pro-15
 *                   ar: لابتوب-برو-15
 *                 category: 507f1f77bcf86cd799439011
 *                 isActive: true
 *     responses:
 *       201:
 *         description: Product created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Product created successfully
 *                 data:
 *                   $ref: '#/components/schemas/Product'
 *       400:
 *         description: Bad request or duplicate slug
 *     security:
 *       - bearerAuth: []
 */
router.post("/", protect, authorize("admin"), async (req, res) => {
  try {
    // Add createdBy from authenticated user
    const productData = {
      ...req.body,
      createdBy: req.user._id,
    };

    const product = await Product.create(productData);
    const populatedProduct = await Product.findById(product._id)
      .populate("category")
      .populate("createdBy", "name email");

    res.status(201).json({
      success: true,
      message: "Product created successfully",
      data: populatedProduct,
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: "Product with this slug already exists",
        error: error.message,
      });
    }
    res.status(400).json({
      success: false,
      message: "Error creating product",
      error: error.message,
    });
  }
});

/**
 * @swagger
 * /api/products/{id}:
 *   put:
 *     summary: Update a product
 *     tags: [Products]
 *     description: Update an existing product by ID (supports both JSON and multipart/form-data for image updates)
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Product ID
 *         example: 507f1f77bcf86cd799439012
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ProductInput'
 *           examples:
 *             updatePrice:
 *               summary: Update product price
 *               value:
 *                 price: 1199.99
 *             updateStatus:
 *               summary: Deactivate product
 *               value:
 *                 isActive: false
 *             fullUpdate:
 *               summary: Full product update
 *               value:
 *                 name:
 *                   en: Laptop Pro 15 (2024)
 *                   ar: لابتوب برو ١٥ (٢٠٢٤)
 *                 price: 1399.99
 *                 isActive: true
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               name_en:
 *                 type: string
 *               name_ar:
 *                 type: string
 *               description_en:
 *                 type: string
 *               description_ar:
 *                 type: string
 *               price:
 *                 type: number
 *               slug_en:
 *                 type: string
 *               slug_ar:
 *                 type: string
 *               category:
 *                 type: string
 *               isActive:
 *                 type: boolean
 *               image:
 *                 type: string
 *                 format: binary
 *                 description: New product image (optional)
 *     responses:
 *       200:
 *         description: Product updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Product updated successfully
 *                 data:
 *                   $ref: '#/components/schemas/Product'
 *       404:
 *         description: Product not found
 *       400:
 *         description: Bad request
 *     security:
 *       - bearerAuth: []
 */
router.put(
  "/:id",
  protect,
  authorize("admin"),
  upload.single("image"),
  processImage,
  async (req, res) => {
    try {
      let updateData = {};

      // Check if this is a multipart/form-data request (with file upload)
      if (req.file || req.body.name_en) {
        // Multipart form data - construct the object
        if (req.body.name_en || req.body.name_ar) {
          updateData.name = {};
          if (req.body.name_en) updateData.name.en = req.body.name_en;
          if (req.body.name_ar) updateData.name.ar = req.body.name_ar;
        }

        if (req.body.description_en || req.body.description_ar) {
          updateData.description = {};
          if (req.body.description_en)
            updateData.description.en = req.body.description_en;
          if (req.body.description_ar)
            updateData.description.ar = req.body.description_ar;
        }

        if (req.body.slug_en || req.body.slug_ar) {
          updateData.slug = {};
          if (req.body.slug_en) updateData.slug.en = req.body.slug_en;
          if (req.body.slug_ar) updateData.slug.ar = req.body.slug_ar;
        }

        if (req.body.price) updateData.price = req.body.price;
        if (req.body.category) updateData.category = req.body.category;
        if (req.body.isActive !== undefined)
          updateData.isActive = req.body.isActive;

        // Add new image URL if file was uploaded
        if (req.file) {
          updateData.image = `${req.protocol}://${req.get("host")}/uploads/${
            req.file.filename
          }`;
        }
      } else {
        // JSON request - use body as is
        updateData = { ...req.body };
      }

      // Add updatedBy from authenticated user
      updateData.updatedBy = req.user._id;

      const product = await Product.findByIdAndUpdate(
        req.params.id,
        updateData,
        {
          new: true,
          runValidators: true,
        }
      )
        .populate("category")
        .populate("createdBy updatedBy", "name email");

      if (!product) {
        return res.status(404).json({
          success: false,
          message: "Product not found",
        });
      }

      res.json({
        success: true,
        message: "Product updated successfully",
        data: product,
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: "Error updating product",
        error: error.message,
      });
    }
  }
);

/**
 * @swagger
 * /api/products/{id}:
 *   delete:
 *     summary: Delete a product
 *     tags: [Products]
 *     description: Permanently delete a product by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Product ID
 *         example: 507f1f77bcf86cd799439012
 *     responses:
 *       200:
 *         description: Product deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Product deleted successfully
 *                 data:
 *                   $ref: '#/components/schemas/Product'
 *       404:
 *         description: Product not found
 *       500:
 *         description: Server error
 *     security:
 *       - bearerAuth: []
 */
router.delete("/:id", protect, authorize("admin"), async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    res.json({
      success: true,
      message: "Product deleted successfully",
      data: product,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error deleting product",
      error: error.message,
    });
  }
});

/**
 * @swagger
 * /api/products/upload:
 *   post:
 *     summary: Upload product image
 *     tags: [Products]
 *     description: Upload a single product image (jpeg, jpg, png, gif, webp - max 5MB)
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               image:
 *                 type: string
 *                 format: binary
 *                 description: Product image file
 *     responses:
 *       200:
 *         description: Image uploaded successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Image uploaded successfully
 *                 imageUrl:
 *                   type: string
 *                   example: /uploads/product-1234567890.jpg
 *                 fullUrl:
 *                   type: string
 *                   example: http://localhost:5000/uploads/product-1234567890.jpg
 *       400:
 *         description: No file uploaded or invalid file type
 *       500:
 *         description: Server error
 *     security:
 *       - bearerAuth: []
 */
router.post(
  "/upload",
  protect,
  authorize("admin"),
  upload.single("image"),
  processImage,
  async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({
          success: false,
          message: "No image file uploaded",
        });
      }

      const imageUrl = `/uploads/${req.file.filename}`;
      const fullUrl = `${req.protocol}://${req.get("host")}${imageUrl}`;

      res.json({
        success: true,
        message: "Image uploaded successfully",
        imageUrl: imageUrl,
        fullUrl: fullUrl,
        file: {
          filename: req.file.filename,
          originalname: req.file.originalname,
          mimetype: req.file.mimetype,
          size: req.file.size,
        },
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Error uploading image",
        error: error.message,
      });
    }
  }
);

/**
 * @swagger
 * /api/products/upload/multiple:
 *   post:
 *     summary: Upload multiple product images
 *     tags: [Products]
 *     description: Upload up to 5 product images at once (jpeg, jpg, png, gif, webp - max 5MB each)
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               images:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *                 description: Multiple product image files
 *     responses:
 *       200:
 *         description: Images uploaded successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: 3 images uploaded successfully
 *                 images:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       imageUrl:
 *                         type: string
 *                       fullUrl:
 *                         type: string
 *                       filename:
 *                         type: string
 *       400:
 *         description: No files uploaded
 *       500:
 *         description: Server error
 *     security:
 *       - bearerAuth: []
 */
router.post(
  "/upload/multiple",
  protect,
  authorize("admin"),
  upload.array("images", 5),
  processImage,
  async (req, res) => {
    try {
      if (!req.files || req.files.length === 0) {
        return res.status(400).json({
          success: false,
          message: "No image files uploaded",
        });
      }

      const images = req.files.map((file) => ({
        imageUrl: `/uploads/${file.filename}`,
        fullUrl: `${req.protocol}://${req.get("host")}/uploads/${
          file.filename
        }`,
        filename: file.filename,
        originalname: file.originalname,
        mimetype: file.mimetype,
        size: file.size,
      }));

      res.json({
        success: true,
        message: `${req.files.length} image(s) uploaded successfully`,
        count: req.files.length,
        images: images,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Error uploading images",
        error: error.message,
      });
    }
  }
);

/**
 * @swagger
 * /api/products/with-image:
 *   post:
 *     summary: Create product with image upload
 *     tags: [Products]
 *     description: Create a new product and upload its image in one request
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - name_en
 *               - name_ar
 *               - description_en
 *               - description_ar
 *               - price
 *               - slug_en
 *               - slug_ar
 *               - category
 *               - image
 *             properties:
 *               name_en:
 *                 type: string
 *                 example: Laptop Pro 15
 *               name_ar:
 *                 type: string
 *                 example: لابتوب برو ١٥
 *               description_en:
 *                 type: string
 *                 example: High-performance laptop
 *               description_ar:
 *                 type: string
 *                 example: كمبيوتر محمول عالي الأداء
 *               price:
 *                 type: number
 *                 example: 1299.99
 *               slug_en:
 *                 type: string
 *                 example: laptop-pro-15
 *               slug_ar:
 *                 type: string
 *                 example: لابتوب-برو-15
 *               category:
 *                 type: string
 *                 example: 507f1f77bcf86cd799439011
 *               isActive:
 *                 type: boolean
 *                 example: true
 *               image:
 *                 type: string
 *                 format: binary
 *                 description: Product image file
 *     responses:
 *       201:
 *         description: Product created with image successfully
 *       400:
 *         description: Bad request or validation error
 *     security:
 *       - bearerAuth: []
 */
router.post(
  "/with-image",
  protect,
  authorize("admin"),
  upload.single("image"),
  processImage,
  async (req, res) => {
    try {
      // Construct product data from form fields
      const productData = {
        name: {
          en: req.body.name_en,
          ar: req.body.name_ar,
        },
        description: {
          en: req.body.description_en,
          ar: req.body.description_ar,
        },
        price: req.body.price,
        slug: {
          en: req.body.slug_en,
          ar: req.body.slug_ar,
        },
        category: req.body.category,
        isActive: req.body.isActive !== undefined ? req.body.isActive : true,
        createdBy: req.user._id, // Add createdBy from authenticated user
      };

      // Add image URL if file was uploaded
      if (req.file) {
        productData.image = `${req.protocol}://${req.get("host")}/uploads/${
          req.file.filename
        }`;
      } else if (req.body.image) {
        // Use provided URL if no file uploaded
        productData.image = req.body.image;
      } else {
        return res.status(400).json({
          success: false,
          message: "Product image is required (upload file or provide URL)",
        });
      }

      const product = await Product.create(productData);
      const populatedProduct = await Product.findById(product._id)
        .populate("category")
        .populate("createdBy", "name email");

      res.status(201).json({
        success: true,
        message: "Product created with image successfully",
        data: populatedProduct,
      });
    } catch (error) {
      if (error.code === 11000) {
        return res.status(400).json({
          success: false,
          message: "Product with this slug already exists",
          error: error.message,
        });
      }
      res.status(400).json({
        success: false,
        message: "Error creating product",
        error: error.message,
      });
    }
  }
);

module.exports = router;

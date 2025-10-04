const express = require("express");
const router = express.Router();
const Product = require("../models/Product");

/**
 * @swagger
 * /api/products:
 *   get:
 *     summary: Get all products
 *     tags: [Products]
 *     description: Retrieve all active products with optional category filtering
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
    const { category, lang } = req.query;
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

    const products = await Product.find(query)
      .populate("category")
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: products.length,
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
 * /api/products/{lang}/{slug}:
 *   get:
 *     summary: Get product by slug
 *     tags: [Products]
 *     description: Retrieve a single product by its slug in the specified language
 *     parameters:
 *       - in: path
 *         name: lang
 *         required: true
 *         schema:
 *           type: string
 *           enum: [en, ar]
 *         description: Language code (en for English, ar for Arabic)
 *         example: en
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
router.get("/:lang/:slug", async (req, res) => {
  try {
    const { lang, slug } = req.params;
    const query = { isActive: true };

    if (lang === "en") {
      query["slug.en"] = slug;
    } else if (lang === "ar") {
      query["slug.ar"] = slug;
    } else {
      return res.status(400).json({
        success: false,
        message: 'Invalid language. Use "en" or "ar"',
      });
    }

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
 */
router.post("/", async (req, res) => {
  try {
    const product = await Product.create(req.body);
    const populatedProduct = await Product.findById(product._id).populate(
      "category"
    );

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
 *     description: Update an existing product by ID
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
 */
router.put("/:id", async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    }).populate("category");

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
});

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
 */
router.delete("/:id", async (req, res) => {
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

module.exports = router;

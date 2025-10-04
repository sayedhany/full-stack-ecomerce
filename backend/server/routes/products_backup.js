const express = require("express");
const router = express.Router();
const Product = require("../models/Product");

// GET all products with optional filters
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

// GET single product by slug and language
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

// GET single product by ID
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

// POST create new product
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

// PUT update product
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

// DELETE product
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

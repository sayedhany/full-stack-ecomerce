const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    name: {
      en: {
        type: String,
        required: [true, "English name is required"],
        trim: true,
      },
      ar: {
        type: String,
        required: [true, "Arabic name is required"],
        trim: true,
      },
    },
    description: {
      en: {
        type: String,
        required: [true, "English description is required"],
        trim: true,
      },
      ar: {
        type: String,
        required: [true, "Arabic description is required"],
        trim: true,
      },
    },
    price: {
      type: Number,
      required: [true, "Price is required"],
      min: [0, "Price must be a positive number"],
    },
    image: {
      type: String,
      required: [true, "Image URL is required"],
      trim: true,
    },
    slug: {
      en: {
        type: String,
        required: [true, "English slug is required"],
        unique: true,
        lowercase: true,
        trim: true,
      },
      ar: {
        type: String,
        required: [true, "Arabic slug is required"],
        unique: true,
        trim: true,
      },
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: [true, "Category is required"],
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for faster queries
productSchema.index({ "slug.en": 1, "slug.ar": 1 });
productSchema.index({ category: 1 });
productSchema.index({ isActive: 1 });

const Product = mongoose.model("Product", productSchema);

module.exports = Product;

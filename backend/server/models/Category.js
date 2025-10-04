const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema(
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
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

// Index for faster queries
categorySchema.index({ "slug.en": 1, "slug.ar": 1 });
categorySchema.index({ isActive: 1 });

const Category = mongoose.model("Category", categorySchema);

module.exports = Category;

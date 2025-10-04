const mongoose = require("mongoose");
const Category = require("./models/Category");
const Product = require("./models/Product");
require("dotenv").config();

const MONGODB_URI =
  process.env.MONGODB_URI || "mongodb://localhost:27017/ecommerce";

// Sample data
const categories = [
  {
    name: {
      en: "Electronics",
      ar: "إلكترونيات",
    },
    slug: {
      en: "electronics",
      ar: "الكترونيات",
    },
    isActive: true,
  },
  {
    name: {
      en: "Clothing",
      ar: "ملابس",
    },
    slug: {
      en: "clothing",
      ar: "ملابس",
    },
    isActive: true,
  },
  {
    name: {
      en: "Books",
      ar: "كتب",
    },
    slug: {
      en: "books",
      ar: "كتب",
    },
    isActive: true,
  },
];

const seedDatabase = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(MONGODB_URI);
    console.log("✅ Connected to MongoDB");

    // Clear existing data
    await Category.deleteMany({});
    await Product.deleteMany({});
    console.log("🗑️  Cleared existing data");

    // Insert categories
    const insertedCategories = await Category.insertMany(categories);
    console.log(`✅ Inserted ${insertedCategories.length} categories`);

    // Create sample products
    const products = [
      {
        name: {
          en: "Laptop Pro 15",
          ar: "لابتوب برو ١٥",
        },
        description: {
          en: "High-performance laptop with 16GB RAM and 512GB SSD",
          ar: "كمبيوتر محمول عالي الأداء مع ذاكرة 16 جيجابايت وقرص SSD بسعة 512 جيجابايت",
        },
        price: 1299.99,
        image: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853",
        slug: {
          en: "laptop-pro-15",
          ar: "لابتوب-برو-15",
        },
        category: insertedCategories[0]._id,
        isActive: true,
      },
      {
        name: {
          en: "Wireless Headphones",
          ar: "سماعات لاسلكية",
        },
        description: {
          en: "Noise-cancelling wireless headphones with premium sound quality",
          ar: "سماعات لاسلكية بخاصية عزل الضوضاء وجودة صوت فائقة",
        },
        price: 249.99,
        image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e",
        slug: {
          en: "wireless-headphones",
          ar: "سماعات-لاسلكية",
        },
        category: insertedCategories[0]._id,
        isActive: true,
      },
      {
        name: {
          en: "Smart Watch",
          ar: "ساعة ذكية",
        },
        description: {
          en: "Fitness tracking smartwatch with heart rate monitor",
          ar: "ساعة ذكية لتتبع اللياقة البدنية مع جهاز مراقبة معدل ضربات القلب",
        },
        price: 399.99,
        image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30",
        slug: {
          en: "smart-watch",
          ar: "ساعة-ذكية",
        },
        category: insertedCategories[0]._id,
        isActive: true,
      },
      {
        name: {
          en: "Cotton T-Shirt",
          ar: "قميص قطني",
        },
        description: {
          en: "Premium quality 100% cotton t-shirt",
          ar: "قميص قطني بجودة فائقة 100٪",
        },
        price: 29.99,
        image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab",
        slug: {
          en: "cotton-t-shirt",
          ar: "قميص-قطني",
        },
        category: insertedCategories[1]._id,
        isActive: true,
      },
      {
        name: {
          en: "Denim Jeans",
          ar: "جينز",
        },
        description: {
          en: "Classic blue denim jeans with comfortable fit",
          ar: "جينز أزرق كلاسيكي بمقاس مريح",
        },
        price: 79.99,
        image: "https://images.unsplash.com/photo-1542272604-787c3835535d",
        slug: {
          en: "denim-jeans",
          ar: "جينز",
        },
        category: insertedCategories[1]._id,
        isActive: true,
      },
      {
        name: {
          en: "JavaScript: The Good Parts",
          ar: "جافا سكريبت: الأجزاء الجيدة",
        },
        description: {
          en: "Essential guide to JavaScript programming",
          ar: "دليل أساسي لبرمجة جافا سكريبت",
        },
        price: 34.99,
        image: "https://images.unsplash.com/photo-1544947950-fa07a98d237f",
        slug: {
          en: "javascript-good-parts",
          ar: "جافا-سكريبت-الأجزاء-الجيدة",
        },
        category: insertedCategories[2]._id,
        isActive: true,
      },
      {
        name: {
          en: "Clean Code",
          ar: "كود نظيف",
        },
        description: {
          en: "A handbook of agile software craftsmanship",
          ar: "دليل لصناعة البرمجيات الرشيقة",
        },
        price: 42.99,
        image: "https://images.unsplash.com/photo-1589998059171-988d887df646",
        slug: {
          en: "clean-code",
          ar: "كود-نظيف",
        },
        category: insertedCategories[2]._id,
        isActive: true,
      },
    ];

    const insertedProducts = await Product.insertMany(products);
    console.log(`✅ Inserted ${insertedProducts.length} products`);

    console.log("\n📊 Database seeded successfully!");
    console.log("\n📦 Summary:");
    console.log(`   Categories: ${insertedCategories.length}`);
    console.log(`   Products: ${insertedProducts.length}`);

    console.log("\n🔗 You can now test the API:");
    console.log(`   GET http://localhost:5000/api/categories`);
    console.log(`   GET http://localhost:5000/api/products`);
    console.log(
      `   GET http://localhost:5000/api/products?category=electronics&lang=en`
    );
    console.log(`   GET http://localhost:5000/api/products/en/laptop-pro-15`);
  } catch (error) {
    console.error("❌ Error seeding database:", error);
  } finally {
    await mongoose.connection.close();
    console.log("\n👋 Database connection closed");
    process.exit(0);
  }
};

seedDatabase();

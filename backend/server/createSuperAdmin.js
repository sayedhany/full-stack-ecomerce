const mongoose = require("mongoose");
const User = require("./models/User");
const path = require("path");
require("dotenv").config({ path: path.join(__dirname, ".env") });

const MONGODB_URI =
  process.env.MONGODB_URI ||
  "mongodb+srv://sayed591999:sayed591999@cluster0.dwfjqjn.mongodb.net/egyptfishar?retryWrites=true&w=majority&appName=Cluster0";

// Create the first superadmin
const createSuperAdmin = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(MONGODB_URI);
    console.log("✅ Connected to MongoDB");

    // Check if any admin exists
    const existingAdmin = await User.findOne({ role: "admin" });

    if (existingAdmin) {
      console.log("ℹ️  Admin user already exists:");
      console.log(`   Email: ${existingAdmin.email}`);
      console.log(`   Name: ${existingAdmin.name}`);
      console.log("\n💡 Use this email and password to login.");
      await mongoose.connection.close();
      process.exit(0);
    }

    // Create superadmin
    const superadmin = await User.create({
      name: "Super Admin",
      email: "admin@example.com",
      password: "admin123",
      role: "admin",
      isActive: true,
    });

    console.log("\n✅ Superadmin created successfully!");
    console.log("\n📋 Login Credentials:");
    console.log(`   Email: ${superadmin.email}`);
    console.log(`   Password: admin123`);
    console.log(`   Role: ${superadmin.role}`);
    console.log("\n⚠️  IMPORTANT: Change the password after first login!");
    console.log("\n🔗 Login at: POST http://localhost:5000/api/auth/login");
  } catch (error) {
    console.error("❌ Error creating superadmin:", error.message);
  } finally {
    await mongoose.connection.close();
    console.log("\n👋 Database connection closed");
    process.exit(0);
  }
};

createSuperAdmin();

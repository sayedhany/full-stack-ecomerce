// MongoDB initialization script for Docker
// This script creates the initial admin user and database

db = db.getSiblingDB("egyptfishar");

// Create admin user for the ecommerce database
db.createUser({
  user: "ecommerce_admin",
  pwd: "ecommerce_password",
  roles: [
    {
      role: "readWrite",
      db: "egyptfishar",
    },
  ],
});

// Create initial collections
db.createCollection("users");
db.createCollection("categories");
db.createCollection("products");

// Insert a default admin user
db.users.insertOne({
  name: "Super Admin",
  email: "admin@example.com",
  password: "$2a$10$YourHashedPasswordHere", // You'll need to hash this
  role: "admin",
  isActive: true,
  createdAt: new Date(),
  updatedAt: new Date(),
});

print("Database initialized successfully!");

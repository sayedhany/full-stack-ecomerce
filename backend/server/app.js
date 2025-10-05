const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const swaggerUi = require("swagger-ui-express");
const swaggerSpec = require("./swagger");
const morgan = require("morgan");
const path = require("path");
require("dotenv").config();

const app = express();

// ============= LOGGING MIDDLEWARE =============

// Morgan HTTP request logger (production-ready)
if (process.env.NODE_ENV === "development") {
  // Development: detailed logging with colors
  app.use(morgan("dev"));
} else {
  // Production: combined format
  app.use(morgan("combined"));
}

// Custom detailed logging middleware
app.use((req, res, next) => {
  const timestamp = new Date().toISOString();
  const method = req.method;
  const url = req.url;
  const ip = req.ip || req.connection.remoteAddress;

  // Log request with emoji indicators
  const methodEmoji = {
    GET: "📥",
    POST: "📤",
    PUT: "✏️",
    PATCH: "🔧",
    DELETE: "🗑️",
  };

  console.log(
    `\n${methodEmoji[method] || "📡"} [${timestamp}] ${method} ${url}`
  );
  console.log(`   IP: ${ip}`);

  // Log request body for POST/PUT/PATCH
  if (
    ["POST", "PUT", "PATCH"].includes(method) &&
    req.body &&
    Object.keys(req.body).length > 0
  ) {
    console.log("   📝 Body:", JSON.stringify(req.body, null, 2));
  }

  // Log query parameters
  if (req.query && Object.keys(req.query).length > 0) {
    console.log("   🔍 Query:", req.query);
  }

  // Log headers (optional - commented out to reduce noise)
  // console.log('   📋 Headers:', req.headers);

  // Capture response time
  const startTime = Date.now();

  // Log response when finished
  res.on("finish", () => {
    const duration = Date.now() - startTime;
    const statusCode = res.statusCode;
    const statusEmoji =
      statusCode >= 500 ? "❌" : statusCode >= 400 ? "⚠️" : "✅";

    console.log(
      `${statusEmoji} Response: ${statusCode} ${res.statusMessage} - ${duration}ms\n`
    );
  });

  next();
});

// ============= END LOGGING MIDDLEWARE =============

// CORS Configuration - Allow all localhost origins
const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps, Postman, or curl)
    if (!origin) return callback(null, true);

    // Allow any localhost or 127.0.0.1 with any port
    if (
      origin.startsWith("http://localhost:") ||
      origin.startsWith("http://127.0.0.1:") ||
      origin.startsWith("https://localhost:") ||
      origin.startsWith("https://127.0.0.1:") ||
      origin === "http://localhost" ||
      origin === "http://127.0.0.1"
    ) {
      return callback(null, true);
    }

    // Allow production origins from environment variable
    const allowedOrigins = process.env.ALLOWED_ORIGINS
      ? process.env.ALLOWED_ORIGINS.split(",").map((origin) => origin.trim())
      : [
          // Add your production domains here if not using env variable
          // 'https://yourdomain.com',
          // 'https://www.yourdomain.com'
        ];

    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }

    // For development, allow all origins
    if (process.env.NODE_ENV === "development") {
      return callback(null, true);
    }

    callback(new Error("Not allowed by CORS"));
  },
  credentials: true, // Allow cookies and authentication headers
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

// Middleware
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files from uploads directory
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Swagger Documentation
app.use(
  "/api-docs",
  swaggerUi.serve,
  swaggerUi.setup(swaggerSpec, {
    customCss: ".swagger-ui .topbar { display: none }",
    customSiteTitle: "E-commerce API Documentation",
  })
);

// Swagger JSON
app.get("/api-docs.json", (req, res) => {
  res.setHeader("Content-Type", "application/json");
  res.send(swaggerSpec);
});

// Routes
const productRoutes = require("./routes/products");
const categoryRoutes = require("./routes/categories");
const authRoutes = require("./routes/auth");

app.use("/api/products", productRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/auth", authRoutes);

/**
 * @swagger
 * /api/health:
 *   get:
 *     summary: Health check endpoint
 *     tags: [Health]
 *     description: Check if the server is running
 *     responses:
 *       200:
 *         description: Server is running
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
 *                   example: Server is running
 *                 timestamp:
 *                   type: string
 *                   format: date-time
 */
app.get("/api/health", (req, res) => {
  res.json({
    success: true,
    message: "Server is running",
    timestamp: new Date().toISOString(),
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || "Internal Server Error",
    error: process.env.NODE_ENV === "development" ? err : {},
  });
});

module.exports = app;

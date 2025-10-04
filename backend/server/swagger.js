const swaggerJsdoc = require("swagger-jsdoc");

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "E-commerce Backend API",
      version: "1.0.0",
      description:
        "A bilingual (English/Arabic) e-commerce API with full CRUD operations for products and categories",
      contact: {
        name: "API Support",
        email: "support@example.com",
      },
      license: {
        name: "ISC",
        url: "https://opensource.org/licenses/ISC",
      },
    },
    servers: [
      {
        url: "http://localhost:5000",
        description: "Development server",
      },
      {
        url: "https://your-production-url.com",
        description: "Production server",
      },
    ],
    tags: [
      {
        name: "Health",
        description: "Health check endpoints",
      },
      {
        name: "Authentication",
        description: "User authentication and authorization endpoints",
      },
      {
        name: "Categories",
        description:
          "Category management endpoints (bilingual) - Admin only for CUD operations",
      },
      {
        name: "Products",
        description:
          "Product management endpoints (bilingual) - Admin only for CUD operations",
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
          description: "Enter your JWT token in the format: Bearer <token>",
        },
      },
      schemas: {
        BilingualText: {
          type: "object",
          properties: {
            en: {
              type: "string",
              description: "English text",
              example: "Electronics",
            },
            ar: {
              type: "string",
              description: "Arabic text",
              example: "إلكترونيات",
            },
          },
          required: ["en", "ar"],
        },
        Category: {
          type: "object",
          properties: {
            _id: {
              type: "string",
              description: "Category ID",
              example: "507f1f77bcf86cd799439011",
            },
            name: {
              $ref: "#/components/schemas/BilingualText",
            },
            slug: {
              $ref: "#/components/schemas/BilingualText",
            },
            isActive: {
              type: "boolean",
              description: "Category active status",
              default: true,
            },
            createdAt: {
              type: "string",
              format: "date-time",
              description: "Creation timestamp",
            },
            updatedAt: {
              type: "string",
              format: "date-time",
              description: "Last update timestamp",
            },
          },
        },
        CategoryInput: {
          type: "object",
          required: ["name", "slug"],
          properties: {
            name: {
              type: "object",
              required: ["en", "ar"],
              properties: {
                en: {
                  type: "string",
                  example: "Electronics",
                },
                ar: {
                  type: "string",
                  example: "إلكترونيات",
                },
              },
            },
            slug: {
              type: "object",
              required: ["en", "ar"],
              properties: {
                en: {
                  type: "string",
                  example: "electronics",
                },
                ar: {
                  type: "string",
                  example: "الكترونيات",
                },
              },
            },
            isActive: {
              type: "boolean",
              default: true,
            },
          },
        },
        Product: {
          type: "object",
          properties: {
            _id: {
              type: "string",
              description: "Product ID",
              example: "507f1f77bcf86cd799439012",
            },
            name: {
              $ref: "#/components/schemas/BilingualText",
            },
            description: {
              $ref: "#/components/schemas/BilingualText",
            },
            price: {
              type: "number",
              description: "Product price",
              example: 1299.99,
              minimum: 0,
            },
            image: {
              type: "string",
              description: "Product image URL",
              example:
                "https://images.unsplash.com/photo-1496181133206-80ce9b88a853",
            },
            slug: {
              $ref: "#/components/schemas/BilingualText",
            },
            category: {
              $ref: "#/components/schemas/Category",
            },
            isActive: {
              type: "boolean",
              description: "Product active status",
              default: true,
            },
            createdAt: {
              type: "string",
              format: "date-time",
              description: "Creation timestamp",
            },
            updatedAt: {
              type: "string",
              format: "date-time",
              description: "Last update timestamp",
            },
          },
        },
        ProductInput: {
          type: "object",
          required: [
            "name",
            "description",
            "price",
            "image",
            "slug",
            "category",
          ],
          properties: {
            name: {
              type: "object",
              required: ["en", "ar"],
              properties: {
                en: {
                  type: "string",
                  example: "Laptop Pro 15",
                },
                ar: {
                  type: "string",
                  example: "لابتوب برو ١٥",
                },
              },
            },
            description: {
              type: "object",
              required: ["en", "ar"],
              properties: {
                en: {
                  type: "string",
                  example: "High-performance laptop with 16GB RAM",
                },
                ar: {
                  type: "string",
                  example: "كمبيوتر محمول عالي الأداء مع ذاكرة 16 جيجابايت",
                },
              },
            },
            price: {
              type: "number",
              example: 1299.99,
              minimum: 0,
            },
            image: {
              type: "string",
              example:
                "https://images.unsplash.com/photo-1496181133206-80ce9b88a853",
            },
            slug: {
              type: "object",
              required: ["en", "ar"],
              properties: {
                en: {
                  type: "string",
                  example: "laptop-pro-15",
                },
                ar: {
                  type: "string",
                  example: "لابتوب-برو-15",
                },
              },
            },
            category: {
              type: "string",
              description: "Category ID",
              example: "507f1f77bcf86cd799439011",
            },
            isActive: {
              type: "boolean",
              default: true,
            },
          },
        },
        SuccessResponse: {
          type: "object",
          properties: {
            success: {
              type: "boolean",
              example: true,
            },
            message: {
              type: "string",
              example: "Operation successful",
            },
            data: {
              type: "object",
            },
            count: {
              type: "number",
              example: 10,
            },
          },
        },
        ErrorResponse: {
          type: "object",
          properties: {
            success: {
              type: "boolean",
              example: false,
            },
            message: {
              type: "string",
              example: "Error description",
            },
            error: {
              type: "string",
              example: "Detailed error message",
            },
          },
        },
      },
    },
  },
  apis: ["./server/routes/*.js", "./server/app.js"],
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = swaggerSpec;

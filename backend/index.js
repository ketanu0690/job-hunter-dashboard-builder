const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const swaggerUi = require("swagger-ui-express");
const swaggerJsdoc = require("swagger-jsdoc");
const fs = require("fs");
const path = require("path");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const morgan = require("morgan");

// Load environment variables
dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// Enable request logging in development (morgan)
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

// Apply security middleware
app.use(helmet()); // Set HTTP headers for security

// Apply rate limiting to prevent abuse
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: "Too many requests from this IP, please try again later",
});
app.use(limiter);

// Apply CORS middleware with environment-based configurations
app.use(
  cors({
    origin: (origin, callback) => {
      const allowedOrigins = process.env.ALLOWED_ORIGINS?.split(",") || [
        "http://localhost:8080",
      ]; // Dynamically load allowed origins
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("CORS not allowed"));
      }
    },
    credentials: true,
  })
);
// Body parsing middleware
app.use(express.json());

// Route handling (modularized for scalability)
const features = [
  "parse-resume",
  "save-config",
  "apply-config",
  "linkedin-automation",
];

features.forEach((feature) => {
  const routePath = path.join(__dirname, "features", feature, "route.js");
  // console.log("Loading route for feature:",feature,"from" ,routePath);
  if (fs.existsSync(routePath)) {
    app.use(`/${feature}`, require(routePath));
  } else {
    console.log("path doe not exixts", routePath);
    console.warn(`⚠️ Route not found: ${routePath}`);
  }
});

// Swagger setup with enhanced documentation
const swaggerSpec = swaggerJsdoc({
  definition: {
    openapi: "3.0.0",
    info: {
      title: "🚀 Job Hunter API",
      version: "1.0.0",
      description: "API for managing job application automation 🔍💼",
    },
    servers: [
      { url: "http://localhost:3000" },
      { url: process.env.API_URL || "https://api.yourdomain.com" }, // Dynamically load prod URL
    ],
  },
  apis: ["./features/**/route.js"], // Match all route.js files inside subdirectories
});

// Serve Swagger at /docs
const customCssPath = path.join(__dirname, "swagger-theme.css");
const customCss = fs.existsSync(customCssPath)
  ? fs.readFileSync(customCssPath, "utf8")
  : "";

app.use(
  "/",
  swaggerUi.serve,
  swaggerUi.setup(swaggerSpec, {
    customCss,
    customSiteTitle: "Job Hunter API Docs",
    customfavIcon: "https://cdn-icons-png.flaticon.com/512/942/942748.png",
  })
);

// Graceful shutdown
process.on("SIGTERM", () => {
  console.log("SIGTERM received, shutting down gracefully...");
  server.close(() => {
    console.log("Closed all remaining connections.");
    process.exit(0);
  });
});

// Start the server
const server = app.listen(port, () => {
  console.log(`🚀 Server running at http://localhost:${port}`);
});

// Error handling middleware (for unknown routes and internal errors)
app.use((req, res, next) => {
  console.log("Came here in error handling middleware");
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: "Internal server error",
    error: err.message || "Unknown error",
  });
});

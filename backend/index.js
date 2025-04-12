const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');
const fs = require('fs');
const path = require('path');

// Load environment variables
dotenv.config();

// Create Express app
const app = express();

// Set port from environment or fallback to default
const port = process.env.PORT || 3000;

// Allowed frontend origins
const allowedOrigins = [
  'http://localhost:8080',
  'https://8081-idx-job-hunter-dashboard-buildergit-1744396589226.cluster-73qgvk7hjjadkrjeyexca5ivva.cloudworkstations.dev',
];

// CORS setup to allow only specific origins
app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true,
}));

// Security headers for added protection
app.use((req, res, next) => {
  res.setHeader("Content-Security-Policy", "default-src 'self'");
  res.setHeader("X-Frame-Options", "SAMEORIGIN");
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("Strict-Transport-Security", "max-age=31536000; includeSubDomains; preload");
  next();
});

// Middleware for JSON parsing
app.use(express.json());

// Import and use feature routes (adjust paths if needed)
const routes = ['parse-resume', 'save-config', 'apply-config', 'linkedin-automation'].reduce((acc, route) => {
  acc[route] = require(`./features/${route}/route`);
  app.use(`/api/${route}`, acc[route]);
  return acc;
}, {});

// Swagger setup
const swaggerSpec = swaggerJsdoc({
  definition: {
    openapi: '3.0.0',
    info: {
      title: '🚀 Job Hunter API',
      version: '1.0.0',
      description: 'API for managing job application automation 🔍💼',
    },
    servers: [{ url: 'http://localhost:3000/api', description: 'Local Dev Server' }],
  },
  apis: ['./features/*/route.js'],
});

// Custom Swagger CSS for better look
const customCss = fs.readFileSync(path.join(__dirname, 'swagger-theme.css'), 'utf8');

// Setup Swagger UI route
app.use('/', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
  customCss,
  customSiteTitle: 'Job Hunter API Docs',
  customfavIcon: 'https://cdn-icons-png.flaticon.com/512/942/942748.png',
}));

// Start the server
app.listen(port, '0.0.0.0', () => {
  console.log(`🚀 Server running at http://0.0.0.0:${port}`);
});

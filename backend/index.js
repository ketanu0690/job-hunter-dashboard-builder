
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const swaggerUi = require('swagger-ui-express');

const parseResumeRoute = require('./features/parse-resume/route');
const saveConfigRoute = require('./features/save-config/route');
const applyConfigRoute = require('./features/apply-config/route');

const app = express();

dotenv.config();
const port = process.env.PORT || 3001;

app.use(cors({ origin: '*' })); // Allow all origins (for development only)
app.use(express.json());

app.use(parseResumeRoute);
app.use(saveConfigRoute);
app.use(applyConfigRoute);

// Add security headers
app.use((req, res, next) => {
  res.setHeader("Content-Security-Policy", "default-src 'self'");
  res.setHeader("X-Frame-Options", "SAMEORIGIN");
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("Strict-Transport-Security", "max-age=31536000; includeSubDomains; preload");
  next();
});

// Swagger setup and serve at root
const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Job Hunter Automation API',
      version: '1.0.0',
      description: 'API for managing job application automation',
    },
    components: {
      schemas: {
        Config: {
          type: 'object',
          properties: {
            yaml: {
              type: 'string',
              description: 'YAML configuration for the bot',
            },
          },
          required: ['yaml'],
        },
        Message: {
          type: 'object',
          properties: {
            message: {
              type: 'string',
              description: 'A message describing the result of the operation',
            },
          },
        },
      },
    },
  },
  apis: ['./features/*/route.js'], // Path to the API route files
};

const swaggerSpec = swaggerJsdoc(options);

// Serve Swagger UI at root
app.use('/', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});

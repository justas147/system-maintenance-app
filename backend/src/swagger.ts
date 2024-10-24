import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import { Express } from 'express';

// Define the options for Swagger
const swaggerOptions: swaggerJSDoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'System Maintenance API',
      version: '1.0.0',
      description: 'API documentation for the System Maintenance app',
      contact: {
        name: 'Justas Radkevičius',
        email: 'jusrad1@ktu.lt'
      }
    },
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT'
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
    servers: [
      {
        url: '/v1', // Update with your server URL
        description: 'Development server'
      }
    ]
  },
  // Path to the API docs (this can be your route files)
  apis: ['./src/routes/*.ts'], // Adjust the path according to your project structure
};

// Generate the swagger documentation
const swaggerDocs = swaggerJSDoc(swaggerOptions);

// Function to set up Swagger UI in your Express app
export const setupSwagger = (app: Express): void => {
  app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));
};
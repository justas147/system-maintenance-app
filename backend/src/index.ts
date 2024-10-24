import express from 'express';
import { setupSwagger } from './swagger';
import { routes } from './routes';
import dotenv from "dotenv";
import { handleError } from './core/errorHandler';
import { HandleErrorProps } from './core/types/Error';
dotenv.config();

const app = express();
const port = 3000;

// Middleware for parsing request bodies
app.use(express.json());

// Set up Swagger docs
setupSwagger(app);

// Set up routes
app.use('/v1', routes());

// 404 route handler
app.use((req, res) => {
  res.status(404).send('Route not found');
});

// Error handler
app.use((err: any, req: any, res: any, next: any) => {
  handleError({ err, res } as HandleErrorProps);
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
  console.log(`Swagger docs available at http://localhost:${port}/docs`);
});
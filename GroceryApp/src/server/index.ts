import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import healthRouter from './health';

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(helmet()); // Security headers
app.use(cors()); // Enable CORS
app.use(compression()); // Enable compression
app.use(express.json()); // Parse JSON bodies

// Routes
app.use(healthRouter);

// Error handling middleware
app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack);
  res.status(500).json({
    status: 'error',
    message: 'Internal Server Error',
    timestamp: new Date().toISOString(),
  });
});

// Start server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
  console.log(`Health check available at http://localhost:${port}/health`);
}); 
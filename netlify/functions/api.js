// netlify/functions/api.js
import express from 'express';
import serverless from 'serverless-http';
import { setupAuth } from '../../server/auth';
import { registerRoutes } from '../../server/routes';

// Create Express app
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Setup authentication
setupAuth(app);

// Setup all routes
registerRoutes(app);

// Error handler
app.use((err, _req, res, _next) => {
  console.error('Server error:', err);
  const status = err.status || err.statusCode || 500;
  const message = err.message || "Internal Server Error";
  res.status(status).json({ message });
});

// Export the serverless function
export const handler = serverless(app);
// api/vercel-api.js
import express from 'express';
import { createServer } from 'http';
import { registerRoutes } from '../server/routes.js';
import { setupAuth } from '../server/auth.js';

// Create Express app
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Basic logging middleware
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

// Setup authentication
setupAuth(app);

// Setup all routes
const server = createServer(app);
registerRoutes(app);

// Error handler
app.use((err, _req, res, _next) => {
  console.error('Server error:', err);
  const status = err.status || err.statusCode || 500;
  const message = err.message || "Internal Server Error";
  res.status(status).json({ message });
});

// Export for Vercel
export default app;
// This is a special entry point for Vercel deployment
import express from 'express';
import { createServer } from 'http';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Import the registerRoutes function directly
import { registerRoutes } from './server/routes.js';

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Setup basic logging
app.use((req, res, next) => {
  const start = Date.now();
  res.on("finish", () => {
    const duration = Date.now() - start;
    console.log(`${req.method} ${req.path} ${res.statusCode} in ${duration}ms`);
  });
  next();
});

// Register all our API routes
const server = await registerRoutes(app);

// Serve static files in production
const distPath = resolve(__dirname, 'dist', 'client');

if (fs.existsSync(distPath)) {
  app.use(express.static(distPath));
  
  // Fall through to index.html for SPA routes
  app.get('*', (req, res) => {
    res.sendFile(resolve(distPath, 'index.html'));
  });
} else {
  console.error(`Could not find the build directory: ${distPath}`);
  app.get('*', (req, res) => {
    res.status(500).send('Server is not properly built. Please check build configuration.');
  });
}

// Error handler
app.use((err, _req, res, _next) => {
  console.error('Server error:', err);
  const status = err.status || err.statusCode || 500;
  const message = err.message || "Internal Server Error";
  res.status(status).json({ message });
});

// Start the server
const PORT = process.env.PORT || 3000;
server.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
});

// Export for Vercel
export default app;
// Simple Express server for deployment
const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

// Serve static files
app.use(express.static('dist'));

// API routes
app.get('/api', (req, res) => {
  res.json({ status: 'ok', message: 'Skillbag Book Club API' });
});

// All other routes serve the index.html
app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
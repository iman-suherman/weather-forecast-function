const functions = require('@google-cloud/functions-framework');
const express = require('express');
const path = require('path');

const app = express();

// CORS middleware
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }
  next();
});

// Serve static files from the out directory
app.use('/weather-forecast/_next', express.static(path.join(__dirname, 'out/_next'), {
  setHeaders: (res, filePath) => {
    if (filePath.endsWith('.js')) {
      res.setHeader('Content-Type', 'application/javascript; charset=utf-8');
    } else if (filePath.endsWith('.css')) {
      res.setHeader('Content-Type', 'text/css; charset=utf-8');
    } else if (filePath.endsWith('.woff2')) {
      res.setHeader('Content-Type', 'font/woff2');
    } else if (filePath.endsWith('.html')) {
      res.setHeader('Content-Type', 'text/html; charset=utf-8');
    }
  }
}));

// Serve static files from public directory
app.use('/weather-forecast', express.static(path.join(__dirname, 'out')));

// Handle all other routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'out/index.html'));
});

// Export the Cloud Function
exports.app = async (req, res) => {
  try {
    app(req, res);
  } catch (err) {
    console.error('Error occurred handling', req.url, err);
    res.status(500).send('Internal Server Error');
  }
}; 
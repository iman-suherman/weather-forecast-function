const express = require('express');
const path = require('path');
const fs = require('fs');

const server = express();

server.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }
  next();
});

// Serve static files from out directory with proper content types
server.use('/weather-forecast', express.static(path.join(__dirname, 'out'), {
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

// Handle all requests
server.all('*', (req, res) => {
  const requestedPath = req.path;
  const filePath = path.join(__dirname, 'out', requestedPath);

  fs.access(filePath, fs.constants.F_OK, (err) => {
    if (err) {
      res.sendFile(path.join(__dirname, 'out', 'index.html'));
    } else {
      res.sendFile(filePath);
    }
  });
});

exports.app = async (req, res) => {
  try {
    server(req, res);
  } catch (err) {
    console.error('Error occurred handling', req.url, err);
    res.statusCode = 500;
    res.setHeader('Content-Type', 'text/plain');
    res.end('Internal Server Error');
  }
}; 
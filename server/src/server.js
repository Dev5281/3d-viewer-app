// server/src/server.js
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config();

const uploadRoutes = require('./routes/uploadRoutes');
const settingsRoutes = require('./routes/settingsRoutes');

const app = express();

// Configure CORS to allow requests from Vercel and localhost
// More permissive CORS for Vercel deployments
const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps, curl, or server-to-server requests)
    if (!origin) {
      console.log('CORS: No origin, allowing request');
      return callback(null, true);
    }
    
    console.log('CORS: Checking origin:', origin);
    
    // List of allowed origins
    const allowedOrigins = [
      'http://localhost:5173',
      'http://localhost:3000',
      'http://localhost:5174',
      process.env.FRONTEND_URL, // Your Vercel frontend URL
    ].filter(Boolean);
    
    // Allow all Vercel preview and production URLs (more permissive check)
    // Match any subdomain of vercel.app
    const isVercelDomain = /https?:\/\/[^/]+\.vercel\.app/.test(origin);
    
    // Check if origin is in allowed list or is a Vercel domain
    const isAllowed = 
      allowedOrigins.indexOf(origin) !== -1 || 
      isVercelDomain ||
      process.env.NODE_ENV === 'development' ||
      !process.env.VERCEL; // Allow all origins when not on Vercel (for local dev)
    
    if (isAllowed) {
      console.log('CORS: Origin allowed:', origin);
      callback(null, true);
    } else {
      // Log for debugging
      console.log('CORS blocked origin:', origin);
      console.log('Allowed origins:', allowedOrigins);
      console.log('Is Vercel domain:', isVercelDomain);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  exposedHeaders: ['Content-Length', 'Content-Type'],
  maxAge: 86400, // 24 hours
};

app.use(cors(corsOptions));
app.use(express.json({ limit: '50mb' })); // Increase limit for file uploads
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads')));

// API routes
app.use('/api/upload', uploadRoutes);
app.use('/api/settings', settingsRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
    vercel: !!process.env.VERCEL
  });
});

// Root endpoint for testing
app.get('/', (req, res) => {
  res.json({ 
    message: '3D Viewer API Server',
    status: 'running',
    endpoints: ['/api/upload', '/api/settings', '/api/health']
  });
});

// Connect to MongoDB
if (process.env.MONGO_URI) {
  mongoose
    .connect(process.env.MONGO_URI)
    .then(() => {
      console.log('MongoDB connected');
    })
    .catch((err) => {
      console.error('MongoDB connection error:', err);
    });
}

// For Vercel serverless functions, export the app
// For local development, start the server
// Always export for Vercel compatibility
module.exports = app;

// Only start the server if not on Vercel (local development)
if (!process.env.VERCEL) {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

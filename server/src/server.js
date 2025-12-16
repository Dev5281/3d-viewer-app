// server/src/server.js
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config();

const uploadRoutes = require('./routes/uploadRoutes');
const settingsRoutes = require('./routes/settingsRoutes');

const app = express();

// Manual CORS middleware as fallback (runs before everything)
app.use((req, res, next) => {
  const origin = req.headers.origin;
  const isVercelOrigin = origin && (origin.includes('.vercel.app') || origin.includes('vercel.app'));
  
  if (origin && (isVercelOrigin || origin.includes('localhost'))) {
    res.setHeader('Access-Control-Allow-Origin', origin);
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS, PATCH');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With, Accept');
    res.setHeader('Access-Control-Expose-Headers', 'Content-Length, Content-Type');
    res.setHeader('Access-Control-Max-Age', '86400');
  }
  
  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  
  next();
});

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
    // Match any subdomain of vercel.app - this is the key fix
    const isVercelDomain = /https?:\/\/[^/]+\.vercel\.app/.test(origin) || 
                          origin.includes('vercel.app');
    
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
      // Log for debugging but still allow on Vercel (fail open for debugging)
      console.log('CORS: Origin not explicitly allowed:', origin);
      console.log('Allowed origins:', allowedOrigins);
      console.log('Is Vercel domain:', isVercelDomain);
      // On Vercel, be more permissive - allow the request
      if (process.env.VERCEL) {
        console.log('CORS: Allowing on Vercel (permissive mode)');
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept'],
  exposedHeaders: ['Content-Length', 'Content-Type'],
  maxAge: 86400, // 24 hours
};

// Apply CORS to all routes FIRST
app.use(cors(corsOptions));

// Handle OPTIONS preflight requests explicitly
app.options('*', cors(corsOptions));

app.use(express.json({ limit: '50mb' })); // Increase limit for file uploads
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads')));

// API routes
app.use('/api/upload', uploadRoutes);
app.use('/api/settings', settingsRoutes);

// Handle requests missing /api prefix (common mistake)
app.post('/upload', cors(corsOptions), (req, res) => {
  res.status(400).json({ 
    error: 'Invalid endpoint. Use /api/upload instead.',
    correctEndpoint: '/api/upload'
  });
});

app.get('/settings', cors(corsOptions), (req, res) => {
  res.status(400).json({ 
    error: 'Invalid endpoint. Use /api/settings instead.',
    correctEndpoint: '/api/settings'
  });
});

app.post('/settings', cors(corsOptions), (req, res) => {
  res.status(400).json({ 
    error: 'Invalid endpoint. Use /api/settings instead.',
    correctEndpoint: '/api/settings'
  });
});

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

// 404 handler with CORS headers
app.use((req, res) => {
  // Ensure CORS headers are set even for 404s
  const origin = req.headers.origin;
  if (origin && (origin.includes('.vercel.app') || origin.includes('localhost'))) {
    res.setHeader('Access-Control-Allow-Origin', origin);
    res.setHeader('Access-Control-Allow-Credentials', 'true');
  }
  
  res.status(404).json({ 
    error: 'Endpoint not found',
    path: req.path,
    method: req.method,
    availableEndpoints: ['/api/upload', '/api/settings', '/api/health']
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
